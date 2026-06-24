import type { SocialSession } from "../types/socialSession";

export function getRemainingCredits(
  session: SocialSession
) {
  const elapsedMinutes = Math.floor(
    (Date.now() - session.startTime) / 60000
  );

  return Math.max(
    0,
    session.creditsAtStart - elapsedMinutes
  );
}