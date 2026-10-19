import { LockedInRepository } from "./repository";
import { CreateLockedInDTO, UpdateLockedInDTO, ListLockedInQuery } from "./dto";
import { LockedInTaskRecord, ListLockedInResult } from "./types";
import { validateCreateLockedIn, validateUpdateLockedIn } from "./validation";

export interface LockedInService {
  create(userID: string, token: string, input: CreateLockedInDTO): Promise<LockedInTaskRecord>;
  getByID(userID: string, token: string, id: string): Promise<LockedInTaskRecord>;
  list(userID: string, token: string, query: ListLockedInQuery): Promise<ListLockedInResult>;
  update(userID: string, token: string, id: string, input: UpdateLockedInDTO): Promise<LockedInTaskRecord>;
  delete(userID: string, token: string, id: string): Promise<void>;
}

export class LockedInServiceImpl implements LockedInService {
  constructor(private readonly repo: LockedInRepository) {}

  async create(userID: string, token: string, input: CreateLockedInDTO): Promise<LockedInTaskRecord> {
    const validated = validateCreateLockedIn(input);
    return this.repo.create(userID, token, validated);
  }

  async getByID(userID: string, token: string, id: string): Promise<LockedInTaskRecord> {
    return this.repo.getByID(userID, token, id);
  }

  async list(userID: string, token: string, query: ListLockedInQuery): Promise<ListLockedInResult> {
    return this.repo.list(userID, token, query);
  }

  async update(userID: string, token: string, id: string, input: UpdateLockedInDTO): Promise<LockedInTaskRecord> {
    const validated = validateUpdateLockedIn(input);
    return this.repo.update(userID, token, id, validated);
  }

  async delete(userID: string, token: string, id: string): Promise<void> {
    return this.repo.delete(userID, token, id);
  }
}
