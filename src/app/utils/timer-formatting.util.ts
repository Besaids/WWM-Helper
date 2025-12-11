const LOCALE = 'en-GB'; // or 'en-US'

function formatHourResetTimeLocal(
  utcHour: number,
  utcMinute = 0,
  options?: Intl.DateTimeFormatOptions,
): string {
  // Use "today" so DST handling matches the current offset
  const now = new Date();
  const utcDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, utcMinute),
  );

  // Default: 24h format, respect user locale
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  });

  return formatter.format(utcDate);
}

// utcWeekday: 0 = Sunday, 1 = Monday, ... 5 = Friday, 6 = Saturday
function formatWeeklyResetLocalLabel(utcWeekday: number, utcHour: number, utcMinute = 0): string {
  const now = new Date();
  const currentUtcWeekday = now.getUTCDay();
  let deltaDays = utcWeekday - currentUtcWeekday;
  if (deltaDays < 0) deltaDays += 7;

  const utcDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + deltaDays,
      utcHour,
      utcMinute,
    ),
  );

  const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
  });

  const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const weekday = weekdayFormatter.format(utcDate);
  const time = timeFormatter.format(utcDate);

  return `${weekday} ${time}`;
}

// Generic: any UTC time -> local time
export function utcToLocal(utcHour: number, utcMinute = 0): string {
  return formatHourResetTimeLocal(utcHour, utcMinute);
}

// Generic: any UTC time -> "HH:MM local time"
export function utcToLocalLabel(utcHour: number, utcMinute = 0): string {
  return formatHourResetTimeLocal(utcHour, utcMinute) + ' local time';
}

// Convenience for your 21:00 reset
export function reset21Local(): string {
  return utcToLocal(21, 0);
}

// Convenience for your "21:00 UTC" reset
export function reset21LocalLabel(): string {
  return reset21Local() + ' local time';
}

export function sundayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(0, utcHour, utcMinute);
}

export function mondayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(1, utcHour, utcMinute);
}

export function tuesdayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(2, utcHour, utcMinute);
}

export function wednesdayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(3, utcHour, utcMinute);
}

export function thursdayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(4, utcHour, utcMinute);
}

export function fridayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(5, utcHour, utcMinute);
}

export function saturdayUtcLocal(utcHour: number, utcMinute = 0): string {
  return formatWeeklyResetLocalLabel(6, utcHour, utcMinute);
}

export function sundayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return sundayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function mondayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return mondayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function tuesdayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return tuesdayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function wednesdayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return wednesdayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function thursdayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return thursdayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function fridayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return fridayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function saturdayUtcLocalLabel(utcHour: number, utcMinute = 0): string {
  return saturdayUtcLocal(utcHour, utcMinute) + ' local time';
}

export function sundayReset21Local(): string {
  return formatWeeklyResetLocalLabel(0, 21, 0);
}

export function mondayReset21Local(): string {
  return formatWeeklyResetLocalLabel(1, 21, 0);
}

export function tuesdayReset21Local(): string {
  return formatWeeklyResetLocalLabel(2, 21, 0);
}

export function wednesdayReset21Local(): string {
  return formatWeeklyResetLocalLabel(3, 21, 0);
}

export function thursdayReset21Local(): string {
  return formatWeeklyResetLocalLabel(4, 21, 0);
}

export function fridayReset21Local(): string {
  return formatWeeklyResetLocalLabel(5, 21, 0);
}

export function saturdayReset21Local(): string {
  return formatWeeklyResetLocalLabel(6, 21, 0);
}

export function sundayReset21LocalLabel(): string {
  return sundayReset21Local() + ' local time';
}

export function mondayReset21LocalLabel(): string {
  return mondayReset21Local() + ' local time';
}

export function tuesdayReset21LocalLabel(): string {
  return tuesdayReset21Local() + ' local time';
}

export function wednesdayReset21LocalLabel(): string {
  return wednesdayReset21Local() + ' local time';
}

export function thursdayReset21LocalLabel(): string {
  return thursdayReset21Local() + ' local time';
}

export function fridayReset21LocalLabel(): string {
  return fridayReset21Local() + ' local time';
}

export function saturdayReset21LocalLabel(): string {
  return saturdayReset21Local() + ' local time';
}
