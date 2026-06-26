import React, { useEffect, useState } from 'react';
import { useKamaData } from '../hooks/useKamaData';
import { MatchCard } from './MatchCard';

export const MatchSchedule: React.FC = () => {
  const {
    credentials,
    isAuthenticated,
    isAuthLoading,
    saveCredentials,
    clearCredentials,
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

  // Load competitions once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCompetitions();
    }
  }, [isAuthenticated, loadCompetitions]);

  // Auto-select first competition and load seasons
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompId) {
      const firstComp = competitions[0].id;
      setSelectedCompId(firstComp);
      loadSeasons(firstComp);
    }
  }, [competitions, selectedCompId, loadSeasons]);

  // Auto-select season (prioritize isCurrent) and load turns
  useEffect(() => {
    if (seasons.length > 0) {
      const currentSeason = seasons.find(s => s.isCurrent) || seasons[0];
      setSelectedSeasonId(currentSeason.id);
      loadSeasonDetails(currentSeason.id);
    }
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
    loadSeasons(val);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedSeasonId(val);
    setSelectedTurnId('');
    loadSeasonDetails(val);
  };

  // Find matches of the selected turn
  const activeTurn = turns.find(t => t.id === selectedTurnId);
  const activeMatches = activeTurn ? activeTurn.matches : [];

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
              CONECTAR CON KAMA API
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

  // MAIN SCHEDULE PANEL
  return (
    <div className="flex flex-col gap-6 px-4 py-6 text-white min-h-[500px]">
      {/* Header and Logout Row */}
      <div className="flex justify-between items-center bg-[#16161a]/40 border border-white/5 rounded-2xl p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none">KAMA SCHEDULE</h1>
            <span className="text-[10px] text-white/30 tracking-wider">CONECTADO: {credentials?.username}</span>
          </div>
        </div>
        <button
          onClick={clearCredentials}
          className="p-2 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 text-white/40 rounded-xl transition-all duration-200 cursor-pointer"
          title="Desconectar"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Competición</label>
          <select
            value={selectedCompId}
            onChange={handleCompChange}
            className="bg-[#16161a]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold cursor-pointer"
          >
            <option value="" disabled>Seleccionar</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id} className="bg-[#121214] text-white">{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Temporada</label>
          <select
            value={selectedSeasonId}
            onChange={handleSeasonChange}
            disabled={!selectedCompId}
            className="bg-[#16161a]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 appearance-none font-semibold disabled:opacity-40 cursor-pointer"
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

      {/* Turn (Jornada) Selector */}
      {turns.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Jornada</label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {turns.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTurnId(t.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl tracking-tight shrink-0 transition-all duration-200 border cursor-pointer ${
                  selectedTurnId === t.id
                    ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70 hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading & Errors State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-white/60">
          <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-amber-500 mb-3"></div>
          <span className="text-xs font-medium tracking-wider">CARGANDO PARTIDOS...</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold text-center my-6">
          ⚠️ {error}
        </div>
      )}

      {/* Matches List */}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {activeMatches.length > 0 ? (
            activeMatches.map(m => {
              const resolved = resolveMatch(m);
              return (
                <MatchCard 
                  key={m.id} 
                  match={resolved} 
                  turnName={activeTurn?.name || 'Jornada'}
                />
              );
            })
          ) : (
            <div className="text-center py-12 text-white/30 text-xs font-semibold bg-[#16161a]/30 border border-white/5 border-dashed rounded-3xl">
              No hay partidos programados en esta jornada
            </div>
          )}
        </div>
      )}
    </div>
  );
};
