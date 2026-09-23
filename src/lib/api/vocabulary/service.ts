import { Vocabulary, PaginatedVocabularies } from "./types";
import { CreateVocabularyDTO, UpdateVocabularyDTO, ListVocabularyQuery } from "./dto";
import { VocabularyRepository } from "./repository";
import {
  validateCreateVocabulary,
  validateUpdateVocabulary,
  validateLearningStatus,
} from "./validation";

export interface VocabularyService {
  create(userID: string, token: string, input: CreateVocabularyDTO): Promise<Vocabulary>;
  getByID(userID: string, token: string, id: string): Promise<Vocabulary>;
  list(userID: string, token: string, options: ListVocabularyQuery): Promise<PaginatedVocabularies>;
  update(userID: string, token: string, id: string, input: UpdateVocabularyDTO): Promise<Vocabulary>;
  updateFavorite(userID: string, token: string, id: string, isFavorite: boolean): Promise<void>;
  updateStatus(userID: string, token: string, id: string, status: string): Promise<void>;
  delete(userID: string, token: string, id: string): Promise<void>;
}

export class VocabularyServiceImpl implements VocabularyService {
  constructor(private repo: VocabularyRepository) {}

  async create(userID: string, token: string, input: CreateVocabularyDTO): Promise<Vocabulary> {
    const validated = validateCreateVocabulary(input);
    return this.repo.create(userID, token, validated);
  }

  async getByID(userID: string, token: string, id: string): Promise<Vocabulary> {
    return this.repo.getByID(userID, token, id);
  }

  async list(userID: string, token: string, options: ListVocabularyQuery): Promise<PaginatedVocabularies> {
    return this.repo.list(userID, token, options);
  }

  async update(userID: string, token: string, id: string, input: UpdateVocabularyDTO): Promise<Vocabulary> {
    const validated = validateUpdateVocabulary(input);
    return this.repo.update(userID, token, id, validated);
  }

  async updateFavorite(userID: string, token: string, id: string, isFavorite: boolean): Promise<void> {
    return this.repo.updateFavorite(userID, token, id, Boolean(isFavorite));
  }

  async updateStatus(userID: string, token: string, id: string, status: string): Promise<void> {
    const validatedStatus = validateLearningStatus(status);
    return this.repo.updateStatus(userID, token, id, validatedStatus);
  }

  async delete(userID: string, token: string, id: string): Promise<void> {
    return this.repo.delete(userID, token, id);
  }
}
