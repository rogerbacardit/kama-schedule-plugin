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
 * @param lang Preferred language ('es' | 'en' | 'ca')
 * @returns FormattedDate object containing weekday, time, and full date
 */
export function formatMatchDate(isoString: string, lang: 'es' | 'en' | 'pt' | 'fr' | 'it' | 'ar' | 'de' = 'es'): FormattedDate {
  try {
    if (!isoString) {
      return { weekday: "TBD", time: "TBD", date: "TBD" };
    }

    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return { weekday: "TBD", time: "TBD", date: "TBD" };
    }

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const localeMap = {
      es: 'es-ES',
      en: 'en-US',
      pt: 'pt-BR',
      fr: 'fr-FR',
      it: 'it-IT',
      ar: 'ar-SA',
      de: 'de-DE'
    };
    const locale = localeMap[lang] || 'es-ES';

    // 1. Weekday name
    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const weekday = capitalize(weekdayFormatter.format(d));

    // 2. Time string (e.g., "17:00")
    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const time = timeFormatter.format(d);

    // 3. Full date string
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long'
    });
    const rawDate = dateFormatter.format(d);
    
    let formattedDate = rawDate;
    if (lang === 'es' || lang === 'pt' || lang === 'fr' || lang === 'it' || lang === 'de') {
      const dateWords = rawDate.split(' ');
      formattedDate = dateWords
        .map((word) => {
          if (word.length >= 3 && word !== 'del' && !word.startsWith("d'")) {
            return capitalize(word);
          }
          return word;
        })
        .join(' ');
    } else if (lang === 'en') {
      formattedDate = rawDate.split(' ').map(capitalize).join(' ');
    }

    return { weekday, time, date: formattedDate };
  } catch (error) {
    console.error("Error formatting match date:", error);
    return { weekday: "TBD", time: "TBD", date: "TBD" };
  }
}
