import { CreateLockedInDTO, UpdateLockedInDTO } from "./dto";
import { ValidationError } from "../errors";

function requireTrimmed(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} is required`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ValidationError(`${field} cannot be empty`);
  }
  return trimmed;
}

export function validateCreateLockedIn(input: CreateLockedInDTO): CreateLockedInDTO {
  const text = requireTrimmed(input.text, "text");
  let duration = input.duration_minutes;
  if (duration !== undefined && duration !== null) {
    duration = Number(duration);
    if (isNaN(duration) || duration < 0) {
      throw new ValidationError("duration_minutes must be a non-negative number");
    }
  }

  return {
    text,
    date: input.date,
    duration_minutes: duration ?? null,
  };
}

export function validateUpdateLockedIn(input: UpdateLockedInDTO): UpdateLockedInDTO {
  const payload: UpdateLockedInDTO = {};

  if (input.text !== undefined) {
    payload.text = requireTrimmed(input.text, "text");
  }

  if (input.completed !== undefined) {
    payload.completed = Boolean(input.completed);
    payload.completed_at = payload.completed ? new Date().toISOString() : null;
  }

  if (input.duration_minutes !== undefined) {
    if (input.duration_minutes === null) {
      payload.duration_minutes = null;
    } else {
      const duration = Number(input.duration_minutes);
      if (isNaN(duration) || duration < 0) {
        throw new ValidationError("duration_minutes must be a non-negative number");
      }
      payload.duration_minutes = duration;
    }
  }

  return payload;
}
