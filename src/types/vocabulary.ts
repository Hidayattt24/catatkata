export type PartOfSpeech =
  | "Noun"
  | "Verb"
  | "Adjective"
  | "Adverb"
  | "Phrase"
  | "Idiom"
  | "Other";

export type LearningStatus = "learning" | "reviewing" | "mastered";

export interface Vocabulary {
  id: string;
  user_id: string;
  indonesian: string;
  english: string;
  part_of_speech?: PartOfSpeech;
  example_sentence?: string;
  note?: string;
  is_favorite: boolean;
  status: LearningStatus;
  created_at: string;
  updated_at: string;
}

export type CreateVocabularyInput = Omit<
  Vocabulary,
  "id" | "user_id" | "created_at" | "updated_at" | "is_favorite" | "status"
> & {
  is_favorite?: boolean;
  status?: LearningStatus;
};

export type UpdateVocabularyInput = Partial<CreateVocabularyInput>;
