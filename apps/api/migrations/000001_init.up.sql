-- Create Enum Types
DO $$ BEGIN
    CREATE TYPE part_of_speech_enum AS ENUM (
        'Noun', 'Verb', 'Adjective', 'Adverb', 'Phrase', 'Idiom', 'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE learning_status_enum AS ENUM (
        'learning', 'reviewing', 'mastered'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Vocabularies Table
CREATE TABLE IF NOT EXISTS vocabularies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    indonesian TEXT NOT NULL,
    english TEXT NOT NULL,
    part_of_speech part_of_speech_enum,
    example_sentence TEXT,
    note TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    status learning_status_enum NOT NULL DEFAULT 'learning',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance & quick search
CREATE INDEX IF NOT EXISTS idx_vocabularies_user_id ON vocabularies(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabularies_status ON vocabularies(user_id, status);
CREATE INDEX IF NOT EXISTS idx_vocabularies_favorite ON vocabularies(user_id, is_favorite);

-- Enable Row Level Security (RLS) for Supabase Postgres
ALTER TABLE vocabularies ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can manage their own vocabularies"
    ON vocabularies
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
