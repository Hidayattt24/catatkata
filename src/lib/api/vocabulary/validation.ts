import { PartOfSpeech, LearningStatus } from "./types";
import { CreateVocabularyDTO, UpdateVocabularyDTO } from "./dto";
import { ValidationError } from "../errors";

const VALID_POS: PartOfSpeech[] = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Phrase",
  "Idiom",
  "Other",
];

const VALID_STATUSES: LearningStatus[] = ["learning", "reviewing", "mastered"];

export function validateCreateVocabulary(input: CreateVocabularyDTO): CreateVocabularyDTO {
  const indonesian = input.indonesian?.trim();
  const english = input.english?.trim();

  if (!indonesian) {
    throw new ValidationError("indonesian word is required");
  }
  if (!english) {
    throw new ValidationError("english word is required");
  }

  if (input.part_of_speech && !VALID_POS.includes(input.part_of_speech)) {
    throw new ValidationError("invalid part_of_speech value");
  }

  if (input.status && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError("invalid status value");
  }

  return {
    indonesian,
    english,
    part_of_speech: input.part_of_speech || undefined,
    example_sentence: input.example_sentence?.trim() || undefined,
    note: input.note?.trim() || undefined,
    is_favorite: Boolean(input.is_favorite),
    status: input.status || "learning",
  };
}

export function validateUpdateVocabulary(input: UpdateVocabularyDTO): UpdateVocabularyDTO {
  const payload: UpdateVocabularyDTO = {};

  if (input.indonesian !== undefined) {
    const trimmed = input.indonesian.trim();
    if (!trimmed) throw new ValidationError("indonesian word cannot be empty");
    payload.indonesian = trimmed;
  }

  if (input.english !== undefined) {
    const trimmed = input.english.trim();
    if (!trimmed) throw new ValidationError("english word cannot be empty");
    payload.english = trimmed;
  }

  if (input.part_of_speech !== undefined) {
    if (input.part_of_speech && !VALID_POS.includes(input.part_of_speech)) {
      throw new ValidationError("invalid part_of_speech value");
    }
    payload.part_of_speech = input.part_of_speech || undefined;
  }

  if (input.example_sentence !== undefined) {
    payload.example_sentence = input.example_sentence?.trim() || undefined;
  }

  if (input.note !== undefined) {
    payload.note = input.note?.trim() || undefined;
  }

  if (input.is_favorite !== undefined) {
    payload.is_favorite = Boolean(input.is_favorite);
  }

  if (input.status !== undefined) {
    if (!VALID_STATUSES.includes(input.status)) {
      throw new ValidationError("invalid status value");
    }
    payload.status = input.status;
  }

  return payload;
}

export function validateLearningStatus(status: unknown): LearningStatus {
  if (typeof status !== "string" || !VALID_STATUSES.includes(status as LearningStatus)) {
    throw new ValidationError("invalid learning status value");
  }
  return status as LearningStatus;
}
