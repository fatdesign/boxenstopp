const DAY_LABELS_DE: Record<string, string> = {
  monday: 'Mo',
  tuesday: 'Di',
  wednesday: 'Mi',
  thursday: 'Do',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'So',
};

export function formatSpecialDays(days?: string[]): string | null {
  if (!days || days.length === 0) return null;
  return days.map(d => DAY_LABELS_DE[d] || d).join(', ');
}

const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function isAvailableToday(specialDays?: string[]): boolean {
  if (!specialDays || specialDays.length === 0) return true;
  const today = WEEKDAY_KEYS[new Date().getDay()];
  return specialDays.includes(today);
}
