import { DINER_INFO } from '../config/dinerConfig';
import type { OpeningHours } from '../config/dinerConfig';
export type StatusType = 'open' | 'closed' | 'closing-soon';
export interface OpenStatus { status: StatusType; message: string; }
export function getCurrentStatus(openingHours: OpeningHours = DINER_INFO.openingHours): OpenStatus {
  const now = new Date();
  const dayIndex = now.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const currentDayStr = days[dayIndex];
  const todayHours = openingHours[currentDayStr];
  if (!todayHours) return { status: 'closed', message: 'Heute geschlossen' };
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  if (currentTime < todayHours.open) return { status: 'closed', message: `Öffnet heute um ${todayHours.open} Uhr` };
  if (currentTime >= todayHours.close) {
    const nextDayIndex = (dayIndex + 1) % 7;
    const nextDayStr = days[nextDayIndex];
    const nextDayHours = openingHours[nextDayStr];
    if (nextDayHours) return { status: 'closed', message: `Geschlossen. Öffnet morgen um ${nextDayHours.open} Uhr` };
    else return { status: 'closed', message: 'Jetzt geschlossen' };
  }
  const closeParts = todayHours.close.split(':').map(Number);
  const closeTimeInMinutes = closeParts[0] * 60 + closeParts[1];
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  if (closeTimeInMinutes - currentTimeInMinutes <= 30) return { status: 'closing-soon', message: `Schließt in Kürze (${todayHours.close} Uhr)` };
  return { status: 'open', message: `Geöffnet bis ${todayHours.close} Uhr` };
}