/** Messages unlock at local midnight on Dec 25 of the current holiday year. */

export function holidayYear(now = new Date()): number {
  // After Christmas, the next unlock is next December.
  if (now.getMonth() === 11 && now.getDate() > 25) return now.getFullYear() + 1;
  if (now.getMonth() === 11) return now.getFullYear();
  return now.getFullYear();
}

export function unlockDate(now = new Date()): Date {
  return new Date(holidayYear(now), 11, 25, 0, 0, 0, 0);
}

export function isUnlocked(now = new Date(), demoUnlock = false): boolean {
  if (demoUnlock) return true;
  return now.getTime() >= unlockDate(now).getTime();
}

export function msUntilUnlock(now = new Date()): number {
  return Math.max(0, unlockDate(now).getTime() - now.getTime());
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

export function countdownParts(now = new Date()): CountdownParts {
  const ms = msUntilUnlock(now);
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, done: false };
}
