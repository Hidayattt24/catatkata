import { PartOfSpeech, LearningStatus } from "./types";

export interface CreateVocabularyDTO {
  indonesian: string;
  english: string;
  part_of_speech?: PartOfSpeech;
  example_sentence?: string;
  note?: string;
  is_favorite?: boolean;
  status?: LearningStatus;
}

export interface UpdateVocabularyDTO {
  indonesian?: string;
  english?: string;
  part_of_speech?: PartOfSpeech;
  example_sentence?: string;
  note?: string;
  is_favorite?: boolean;
  status?: LearningStatus;
}

export interface ListVocabularyQuery {
  q?: string;
  status?: string;
  favorite?: boolean;
  page?: number;
  limit?: number;
}
