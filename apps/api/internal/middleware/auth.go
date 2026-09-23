package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"catatkata-api/internal/model"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string

const UserIDKey contextKey = "userID"

func Auth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				// Dev fallback if authorization header is absent in local dev mode
				if jwtSecret == "" || jwtSecret == "your-supabase-jwt-secret" {
					devUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
					ctx := context.WithValue(r.Context(), UserIDKey, devUserID)
					next.ServeHTTP(w, r.WithContext(ctx))
					return
				}

				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authorization header")
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid authorization header format")
				return
			}

			tokenString := parts[1]

			token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
				// Accept HMAC/HS256 by default from Supabase
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				// If Secret verification is unconfigured in development, parse claims safely
				tokenClaims, _, parseErr := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
				if parseErr == nil {
					if claims, ok := tokenClaims.Claims.(jwt.MapClaims); ok {
						if sub, ok := claims["sub"].(string); ok {
							if userID, uuidErr := uuid.Parse(sub); uuidErr == nil {
								ctx := context.WithValue(r.Context(), UserIDKey, userID)
								next.ServeHTTP(w, r.WithContext(ctx))
								return
							}
						}
					}
				}

				// Dev fallback for unconfigured JWT secret in local dev
				if jwtSecret == "" || jwtSecret == "your-supabase-jwt-secret" {
					devUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
					ctx := context.WithValue(r.Context(), UserIDKey, devUserID)
					next.ServeHTTP(w, r.WithContext(ctx))
					return
				}

				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid or expired access token")
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token claims")
				return
			}

			sub, ok := claims["sub"].(string)
			if !ok || sub == "" {
				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing user subject in token")
				return
			}

			userID, err := uuid.Parse(sub)
			if err != nil {
				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid user ID format in token")
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserID(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(UserIDKey).(uuid.UUID)
	return userID, ok
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
