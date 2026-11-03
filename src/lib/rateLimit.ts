// In-memory failed-login limiter: 5 failures per key (email or IP) within 15 minutes.
// LIMITATION: state lives in this process only. It resets on restart and is not shared across instances.

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

const failures = new Map<string, number[]>();

function prune(key: string, now: number): number[] {
  const recent = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length > 0) failures.set(key, recent);
  else failures.delete(key);
  return recent;
}

/** Returns the seconds until the key is unblocked, or 0 when it is not blocked. */
export function blockedForSeconds(key: string): number {
  const now = Date.now();
  const recent = prune(key, now);
  if (recent.length < MAX_FAILURES) return 0;
  return Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const recent = prune(key, now);
  recent.push(now);
  failures.set(key, recent);
  // Keep memory bounded: drop the oldest keys if the map grows too large.
  if (failures.size > 5000) {
    const oldest = failures.keys().next().value;
    if (oldest !== undefined) failures.delete(oldest);
  }
}

export function resetFailures(key: string): void {
  failures.delete(key);
}

export const loginKeys = (email: string, ip: string): string[] => [`email:${email.toLowerCase()}`, `ip:${ip}`];
