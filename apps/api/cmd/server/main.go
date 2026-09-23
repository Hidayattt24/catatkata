package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"catatkata-api/internal/config"
	"catatkata-api/internal/database"
	"catatkata-api/internal/handler"
	appMiddleware "catatkata-api/internal/middleware"
	"catatkata-api/internal/repository"
	"catatkata-api/internal/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Initialize Postgres DB Pool
	dbPool, err := database.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Printf("Warning: Database pool connection skipped or failed: %v", err)
	} else {
		defer dbPool.Close()
		log.Println("Connected to Supabase PostgreSQL database successfully.")
	}

	// Setup Repository, Service, Handler
	var repo repository.VocabularyRepository
	if dbPool != nil {
		repo = repository.NewPostgresRepository(dbPool)
		log.Println("Using PostgreSQL database repository.")
	} else {
		repo = repository.NewMemoryRepository()
		log.Println("Using In-Memory repository fallback (Database connection pool offline/unconfigured).")
	}

	vocabService := service.NewVocabularyService(repo)
	vocabHandler := handler.NewVocabularyHandler(vocabService)

	// Setup Chi Router
	r := chi.NewRouter()

	// Middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// CORS Configuration
	origins := strings.Split(cfg.AllowedOrigins, ",")
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   origins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health Check
	r.Get("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok","service":"catatkata-api"}`))
	})

	// Public Auth Config (supplies Supabase URL & Anon Key dynamically to frontend)
	r.Get("/api/v1/auth/config", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{
			"supabase_url":      cfg.SupabaseURL,
			"supabase_anon_key": cfg.SupabaseAnonKey,
		})
	})

	// Protected Vocabulary API v1 routes
	r.Route("/api/v1/vocabularies", func(r chi.Router) {
		r.Use(appMiddleware.Auth(cfg.SupabaseJWTSecret))

		r.Get("/", vocabHandler.List)
		r.Post("/", vocabHandler.Create)
		r.Get("/{id}", vocabHandler.GetByID)
		r.Put("/{id}", vocabHandler.Update)
		r.Patch("/{id}/favorite", vocabHandler.UpdateFavorite)
		r.Patch("/{id}/status", vocabHandler.UpdateStatus)
		r.Delete("/{id}", vocabHandler.Delete)
	})

	// Start HTTP Server
	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("CatatKata Go API Server listening on port %s...", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful Shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("Shutting down API server gracefully...")
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server forced shutdown: %v", err)
	}

	fmt.Println("Server exited successfully.")
}
