import { Verb, PaginatedVerbs } from "./types";
import { CreateVerbDTO, UpdateVerbDTO, ListVerbQuery } from "./dto";
import { VerbRepository } from "./repository";
import { validateCreateVerb, validateUpdateVerb } from "./validation";

export interface VerbService {
  create(userID: string, token: string, input: CreateVerbDTO): Promise<Verb>;
  getByID(userID: string, token: string, id: string): Promise<Verb>;
  list(userID: string, token: string, options: ListVerbQuery): Promise<PaginatedVerbs>;
  update(userID: string, token: string, id: string, input: UpdateVerbDTO): Promise<Verb>;
  delete(userID: string, token: string, id: string): Promise<void>;
}

export class VerbServiceImpl implements VerbService {
  constructor(private repo: VerbRepository) {}

  async create(userID: string, token: string, input: CreateVerbDTO): Promise<Verb> {
    const validated = validateCreateVerb(input);
    return this.repo.create(userID, token, validated);
  }

  async getByID(userID: string, token: string, id: string): Promise<Verb> {
    return this.repo.getByID(userID, token, id);
  }

  async list(userID: string, token: string, options: ListVerbQuery): Promise<PaginatedVerbs> {
    return this.repo.list(userID, token, options);
  }

  async update(userID: string, token: string, id: string, input: UpdateVerbDTO): Promise<Verb> {
    const validated = validateUpdateVerb(input);
    return this.repo.update(userID, token, id, validated);
  }

  async delete(userID: string, token: string, id: string): Promise<void> {
    return this.repo.delete(userID, token, id);
  }
}
