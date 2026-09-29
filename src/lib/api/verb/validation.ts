import { CreateVerbDTO, UpdateVerbDTO } from "./dto";
import { ValidationError } from "../errors";

function requireTrimmed(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} is required`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ValidationError(`${field} is required`);
  }
  return trimmed;
}

export function validateCreateVerb(input: CreateVerbDTO): CreateVerbDTO {
  return {
    indonesian: requireTrimmed(input.indonesian, "indonesian"),
    v1: requireTrimmed(input.v1, "v1"),
    v2: requireTrimmed(input.v2, "v2"),
    v3: requireTrimmed(input.v3, "v3"),
    ving: requireTrimmed(input.ving, "ving"),
  };
}

export function validateUpdateVerb(input: UpdateVerbDTO): UpdateVerbDTO {
  const payload: UpdateVerbDTO = {};

  if (input.indonesian !== undefined) {
    payload.indonesian = requireTrimmed(input.indonesian, "indonesian");
  }
  if (input.v1 !== undefined) {
    payload.v1 = requireTrimmed(input.v1, "v1");
  }
  if (input.v2 !== undefined) {
    payload.v2 = requireTrimmed(input.v2, "v2");
  }
  if (input.v3 !== undefined) {
    payload.v3 = requireTrimmed(input.v3, "v3");
  }
  if (input.ving !== undefined) {
    payload.ving = requireTrimmed(input.ving, "ving");
  }

  return payload;
}
