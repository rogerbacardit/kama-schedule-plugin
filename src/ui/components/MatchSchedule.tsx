/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useKamaData } from '../hooks/useKamaData';
import { MatchCard } from './MatchCard';
import { formatMatchDate } from '../../utils/dateFormatter';

type Language = 'es' | 'en' | 'pt' | 'fr' | 'it' | 'ar' | 'de';

const translations = {
  es: {
    competition: "Competición",
    season: "Temporada",
    language: "Idioma",
    round: "Jornada",
    connected: "CONECTADO",
    loading: "CARGANDO PARTIDOS...",
    noMatches: "No hay partidos programados en esta jornada",
    importLabel: "Importar a Canvas",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "Desconectar",
    updated: "Actualizado",
    penalties: "Pen.",
    importedNotify: "¡Partido importado!",
    importedScheduleNotify: "¡Jornada importada al lienzo!",
    vs: "VS",
    preferences: "Preferencias",
    style: "Estilo de Diseño",
    standard: "Estándar",
    kwcc: "Kings World Cup Clubs",
    formats: "Formatos Canvas"
  },
  en: {
    competition: "Competition",
    season: "Season",
    language: "Language",
    round: "Matchday",
    connected: "CONNECTED",
    loading: "LOADING MATCHES...",
    noMatches: "No matches scheduled for this matchday",
    importLabel: "Import to Canvas",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "Disconnect",
    updated: "Updated",
    penalties: "Pen.",
    importedNotify: "Match imported!",
    importedScheduleNotify: "Schedule imported to canvas!",
    vs: "VS",
    preferences: "Preferences",
    style: "Design Style",
    standard: "Standard",
    kwcc: "Kings World Cup Clubs",
    formats: "Canvas Formats"
  },
  pt: {
    competition: "Competição",
    season: "Temporada",
    language: "Idioma",
    round: "Rodada",
    connected: "CONECTADO",
    loading: "CARREGANDO PARTIDAS...",
    noMatches: "Não há partidas agendadas para esta rodada",
    importLabel: "Importar para Canvas",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "Desconectar",
    updated: "Atualizado",
    penalties: "Pên.",
    importedNotify: "Partida importada!",
    importedScheduleNotify: "Rodada importada para o canvas!",
    vs: "VS",
    preferences: "Preferências",
    style: "Estilo de Design",
    standard: "Standard",
    kwcc: "Kings World Cup Clubs",
    formats: "Formatos de Tela"
  },
  fr: {
    competition: "Compétition",
    season: "Saison",
    language: "Langue",
    round: "Journée",
    connected: "CONNECTÉ",
    loading: "CHARGEMENT DES MATCHS...",
    noMatches: "Aucun match prévu pour cette journée",
    importLabel: "Importer vers Canvas",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "Se déconnecter",
    updated: "Mis à jour",
    penalties: "T.a.b.",
    importedNotify: "Match importé !",
    importedScheduleNotify: "Journée importée sur le canvas !",
    vs: "VS",
    preferences: "Préférences",
    style: "Style de Design",
    standard: "Standard",
    kwcc: "Kings World Cup Clubs",
    formats: "Formats Canvas"
  },
  it: {
    competition: "Competizione",
    season: "Stagione",
    language: "Lingua",
    round: "Giornata",
    connected: "CONNESSO",
    loading: "CARICAMENTO PARTITE...",
    noMatches: "Non ci sono partite in programma per questa giornata",
    importLabel: "Importa nel Canvas",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "Disconnetti",
    updated: "Aggiornato",
    penalties: "Rig.",
    importedNotify: "Partita importata!",
    importedScheduleNotify: "Giornata importata nel canvas!",
    vs: "VS",
    preferences: "Preferenze",
    style: "Stile di Design",
    standard: "Standard",
    kwcc: "Kings World Cup Clubs",
    formats: "Formati Canvas"
  },
  ar: {
    competition: "المنافسة",
    season: "الموسم",
    language: "اللغة",
    round: "الجولة",
    connected: "متصل",
    loading: "جاري تحميل المباريات...",
    noMatches: "لا توجد مباريات مجدولة في هذه الجولة",
    importLabel: "استيراد إلى Figma",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "تسجيل الخروج",
    updated: "تم التحديث",
    penalties: "ر.ت",
    importedNotify: "تم استيراد المباراة!",
    importedScheduleNotify: "تم استيراد الجدول بالكامل!",
    vs: "ضد",
    preferences: "التفضيلات",
    style: "نمط التصميم",
    standard: "قياسي",
    kwcc: "Kings World Cup Clubs",
    formats: "تنسيقات Canvas"
  },
  de: {
    competition: "Wettbewerb",
    season: "Saison",
    language: "Sprache",
    round: "Spieltag",
    connected: "VERBUNDEN",
    loading: "SPIELE WERDEN GELADEN...",
    noMatches: "Keine Spiele für diesen Spieltag geplant",
    importLabel: "In Canvas importieren",
    importSchedule: "IMPORT SCHEDULE",
    importDayResult: "IMPORT DAY RESULT",
    disconnect: "Abmelden",
    updated: "Aktualisiert",
    penalties: "Elf.",
    importedNotify: "Spiel importiert!",
    importedScheduleNotify: "Spieltag in Canvas importiert!",
    vs: "VS",
    preferences: "Einstellungen",
    style: "Designstil",
    standard: "Standard",
    kwcc: "Kings World Cup Clubs",
    formats: "Canvas-Formate"
  }
};

export function translateTurnName(name: string, lang: Language): string {
  if (!name) return '';
  const nameLower = name.toLowerCase();
  
  const numMatch = name.match(/\d+/);
  const num = numMatch ? numMatch[0] : '';
  
  const tRound = {
    es: 'Jornada',
    en: 'Matchday',
    pt: 'Rodada',
    fr: 'Journée',
    it: 'Giornata',
    ar: 'الجولة',
    de: 'Spieltag'
  };
  
  const base = tRound[lang] || 'Jornada';
  
  if (nameLower.startsWith('jornada') && num) {
    return `${base} ${num}`;
  }
  
  if (nameLower.includes('cuartos de final') || nameLower.includes('cuartos')) {
    if (lang === 'en') return 'Quarterfinals';
    if (lang === 'pt') return 'Quartas de final';
    if (lang === 'fr') return 'Quarts de finale';
    if (lang === 'it') return 'Quarti di finale';
    if (lang === 'ar') return 'ربع النهائي';
    if (lang === 'de') return 'Viertelfinale';
  }

  if (nameLower.includes('semifinal')) {
    if (lang === 'en') return 'Semifinals';
    if (lang === 'pt') return 'Semifinais';
    if (lang === 'fr') return 'Demi-finales';
    if (lang === 'it') return 'Semifinali';
    if (lang === 'ar') return 'نصف النهائي';
    if (lang === 'de') return 'Halbfinale';
  }

  if (nameLower.includes('final')) {
    if (lang === 'en') return 'Final';
    if (lang === 'pt') return 'Final';
    if (lang === 'fr') return 'Finale';
    if (lang === 'it') return 'Finale';
    if (lang === 'ar') return 'النهائي';
    if (lang === 'de') return 'Finale';
  }
  
  return name;
}

const formatRoundDateRange = (matches: any[], resolveMatch: any, lang: string): string => {
  if (!matches || matches.length === 0) return '';

  const dates = matches
    .map(m => new Date(resolveMatch(m).date))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return '';

  const d = dates[0];
  const localeMap: Record<string, string> = {
    es: 'es-ES',
    en: 'en-US',
    pt: 'pt-BR',
    fr: 'fr-FR',
    it: 'it-IT',
    ar: 'ar-SA',
    de: 'de-DE'
  };
  const locale = localeMap[lang] || 'es-ES';
  const weekday = d.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase();
  const dateStr = d.toLocaleDateString(locale, { day: 'numeric', month: 'long' }).toUpperCase();

  return `${weekday}, ${dateStr}`;
};

export const MatchSchedule: React.FC = () => {
  const {
    credentials,
    isAuthenticated,
    isAuthLoading,
    saveCredentials,
    clearCredentials,
    language,
    changeLanguage,
    importStyle,
    selectedFormats,
    savePreferences,
    competitions,
    seasons,
    turns,
    loading,
    error,
    loadCompetitions,
    loadSeasons,
    loadSeasonDetails,
    resolveMatch
  } = useKamaData();

  // Selected filters state
  const [selectedCompId, setSelectedCompId] = useState<number | ''>('');
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | ''>('');
  const [selectedTurnId, setSelectedTurnId] = useState<number | ''>('');

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Active view: 'schedule' or 'preferences'
  const [activeView, setActiveView] = useState<'schedule' | 'preferences'>('schedule');

  // Load competitions once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCompetitions(language as Language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loadCompetitions]);

  // Re-fetch season details when language changes
  useEffect(() => {
    if (selectedSeasonId) {
      loadSeasonDetails(selectedSeasonId as number, language as Language);
    }
  }, [language, selectedSeasonId, loadSeasonDetails]);

  // Auto-select first competition and load seasons
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompId) {
      const firstComp = competitions[0].id;
      setSelectedCompId(firstComp);
      loadSeasons(firstComp, language as Language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitions, selectedCompId, loadSeasons]);

  // Auto-select season (prioritize isCurrent) and load turns
  useEffect(() => {
    if (seasons.length > 0) {
      const currentSeason = seasons.find(s => s.isCurrent) || seasons[0];
      setSelectedSeasonId(currentSeason.id);
      loadSeasonDetails(currentSeason.id, language as Language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasons, loadSeasonDetails]);

  // Auto-select first turn (Jornada)
  useEffect(() => {
    if (turns.length > 0) {
      setSelectedTurnId(turns[0].id);
    }
  }, [turns]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() && passwordInput.trim()) {
      saveCredentials(usernameInput.trim(), passwordInput.trim());
    }
  };

  const handleCompChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedCompId(val);
    setSelectedSeasonId('');
    setSelectedTurnId('');
    loadSeasons(val, language as Language);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedSeasonId(val);
    setSelectedTurnId('');
    loadSeasonDetails(val, language as Language);
  };

  // Find matches of the selected turn
  const activeTurn = turns.find(t => t.id === selectedTurnId);
  const activeMatches = activeTurn ? activeTurn.matches : [];

  const t = translations[language as Language] || translations.es;

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mb-4"></div>
        <p className="text-xs text-white/50 tracking-wider">VALIDANDO CREDENCIALES...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center min-h-[500px] px-6 py-8">
        <div className="bg-[#16161a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="bg-amber-500 text-black font-extrabold text-xs px-3 py-1 rounded-md mb-3 tracking-widest uppercase">
              KINGS LEAGUE
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight text-center">
              CONCONNECTAR CON KAMA API
            </h2>
            <p className="text-xs text-white/40 text-center mt-1">
              Ingresa tus credenciales para sincronizar calendarios y assets
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">
                Usuario
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold text-center mt-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 text-black font-extrabold text-sm py-3 px-4 rounded-xl mt-4 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              {loading ? 'CONECTANDO...' : 'GUARDAR Y CONECTAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Find the selected competition name to pass to the imported card
  const activeComp = competitions.find(c => c.id === selectedCompId);
  const competitionName = activeComp ? activeComp.name : 'KINGS LEAGUE';

  const handleImportDayResult = () => {
    if (typeof window === 'undefined' || activeMatches.length === 0) return;

    const localeMap = {
      es: 'es-ES',
      en: 'en-US',
      pt: 'pt-BR',
      fr: 'fr-FR',
      it: 'it-IT',
      ar: 'ar-SA',
      de: 'de-DE'
    };
    const locale = localeMap[language] || 'es-ES';
    const updateTime = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const ti = translations[language] || translations.es;

    const payloadMatches = activeMatches.map(m => {
      const resolved = resolveMatch(m);
      const dateInfo = formatMatchDate(resolved.date, language);
      const homeScoreP = resolved.scores.homeScoreP;
      const awayScoreP = resolved.scores.awayScoreP;
      const penaltiesText = (homeScoreP !== null || awayScoreP !== null)
        ? `${ti.penalties} (${homeScoreP || 0} - ${awayScoreP || 0})`
        : undefined;

      return {
        match: resolved,
        weekday: dateInfo.weekday,
        time: dateInfo.time,
        date: dateInfo.date,
        penaltiesText
      };
    });

    const dateRangeStr = formatRoundDateRange(activeMatches, resolveMatch, language);

    if (importStyle === 'kwcc') {
      window.parent.postMessage({
        pluginMessage: {
          type: 'import-kwcc-poster',
          matches: payloadMatches,
          competitionName,
          turnName: translateTurnName(activeTurn?.name || 'Jornada', language),
          updatedLabel: dateRangeStr || `${ti.updated}: ${updateTime}`,
          isResult: true,
          formats: selectedFormats,
          language: language,
          notificationText: ti.importedScheduleNotify
        }
      }, '*');
    } else {
      window.parent.postMessage({
        pluginMessage: {
          type: 'import-schedule',
          matches: payloadMatches,
          competitionName,
          turnName: translateTurnName(activeTurn?.name || 'Jornada', language),
          updatedLabel: `${ti.updated}: ${updateTime}`,
          isResult: true,
          notificationText: ti.importedScheduleNotify
        }
      }, '*');
    }
  };

  const handleImportSchedule = () => {
    if (typeof window === 'undefined' || activeMatches.length === 0) return;

    const localeMap = {
      es: 'es-ES',
      en: 'en-US',
      pt: 'pt-BR',
      fr: 'fr-FR',
      it: 'it-IT',
      ar: 'ar-SA',
      de: 'de-DE'
    };
    const locale = localeMap[language] || 'es-ES';
    const updateTime = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const ti = translations[language] || translations.es;

    const payloadMatches = activeMatches.map(m => {
      const resolved = resolveMatch(m);
      const dateInfo = formatMatchDate(resolved.date, language);

      return {
        match: resolved,
        weekday: dateInfo.weekday,
        time: dateInfo.time,
        date: dateInfo.date,
        penaltiesText: undefined
      };
    });

    const dateRangeStr = formatRoundDateRange(activeMatches, resolveMatch, language);

    if (importStyle === 'kwcc') {
      window.parent.postMessage({
        pluginMessage: {
          type: 'import-kwcc-poster',
          matches: payloadMatches,
          competitionName,
          turnName: translateTurnName(activeTurn?.name || 'Jornada', language),
          updatedLabel: dateRangeStr || `${ti.updated}: ${updateTime}`,
          isResult: false,
          formats: selectedFormats,
          language: language,
          notificationText: ti.importedScheduleNotify
        }
      }, '*');
    } else {
      window.parent.postMessage({
        pluginMessage: {
          type: 'import-schedule',
          matches: payloadMatches,
          competitionName,
          turnName: translateTurnName(activeTurn?.name || 'Jornada', language),
          updatedLabel: `${ti.updated}: ${updateTime}`,
          isResult: false,
          notificationText: ti.importedScheduleNotify
        }
      }, '*');
    }
  };

  // MAIN SCHEDULE PANEL
  if (activeView === 'preferences') {
    return (
      <div className="flex flex-col gap-5 px-5 py-5 text-white min-h-[500px]">
        {/* Header with Back Arrow */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <button 
            onClick={() => setActiveView('schedule')}
            className="p-1 hover:bg-white/5 rounded-lg border border-white/5 hover:border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-amber-500">{t.preferences}</h1>
            <p className="text-[10px] text-white/30 tracking-wide mt-0.5">Configura el diseño y localización</p>
          </div>
        </div>

        {/* 1. Style preference */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-0.5">{t.style}</label>
          <select
            value={importStyle}
            onChange={e => savePreferences(e.target.value as 'standard' | 'kwcc', selectedFormats)}
            className="w-full bg-[#16161a]/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold cursor-pointer"
          >
            <option value="standard" className="bg-[#121214] text-white">{t.standard}</option>
            <option value="kwcc" className="bg-[#121214] text-white">{t.kwcc}</option>
          </select>
        </div>

        {/* 3. Formats (only if Kings World Club Cup style is selected) */}
        {importStyle === 'kwcc' && (
          <div className="flex flex-col gap-2.5 p-3.5 bg-[#16161a]/40 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-0.5">{t.formats}</span>
            <div className="flex flex-col gap-3 mt-1">
              <label className="flex items-center gap-3 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedFormats.stories}
                  onChange={e => savePreferences(importStyle, { ...selectedFormats, stories: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded border-white/10"
                />
                <span>Stories (1080 x 1920 px)</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedFormats.portraits}
                  onChange={e => savePreferences(importStyle, { ...selectedFormats, portraits: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded border-white/10"
                />
                <span>Portraits (1350 x 1920 px)</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedFormats.thumbs}
                  onChange={e => savePreferences(importStyle, { ...selectedFormats, thumbs: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded border-white/10"
                />
                <span>Thumbs (1920 x 1080 px)</span>
              </label>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Logout Section */}
        <div className="bg-[#16161a]/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-wider">{t.connected}</span>
            <span className="text-xs font-bold text-white/70">{credentials?.username}</span>
          </div>
          <button 
            onClick={clearCredentials}
            className="w-full mt-2 py-2 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
          >
            {t.disconnect.toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 text-white min-h-[500px]">
      {/* Header Row */}
      <div className="flex justify-between items-center bg-[#16161a]/40 border border-white/5 rounded-2xl p-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h1 className="text-xs font-black tracking-tight leading-none">SCHEDULE KAMA</h1>
            <span className="text-[9px] text-white/30 tracking-wider">{t.connected}: {credentials?.username}</span>
          </div>
        </div>
        
        {/* Preferences Toggle Button */}
        <button
          onClick={() => setActiveView('preferences')}
          className="p-1.5 rounded-lg border bg-white/5 text-white/60 border-white/5 hover:border-white/10 hover:text-white transition-all duration-200 cursor-pointer"
          title={t.preferences}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Selectors Grid (2 columns: Competition, Season) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-0.5">{t.competition}</label>
          <select
            value={selectedCompId}
            onChange={handleCompChange}
            className="bg-[#16161a]/80 border border-white/10 rounded-xl px-2 py-2 text-[11px] text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold cursor-pointer truncate"
          >
            <option value="" disabled>Seleccionar</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id} className="bg-[#121214] text-white">{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-0.5">{t.season}</label>
          <select
            value={selectedSeasonId}
            onChange={handleSeasonChange}
            disabled={!selectedCompId}
            className="bg-[#16161a]/80 border border-white/10 rounded-xl px-2 py-2 text-[11px] text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold disabled:opacity-40 cursor-pointer truncate"
          >
            <option value="" disabled>Seleccionar</option>
            {seasons.map(s => (
              <option key={s.id} value={s.id} className="bg-[#121214] text-white">
                {s.name} {s.isCurrent ? '• Actual' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Turn (Jornada) Selector & Import Buttons */}
      {turns.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Jornada selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-0.5">{t.round}</label>
              <div className="relative w-full">
                <select
                  value={selectedTurnId}
                  onChange={e => setSelectedTurnId(Number(e.target.value))}
                  className="w-full bg-[#16161a]/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold cursor-pointer"
                >
                  {turns.map(turn => {
                    const displayTurnName = translateTurnName(turn.name, language as Language);
                    return (
                      <option key={turn.id} value={turn.id} className="bg-[#121214] text-white">
                        {displayTurnName}
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Import language selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-0.5">{t.language}</label>
              <select
                value={language}
                onChange={e => changeLanguage(e.target.value as Language)}
                className="w-full bg-[#16161a]/80 border border-white/10 rounded-xl px-2 py-2 text-[11px] text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold cursor-pointer"
              >
                <option value="es" className="bg-[#121214] text-white">Español</option>
                <option value="en" className="bg-[#121214] text-white">English</option>
                <option value="pt" className="bg-[#121214] text-white">Português</option>
                <option value="fr" className="bg-[#121214] text-white">Français</option>
                <option value="it" className="bg-[#121214] text-white">Italiano</option>
                <option value="de" className="bg-[#121214] text-white">Deutsch</option>
                <option value="ar" className="bg-[#121214] text-white">العربية</option>
              </select>
            </div>
          </div>
          
          {/* Action buttons row */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={handleImportDayResult}
              disabled={loading || activeMatches.length === 0}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:from-amber-700 disabled:to-amber-700 text-black font-extrabold text-[11px] rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1 h-[36px] uppercase tracking-wide"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t.importDayResult}</span>
            </button>

            <button
              onClick={handleImportSchedule}
              disabled={loading || activeMatches.length === 0}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white disabled:opacity-40 disabled:bg-[#16161a] disabled:text-white/35 font-extrabold text-[11px] rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 h-[36px] uppercase tracking-wide"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{t.importSchedule}</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading & Errors State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-white/60">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-500 mb-2"></div>
          <span className="text-[10px] font-bold tracking-wider">{t.loading}</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold text-center my-4">
          ⚠️ {error}
        </div>
      )}

      {/* Matches List */}
      {!loading && !error && (
        <div className="flex flex-col gap-2">
          {activeMatches.length > 0 ? (
            activeMatches.map(m => {
              const resolved = resolveMatch(m);
              return (
                <MatchCard
                  key={m.id}
                  match={resolved}
                  turnName={translateTurnName(activeTurn?.name || 'Jornada', language)}
                  language={language}
                  competitionName={competitionName}
                  importStyle={importStyle}
                  selectedFormats={selectedFormats}
                />
              );
            })
          ) : (
            <div className="text-center py-10 text-white/30 text-xs font-semibold bg-[#16161a]/30 border border-white/5 border-dashed rounded-2xl">
              {t.noMatches}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
