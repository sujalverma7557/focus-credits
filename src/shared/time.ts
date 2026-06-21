import type { FocusSession } from "../types/focus";

export function getRemainingSeconds(
  session: FocusSession
) {
  if (
    !session.isRunning ||
    !session.startTime ||
    !session.durationMinutes
  ) {
    return 0;
  }

  const endTime =
    session.startTime +
    session.durationMinutes *
      60 *
      1000;

  return Math.max(
    0,
    Math.floor(
      (endTime - Date.now()) / 1000
    )
  );
}

export function isSessionComplete(
    session: FocusSession
  ) {
    if (
      !session.isRunning ||
      !session.startTime ||
      !session.durationMinutes
    ) {
      return false;
    }
  
    const endTime =
      session.startTime +
      session.durationMinutes *
        60 *
        1000;
  
    return Date.now() >= endTime;
  }