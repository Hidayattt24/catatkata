package repository

import (
	"context"
	"fmt"
	"log"
	"strings"

	"catatkata-api/internal/model"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VocabularyRepository interface {
	Create(ctx context.Context, vocab *model.Vocabulary) error
	GetByID(ctx context.Context, userID, id uuid.UUID) (*model.Vocabulary, error)
	List(ctx context.Context, userID uuid.UUID, query string, status string, favorite *bool, page, limit int) ([]model.Vocabulary, int, error)
	Update(ctx context.Context, vocab *model.Vocabulary) error
	UpdateFavorite(ctx context.Context, userID, id uuid.UUID, isFavorite bool) error
	UpdateStatus(ctx context.Context, userID, id uuid.UUID, status model.LearningStatus) error
	Delete(ctx context.Context, userID, id uuid.UUID) error
}

type postgresRepo struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) VocabularyRepository {
	return &postgresRepo{pool: pool}
}

func (r *postgresRepo) Create(ctx context.Context, v *model.Vocabulary) error {
	query := `
		INSERT INTO vocabularies (user_id, indonesian, english, part_of_speech, example_sentence, note, is_favorite, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	err := r.pool.QueryRow(ctx, query,
		v.UserID, v.Indonesian, v.English, v.PartOfSpeech, v.ExampleSentence, v.Note, v.IsFavorite, v.Status,
	).Scan(&v.ID, &v.CreatedAt, &v.UpdatedAt)

	if err != nil {
		log.Printf("[PostgresRepo] Create error: %v", err)
	}
	return err
}

func (r *postgresRepo) GetByID(ctx context.Context, userID, id uuid.UUID) (*model.Vocabulary, error) {
	query := `
		SELECT id, user_id, indonesian, english, part_of_speech, example_sentence, note, is_favorite, status, created_at, updated_at
		FROM vocabularies
		WHERE id = $1 AND user_id = $2
	`
	var v model.Vocabulary
	err := r.pool.QueryRow(ctx, query, id, userID).Scan(
		&v.ID, &v.UserID, &v.Indonesian, &v.English, &v.PartOfSpeech, &v.ExampleSentence, &v.Note, &v.IsFavorite, &v.Status, &v.CreatedAt, &v.UpdatedAt,
	)
	if err != nil {
		log.Printf("[PostgresRepo] GetByID error: %v", err)
		return nil, err
	}
	return &v, nil
}

func (r *postgresRepo) List(ctx context.Context, userID uuid.UUID, q string, status string, favorite *bool, page, limit int) ([]model.Vocabulary, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	whereClause := []string{"user_id = $1"}
	args := []interface{}{userID}
	paramIdx := 2

	if q != "" {
		whereClause = append(whereClause, fmt.Sprintf("(LOWER(indonesian) LIKE $%d OR LOWER(english) LIKE $%d OR LOWER(COALESCE(example_sentence, '')) LIKE $%d)", paramIdx, paramIdx, paramIdx))
		args = append(args, "%"+strings.ToLower(q)+"%")
		paramIdx++
	}

	if status != "" && status != "all" {
		whereClause = append(whereClause, fmt.Sprintf("status = $%d", paramIdx))
		args = append(args, status)
		paramIdx++
	}

	if favorite != nil {
		whereClause = append(whereClause, fmt.Sprintf("is_favorite = $%d", paramIdx))
		args = append(args, *favorite)
		paramIdx++
	}

	whereStmt := strings.Join(whereClause, " AND ")

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM vocabularies WHERE %s", whereStmt)
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		log.Printf("[PostgresRepo] List count error: %v", err)
		return nil, 0, err
	}

	selectQuery := fmt.Sprintf(`
		SELECT id, user_id, indonesian, english, part_of_speech, example_sentence, note, is_favorite, status, created_at, updated_at
		FROM vocabularies
		WHERE %s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereStmt, paramIdx, paramIdx+1)

	args = append(args, limit, offset)

	rows, err := r.pool.Query(ctx, selectQuery, args...)
	if err != nil {
		log.Printf("[PostgresRepo] List query error: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	var result []model.Vocabulary
	for rows.Next() {
		var v model.Vocabulary
		if err := rows.Scan(&v.ID, &v.UserID, &v.Indonesian, &v.English, &v.PartOfSpeech, &v.ExampleSentence, &v.Note, &v.IsFavorite, &v.Status, &v.CreatedAt, &v.UpdatedAt); err != nil {
			log.Printf("[PostgresRepo] List scan error: %v", err)
			return nil, 0, err
		}
		result = append(result, v)
	}

	if result == nil {
		result = []model.Vocabulary{}
	}

	return result, total, nil
}

func (r *postgresRepo) Update(ctx context.Context, v *model.Vocabulary) error {
	query := `
		UPDATE vocabularies
		SET indonesian = $1, english = $2, part_of_speech = $3, example_sentence = $4, note = $5, is_favorite = $6, status = $7, updated_at = NOW()
		WHERE id = $8 AND user_id = $9
		RETURNING updated_at
	`
	err := r.pool.QueryRow(ctx, query,
		v.Indonesian, v.English, v.PartOfSpeech, v.ExampleSentence, v.Note, v.IsFavorite, v.Status, v.ID, v.UserID,
	).Scan(&v.UpdatedAt)

	if err != nil {
		log.Printf("[PostgresRepo] Update error: %v", err)
	}
	return err
}

func (r *postgresRepo) UpdateFavorite(ctx context.Context, userID, id uuid.UUID, isFavorite bool) error {
	query := `
		UPDATE vocabularies
		SET is_favorite = $1, updated_at = NOW()
		WHERE id = $2 AND user_id = $3
	`
	res, err := r.pool.Exec(ctx, query, isFavorite, id, userID)
	if err != nil {
		log.Printf("[PostgresRepo] UpdateFavorite error: %v", err)
		return err
	}
	if res.RowsAffected() == 0 {
		return fmt.Errorf("vocabulary not found or unauthorized")
	}
	return nil
}

func (r *postgresRepo) UpdateStatus(ctx context.Context, userID, id uuid.UUID, status model.LearningStatus) error {
	query := `
		UPDATE vocabularies
		SET status = $1, updated_at = NOW()
		WHERE id = $2 AND user_id = $3
	`
	res, err := r.pool.Exec(ctx, query, status, id, userID)
	if err != nil {
		log.Printf("[PostgresRepo] UpdateStatus error: %v", err)
		return err
	}
	if res.RowsAffected() == 0 {
		return fmt.Errorf("vocabulary not found or unauthorized")
	}
	return nil
}

func (r *postgresRepo) Delete(ctx context.Context, userID, id uuid.UUID) error {
	query := `DELETE FROM vocabularies WHERE id = $1 AND user_id = $2`
	res, err := r.pool.Exec(ctx, query, id, userID)
	if err != nil {
		log.Printf("[PostgresRepo] Delete error: %v", err)
		return err
	}
	if res.RowsAffected() == 0 {
		return fmt.Errorf("vocabulary not found or unauthorized")
	}
	return nil
}
