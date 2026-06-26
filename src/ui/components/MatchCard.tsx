import React from 'react';
import { ResolvedMatch } from '../hooks/useKamaData';
import { formatMatchDate } from '../../utils/dateFormatter';

interface MatchCardProps {
  match: ResolvedMatch;
  turnName: string;
  language: 'es' | 'en' | 'pt' | 'fr' | 'it' | 'ar';
  competitionName: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  turnName, 
  language,
  competitionName
}) => {
  const { weekday, time, date } = formatMatchDate(match.date, language);
  
  const hasScore = match.scores.homeScore !== null && match.scores.awayScore !== null;
  const isPlayed = hasScore;

  const localizedTexts = {
    es: {
      updatedLabel: `Actualizado: `,
      importedNotify: `¡Partido ${match.homeTeam.shortName || match.homeTeam.name} vs ${match.awayTeam.shortName || match.awayTeam.name} importado al lienzo!`,
      penalties: "Pen."
    },
    en: {
      updatedLabel: `Updated: `,
      importedNotify: `Match ${match.homeTeam.shortName || match.homeTeam.name} vs ${match.awayTeam.shortName || match.awayTeam.name} imported to canvas!`,
      penalties: "Pen."
    },
    pt: {
      updatedLabel: `Atualizado: `,
      importedNotify: `Partida ${match.homeTeam.shortName || match.homeTeam.name} vs ${match.awayTeam.shortName || match.awayTeam.name} importada para o canvas!`,
      penalties: "Pên."
    },
    fr: {
      updatedLabel: `Mis à jour: `,
      importedNotify: `Match ${match.homeTeam.shortName || match.homeTeam.name} vs ${match.awayTeam.shortName || match.awayTeam.name} importé !`,
      penalties: "T.a.b."
    },
    it: {
      updatedLabel: `Aggiornato: `,
      importedNotify: `Partita ${match.homeTeam.shortName || match.homeTeam.name} vs ${match.awayTeam.shortName || match.awayTeam.name} importata nel canvas!`,
      penalties: "Rig."
    },
    ar: {
      updatedLabel: `تم التحديث: `,
      importedNotify: `تم استيراد مباراة ${match.homeTeam.shortName || match.homeTeam.name} ضد ${match.awayTeam.shortName || match.awayTeam.name}!`,
      penalties: "ر.ت"
    }
  };

  const tLocal = localizedTexts[language] || localizedTexts.es;

  const handleImport = () => {
    if (typeof window !== 'undefined') {
      const localeMap = {
        es: 'es-ES',
        en: 'en-US',
        pt: 'pt-BR',
        fr: 'fr-FR',
        it: 'it-IT',
        ar: 'ar-SA'
      };
      const locale = localeMap[language] || 'es-ES';
      const updateTime = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
      
      const homeScoreP = match.scores.homeScoreP;
      const awayScoreP = match.scores.awayScoreP;
      const penaltiesText = (homeScoreP !== null || awayScoreP !== null) 
        ? `${tLocal.penalties} (${homeScoreP || 0} - ${awayScoreP || 0})`
        : undefined;

      window.parent.postMessage({
        pluginMessage: {
          type: 'import-match-card',
          match,
          competitionName,
          turnName,
          weekday,
          time,
          date,
          updatedLabel: `${tLocal.updatedLabel}${updateTime}`,
          penaltiesText,
          notificationText: tLocal.importedNotify
        }
      }, '*');
    }
  };

  // Safe logo rendering with fallbacks
  const renderLogo = (logoUrl: string, name: string, color: string) => {
    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt={name} 
          className="w-7 h-7 rounded-full object-contain bg-black/20 p-0.5 border border-white/10 shrink-0"
        />
      );
    }

    // Letter fallback
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div 
        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white border border-white/20 text-[10px] shrink-0"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#16161a]/60 backdrop-blur-lg border border-white/5 rounded-xl p-3 hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(251,184,0,0.05)] transition-all duration-300 flex items-center justify-between gap-3">
      {/* Soft gradient background glow representing team identity */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-[2px] opacity-50"
        style={{ backgroundImage: `linear-gradient(to right, ${match.homeTeam.colorHex}, transparent)` }}
      />
      <div 
        className="absolute top-0 right-0 w-1/2 h-[2px] opacity-50"
        style={{ backgroundImage: `linear-gradient(to left, ${match.awayTeam.colorHex}, transparent)` }}
      />

      {/* Date & Time Column */}
      <div className="flex flex-col text-[10px] text-white/40 min-w-[70px] leading-tight select-none">
        <span className="text-amber-500 font-bold uppercase tracking-tight">{weekday.slice(0, 3)}</span>
        <span>{date.split(' de ')[0]} {date.split(' de ')[1]?.slice(0, 3) || date.split(' ')[0]?.slice(0, 3)}</span>
        <span className="font-semibold text-white/60 mt-0.5">{time}</span>
      </div>

      {/* Matchup Column */}
      <div className="flex items-center justify-center flex-1 min-w-0 gap-2">
        {/* Home Team */}
        <div className="flex items-center justify-end gap-1.5 flex-1 min-w-0">
          <span className="text-xs font-bold text-white truncate text-right leading-none">
            {match.homeTeam.shortName || match.homeTeam.name}
          </span>
          {renderLogo(match.homeTeam.logoUrl, match.homeTeam.name, match.homeTeam.colorHex)}
        </div>

        {/* Score or VS Spacer */}
        <div className="flex flex-col items-center justify-center min-w-[55px] shrink-0">
          {isPlayed ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-white tabular-nums">
                  {match.scores.homeScore}
                </span>
                <span className="text-white/20 text-[9px] font-bold px-1 py-0.2 bg-white/5 rounded border border-white/5">
                  -
                </span>
                <span className="text-sm font-black text-white tabular-nums">
                  {match.scores.awayScore}
                </span>
              </div>
              {/* penalties shootout */}
              {(match.scores.homeScoreP !== null || match.scores.awayScoreP !== null) && (
                <span className="text-[8px] text-amber-500/80 font-bold tracking-tight mt-0.5 uppercase">
                  P ({match.scores.homeScoreP || 0}-{match.scores.awayScoreP || 0})
                </span>
              )}
            </div>
          ) : (
            <div className="text-white/25 text-[10px] font-black px-2 py-0.5 bg-white/5 rounded-full border border-white/5 tracking-wider select-none">
              VS
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-start gap-1.5 flex-1 min-w-0">
          {renderLogo(match.awayTeam.logoUrl, match.awayTeam.name, match.awayTeam.colorHex)}
          <span className="text-xs font-bold text-white truncate text-left leading-none">
            {match.awayTeam.shortName || match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Import Button Column */}
      <button
        onClick={handleImport}
        className="p-2 bg-white/5 hover:bg-amber-500 hover:text-black border border-white/5 hover:border-amber-500 text-white/60 hover:text-white rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
        title="Importar a Canvas"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </button>
    </div>
  );
};
