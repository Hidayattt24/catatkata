import { SupabaseVerbRepository } from "./repository";
import { VerbServiceImpl, VerbService } from "./service";

const repository = new SupabaseVerbRepository();
export const verbService: VerbService = new VerbServiceImpl(repository);
