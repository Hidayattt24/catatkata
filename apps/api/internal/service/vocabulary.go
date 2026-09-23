package service

import (
	"context"
	"errors"
	"strings"

	"catatkata-api/internal/model"
	"catatkata-api/internal/repository"

	"github.com/google/uuid"
)

type VocabularyService interface {
	Create(ctx context.Context, userID uuid.UUID, req model.CreateVocabularyRequest) (*model.Vocabulary, error)
	GetByID(ctx context.Context, userID, id uuid.UUID) (*model.Vocabulary, error)
	List(ctx context.Context, userID uuid.UUID, q string, status string, favorite *bool, page, limit int) (*model.PaginatedResponse, error)
	Update(ctx context.Context, userID, id uuid.UUID, req model.UpdateVocabularyRequest) (*model.Vocabulary, error)
	UpdateFavorite(ctx context.Context, userID, id uuid.UUID, isFavorite bool) error
	UpdateStatus(ctx context.Context, userID, id uuid.UUID, status model.LearningStatus) error
	Delete(ctx context.Context, userID, id uuid.UUID) error
}

type vocabService struct {
	repo repository.VocabularyRepository
}

func NewVocabularyService(repo repository.VocabularyRepository) VocabularyService {
	return &vocabService{repo: repo}
}

func (s *vocabService) Create(ctx context.Context, userID uuid.UUID, req model.CreateVocabularyRequest) (*model.Vocabulary, error) {
	indonesian := strings.TrimSpace(req.Indonesian)
	english := strings.TrimSpace(req.English)

	if indonesian == "" {
		return nil, errors.New("indonesian word is required")
	}
	if english == "" {
		return nil, errors.New("english word is required")
	}

	status := model.StatusLearning
	if req.Status != nil && *req.Status != "" {
		status = *req.Status
	}

	isFav := false
	if req.IsFavorite != nil {
		isFav = *req.IsFavorite
	}

	var sentence *string
	if req.ExampleSentence != nil {
		trimmed := strings.TrimSpace(*req.ExampleSentence)
		if trimmed != "" {
			sentence = &trimmed
		}
	}

	var note *string
	if req.Note != nil {
		trimmed := strings.TrimSpace(*req.Note)
		if trimmed != "" {
			note = &trimmed
		}
	}

	vocab := &model.Vocabulary{
		UserID:          userID,
		Indonesian:      indonesian,
		English:         english,
		PartOfSpeech:    req.PartOfSpeech,
		ExampleSentence: sentence,
		Note:            note,
		IsFavorite:      isFav,
		Status:          status,
	}

	if err := s.repo.Create(ctx, vocab); err != nil {
		return nil, err
	}

	return vocab, nil
}

func (s *vocabService) GetByID(ctx context.Context, userID, id uuid.UUID) (*model.Vocabulary, error) {
	return s.repo.GetByID(ctx, userID, id)
}

func (s *vocabService) List(ctx context.Context, userID uuid.UUID, q string, status string, favorite *bool, page, limit int) (*model.PaginatedResponse, error) {
	vocabList, total, err := s.repo.List(ctx, userID, strings.TrimSpace(q), status, favorite, page, limit)
	if err != nil {
		return nil, err
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	return &model.PaginatedResponse{
		Data: vocabList,
		Meta: model.MetaResponse{
			Page:  page,
			Limit: limit,
			Total: total,
		},
	}, nil
}

func (s *vocabService) Update(ctx context.Context, userID, id uuid.UUID, req model.UpdateVocabularyRequest) (*model.Vocabulary, error) {
	existing, err := s.repo.GetByID(ctx, userID, id)
	if err != nil {
		return nil, err
	}

	if req.Indonesian != nil {
		trimmed := strings.TrimSpace(*req.Indonesian)
		if trimmed == "" {
			return nil, errors.New("indonesian word cannot be empty")
		}
		existing.Indonesian = trimmed
	}

	if req.English != nil {
		trimmed := strings.TrimSpace(*req.English)
		if trimmed == "" {
			return nil, errors.New("english word cannot be empty")
		}
		existing.English = trimmed
	}

	if req.PartOfSpeech != nil {
		existing.PartOfSpeech = req.PartOfSpeech
	}

	if req.ExampleSentence != nil {
		trimmed := strings.TrimSpace(*req.ExampleSentence)
		if trimmed == "" {
			existing.ExampleSentence = nil
		} else {
			existing.ExampleSentence = &trimmed
		}
	}

	if req.Note != nil {
		trimmed := strings.TrimSpace(*req.Note)
		if trimmed == "" {
			existing.Note = nil
		} else {
			existing.Note = &trimmed
		}
	}

	if req.IsFavorite != nil {
		existing.IsFavorite = *req.IsFavorite
	}

	if req.Status != nil && *req.Status != "" {
		existing.Status = *req.Status
	}

	if err := s.repo.Update(ctx, existing); err != nil {
		return nil, err
	}

	return existing, nil
}

func (s *vocabService) UpdateFavorite(ctx context.Context, userID, id uuid.UUID, isFavorite bool) error {
	return s.repo.UpdateFavorite(ctx, userID, id, isFavorite)
}

func (s *vocabService) UpdateStatus(ctx context.Context, userID, id uuid.UUID, status model.LearningStatus) error {
	return s.repo.UpdateStatus(ctx, userID, id, status)
}

func (s *vocabService) Delete(ctx context.Context, userID, id uuid.UUID) error {
	return s.repo.Delete(ctx, userID, id)
}
