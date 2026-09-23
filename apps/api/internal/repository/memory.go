package repository

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	"catatkata-api/internal/model"

	"github.com/google/uuid"
)

type memoryRepo struct {
	mu           sync.RWMutex
	vocabularies map[uuid.UUID]*model.Vocabulary
}

func NewMemoryRepository() VocabularyRepository {
	return &memoryRepo{
		vocabularies: make(map[uuid.UUID]*model.Vocabulary),
	}
}

func (r *memoryRepo) Create(ctx context.Context, v *model.Vocabulary) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	now := time.Now()
	v.CreatedAt = now
	v.UpdatedAt = now

	// Clone to store
	cp := *v
	r.vocabularies[v.ID] = &cp
	return nil
}

func (r *memoryRepo) GetByID(ctx context.Context, userID, id uuid.UUID) (*model.Vocabulary, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	v, exists := r.vocabularies[id]
	if !exists {
		return nil, fmt.Errorf("vocabulary not found")
	}
	if v.UserID != userID && userID != uuid.Nil && v.UserID != uuid.MustParse("00000000-0000-0000-0000-000000000001") {
		return nil, fmt.Errorf("vocabulary not found")
	}

	cp := *v
	return &cp, nil
}

func (r *memoryRepo) List(ctx context.Context, userID uuid.UUID, q string, status string, favorite *bool, page, limit int) ([]model.Vocabulary, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	var filtered []model.Vocabulary
	qLower := strings.ToLower(strings.TrimSpace(q))

	for _, v := range r.vocabularies {
		// Filter by User ID (allow dev user fallback)
		if userID != uuid.Nil && v.UserID != userID && v.UserID != uuid.MustParse("00000000-0000-0000-0000-000000000001") {
			continue
		}

		// Filter by Query
		if qLower != "" {
			indoMatch := strings.Contains(strings.ToLower(v.Indonesian), qLower)
			engMatch := strings.Contains(strings.ToLower(v.English), qLower)
			sentMatch := v.ExampleSentence != nil && strings.Contains(strings.ToLower(*v.ExampleSentence), qLower)

			if !indoMatch && !engMatch && !sentMatch {
				continue
			}
		}

		// Filter by Status
		if status != "" && status != "all" && status != "favorite" {
			if string(v.Status) != status {
				continue
			}
		}

		// Filter by Favorite
		if favorite != nil {
			if v.IsFavorite != *favorite {
				continue
			}
		} else if status == "favorite" {
			if !v.IsFavorite {
				continue
			}
		}

		filtered = append(filtered, *v)
	}

	// Sort by CreatedAt descending
	sort.Slice(filtered, func(i, j int) bool {
		return filtered[i].CreatedAt.After(filtered[j].CreatedAt)
	})

	total := len(filtered)
	offset := (page - 1) * limit
	if offset >= total {
		return []model.Vocabulary{}, total, nil
	}

	end := offset + limit
	if end > total {
		end = total
	}

	return filtered[offset:end], total, nil
}

func (r *memoryRepo) Update(ctx context.Context, v *model.Vocabulary) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.vocabularies[v.ID]
	if !exists {
		return fmt.Errorf("vocabulary not found")
	}

	v.UpdatedAt = time.Now()
	v.CreatedAt = existing.CreatedAt
	v.UserID = existing.UserID

	cp := *v
	r.vocabularies[v.ID] = &cp
	return nil
}

func (r *memoryRepo) UpdateFavorite(ctx context.Context, userID, id uuid.UUID, isFavorite bool) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	v, exists := r.vocabularies[id]
	if !exists {
		return fmt.Errorf("vocabulary not found")
	}

	v.IsFavorite = isFavorite
	v.UpdatedAt = time.Now()
	return nil
}

func (r *memoryRepo) UpdateStatus(ctx context.Context, userID, id uuid.UUID, status model.LearningStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	v, exists := r.vocabularies[id]
	if !exists {
		return fmt.Errorf("vocabulary not found")
	}

	v.Status = status
	v.UpdatedAt = time.Now()
	return nil
}

func (r *memoryRepo) Delete(ctx context.Context, userID, id uuid.UUID) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.vocabularies[id]; !exists {
		return fmt.Errorf("vocabulary not found")
	}

	delete(r.vocabularies, id)
	return nil
}
