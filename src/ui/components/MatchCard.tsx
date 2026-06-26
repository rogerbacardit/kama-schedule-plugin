import React from 'react';
import { ResolvedMatch } from '../hooks/useKamaData';
import { formatMatchDate } from '../../utils/dateFormatter';

interface MatchCardProps {
  match: ResolvedMatch;
  turnName: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, turnName }) => {
  const { weekday, time, date } = formatMatchDate(match.date);
  
  const hasScore = match.scores.homeScore !== null && match.scores.awayScore !== null;
  const isPlayed = hasScore;
  const handleImport = () => {
    if (typeof window !== 'undefined') {
      window.parent.postMessage({
        pluginMessage: {
          type: 'import-match-card',
          match,
          turnName,
          weekday,
          time,
          date,
          updateTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
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
          className="w-12 h-12 rounded-full object-contain bg-black/20 p-1 border border-white/10"
        />
      );
    }

    // Letter fallback
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white border border-white/20 text-lg"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#16161a]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(251,184,0,0.1)] transition-all duration-300 flex flex-col gap-4">
      {/* Background soft glow elements using team colors */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r opacity-60"
        style={{ backgroundImage: `linear-gradient(to right, ${match.homeTeam.colorHex}, transparent)` }}
      />
      <div 
        className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l opacity-60"
        style={{ backgroundImage: `linear-gradient(to left, ${match.awayTeam.colorHex}, transparent)` }}
      />

      {/* Date & Time Header */}
      <div className="flex justify-between items-center text-xs font-medium tracking-wide">
        <span className="text-amber-500 font-bold uppercase">{weekday}</span>
        <span className="text-white/40">{date}</span>
        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 flex items-center gap-1 font-semibold">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {time}
        </div>
      </div>

      {/* Teams and Scores Row */}
      <div className="flex items-center justify-between gap-2 py-2">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          {renderLogo(match.homeTeam.logoUrl, match.homeTeam.name, match.homeTeam.colorHex)}
          <span className="text-sm font-bold text-white truncate max-w-[100px] leading-tight">
            {match.homeTeam.shortName || match.homeTeam.name}
          </span>
        </div>

        {/* Score / VS Spacer */}
        <div className="flex flex-col items-center justify-center px-4">
          {isPlayed ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                {match.scores.homeScore}
              </span>
              <span className="text-white/20 text-xs font-bold px-1.5 py-0.5 bg-white/5 rounded border border-white/5">
                VS
              </span>
              <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                {match.scores.awayScore}
              </span>
            </div>
          ) : (
            <div className="text-white/20 text-sm font-black px-3 py-1 bg-white/5 rounded-full border border-white/5 tracking-wider">
              VS
            </div>
          )}
          
          {/* Shootout Pen Info */}
          {isPlayed && (match.scores.homeScoreP !== null || match.scores.awayScoreP !== null) && (
            <span className="text-[10px] text-amber-500/80 font-bold mt-1 tracking-wider uppercase">
              Pen. ({match.scores.homeScoreP || 0} - {match.scores.awayScoreP || 0})
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          {renderLogo(match.awayTeam.logoUrl, match.awayTeam.name, match.awayTeam.colorHex)}
          <span className="text-sm font-bold text-white truncate max-w-[100px] leading-tight">
            {match.awayTeam.shortName || match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <button
        onClick={handleImport}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>IMPORTAR A CANVAS</span>
      </button>
    </div>
  );
};
