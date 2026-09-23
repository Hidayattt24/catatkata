package model

import (
	"time"

	"github.com/google/uuid"
)

type PartOfSpeech string

const (
	POSNoun      PartOfSpeech = "Noun"
	POSVerb      PartOfSpeech = "Verb"
	POSAdjective PartOfSpeech = "Adjective"
	POSAdverb    PartOfSpeech = "Adverb"
	POSPhrase    PartOfSpeech = "Phrase"
	POSIdiom     PartOfSpeech = "Idiom"
	POSOther     PartOfSpeech = "Other"
)

type LearningStatus string

const (
	StatusLearning  LearningStatus = "learning"
	StatusReviewing LearningStatus = "reviewing"
	StatusMastered  LearningStatus = "mastered"
)

type Vocabulary struct {
	ID              uuid.UUID      `json:"id"`
	UserID          uuid.UUID      `json:"user_id"`
	Indonesian      string         `json:"indonesian"`
	English         string         `json:"english"`
	PartOfSpeech    *PartOfSpeech  `json:"part_of_speech,omitempty"`
	ExampleSentence *string        `json:"example_sentence,omitempty"`
	Note            *string        `json:"note,omitempty"`
	IsFavorite      bool           `json:"is_favorite"`
	Status          LearningStatus `json:"status"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
}

type CreateVocabularyRequest struct {
	Indonesian      string          `json:"indonesian"`
	English         string          `json:"english"`
	PartOfSpeech    *PartOfSpeech   `json:"part_of_speech"`
	ExampleSentence *string         `json:"example_sentence"`
	Note            *string         `json:"note"`
	IsFavorite      *bool           `json:"is_favorite"`
	Status          *LearningStatus `json:"status"`
}

type UpdateVocabularyRequest struct {
	Indonesian      *string         `json:"indonesian"`
	English         *string         `json:"english"`
	PartOfSpeech    *PartOfSpeech   `json:"part_of_speech"`
	ExampleSentence *string         `json:"example_sentence"`
	Note            *string         `json:"note"`
	IsFavorite      *bool           `json:"is_favorite"`
	Status          *LearningStatus `json:"status"`
}

type UpdateFavoriteRequest struct {
	IsFavorite bool `json:"is_favorite"`
}

type UpdateStatusRequest struct {
	Status LearningStatus `json:"status"`
}

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error APIError `json:"error"`
}

type MetaResponse struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Total int `json:"total"`
}

type PaginatedResponse struct {
	Data []Vocabulary `json:"data"`
	Meta MetaResponse `json:"meta"`
}
