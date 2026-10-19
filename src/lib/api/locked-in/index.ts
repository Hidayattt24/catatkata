import { SupabaseLockedInRepository } from "./repository";
import { LockedInServiceImpl, LockedInService } from "./service";

const repository = new SupabaseLockedInRepository();
export const lockedInService: LockedInService = new LockedInServiceImpl(repository);
export * from "./types";
export * from "./dto";
