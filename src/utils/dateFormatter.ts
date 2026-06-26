export interface FormattedDate {
  weekday: string;
  time: string;
  date: string;
}

/**
 * Formats an ISO date string into a user-friendly format using native Intl APIs.
 * Matches local timezone of the running client.
 *
 * @param isoString ISO date string from the KAMA API
 * @returns FormattedDate object containing weekday, time, and full date
 */
export function formatMatchDate(isoString: string): FormattedDate {
  try {
    if (!isoString) {
      return { weekday: "TBD", time: "TBD", date: "TBD" };
    }

    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return { weekday: "TBD", time: "TBD", date: "TBD" };
    }

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    // 1. Weekday name (e.g., "Sábado")
    const weekdayFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long' });
    const weekday = capitalize(weekdayFormatter.format(d));

    // 2. Time string (e.g., "17:00")
    const timeFormatter = new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const time = timeFormatter.format(d);

    // 3. Full date string (e.g., "26 de Junio")
    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long'
    });
    const rawDate = dateFormatter.format(d);
    
    // Capitalize month: "26 de junio" -> "26 de Junio"
    const dateWords = rawDate.split(' ');
    const formattedDate = dateWords
      .map((word, idx) => (idx === 2 ? capitalize(word) : word))
      .join(' ');

    return { weekday, time, date: formattedDate };
  } catch (error) {
    console.error("Error formatting match date:", error);
    return { weekday: "TBD", time: "TBD", date: "TBD" };
  }
}
