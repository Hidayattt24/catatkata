import { SupabaseVocabularyRepository } from "./repository";
import { VocabularyServiceImpl, VocabularyService } from "./service";

const repository = new SupabaseVocabularyRepository();
export const vocabularyService: VocabularyService = new VocabularyServiceImpl(repository);
