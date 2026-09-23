package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"catatkata-api/internal/middleware"
	"catatkata-api/internal/model"
	"catatkata-api/internal/service"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type VocabularyHandler struct {
	service service.VocabularyService
}

func NewVocabularyHandler(service service.VocabularyService) *VocabularyHandler {
	return &VocabularyHandler{service: service}
}

func (h *VocabularyHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	q := r.URL.Query().Get("q")
	status := r.URL.Query().Get("status")

	var favorite *bool
	favParam := r.URL.Query().Get("favorite")
	if favParam != "" {
		val := favParam == "true" || favParam == "1"
		favorite = &val
	}

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	resp, err := h.service.List(r.Context(), userID, q, status, favorite, page, limit)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve vocabularies")
		return
	}

	respondJSON(w, http.StatusOK, resp)
}

func (h *VocabularyHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	var req model.CreateVocabularyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Malformed JSON request body")
		return
	}

	vocab, err := h.service.Create(r.Context(), userID, req)
	if err != nil {
		respondError(w, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, vocab)
}

func (h *VocabularyHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vocabulary ID format")
		return
	}

	vocab, err := h.service.GetByID(r.Context(), userID, id)
	if err != nil {
		respondError(w, http.StatusNotFound, "NOT_FOUND", "Vocabulary not found")
		return
	}

	respondJSON(w, http.StatusOK, vocab)
}

func (h *VocabularyHandler) Update(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vocabulary ID format")
		return
	}

	var req model.UpdateVocabularyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Malformed JSON request body")
		return
	}

	vocab, err := h.service.Update(r.Context(), userID, id, req)
	if err != nil {
		respondError(w, http.StatusBadRequest, "UPDATE_FAILED", err.Error())
		return
	}

	respondJSON(w, http.StatusOK, vocab)
}

func (h *VocabularyHandler) UpdateFavorite(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vocabulary ID format")
		return
	}

	var req model.UpdateFavoriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Malformed JSON request body")
		return
	}

	if err := h.service.UpdateFavorite(r.Context(), userID, id, req.IsFavorite); err != nil {
		respondError(w, http.StatusBadRequest, "UPDATE_FAILED", err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success":     true,
		"is_favorite": req.IsFavorite,
	})
}

func (h *VocabularyHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vocabulary ID format")
		return
	}

	var req model.UpdateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Malformed JSON request body")
		return
	}

	if err := h.service.UpdateStatus(r.Context(), userID, id, req.Status); err != nil {
		respondError(w, http.StatusBadRequest, "UPDATE_FAILED", err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"status":  req.Status,
	})
}

func (h *VocabularyHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "User identity missing")
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vocabulary ID format")
		return
	}

	if err := h.service.Delete(r.Context(), userID, id); err != nil {
		respondError(w, http.StatusBadRequest, "DELETE_FAILED", err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Vocabulary deleted successfully",
	})
}

func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func respondError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(model.ErrorResponse{
		Error: model.APIError{
			Code:    code,
			Message: message,
		},
	})
}
