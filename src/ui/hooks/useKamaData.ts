/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';

export interface Competition {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  isCurrent: boolean;
}

export interface MatchScores {
  homeScore: number | null;
  awayScore: number | null;
  homeScoreP: number | null;
  awayScoreP: number | null;
}

export interface MatchParticipants {
  homeTeamId: number;
  awayTeamId: number;
}

export interface Match {
  id: number;
  date: string;
  scores: MatchScores;
  participants: MatchParticipants;
}

export interface Turn {
  id: number;
  name: string;
  matches: Match[];
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: {
    url: string;
  } | null;
  firstColorHEX: string;
}

export interface TeamDetails {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
  colorHex: string;
}

export interface ResolvedMatch {
  id: number;
  date: string;
  scores: MatchScores;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam: TeamDetails;
  awayTeam: TeamDetails;
}

export interface Credentials {
  username: string;
  password: string;
}

export function useKamaData() {
  const [credentials, setCredentialsState] = useState<Credentials | null>(null);
  const [language, setLanguageState] = useState<'es' | 'en' | 'pt' | 'fr' | 'it' | 'ar'>('es');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [teamMap, setTeamMap] = useState<Record<number, TeamDetails>>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Send request to retrieve credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.parent.postMessage({ pluginMessage: { type: 'get-credentials' } }, '*');
    }
  }, []);

  // Listen for credential messages from the sandbox
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'figma-sandbox') {
        const payload = event.data.payload;
        if (payload && payload.type === 'credentials') {
          const { username, password, language } = payload;
          if (username && password) {
            setCredentialsState({ username, password });
            setIsAuthenticated(true);
          } else {
            setCredentialsState(null);
            setIsAuthenticated(false);
          }
          if (language) {
            setLanguageState(language as 'es' | 'en' | 'pt' | 'fr' | 'it' | 'ar');
          }
          setIsAuthLoading(false);
        } else if (payload && payload.type === 'credentials-saved') {
          setIsAuthenticated(true);
        } else if (payload && payload.type === 'credentials-cleared') {
          setCredentialsState(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const saveCredentials = useCallback((username: string, password: string) => {
    setCredentialsState({ username, password });
    window.parent.postMessage({
      pluginMessage: { type: 'set-credentials', username, password }
    }, '*');
  }, []);

  const changeLanguage = useCallback((lang: 'es' | 'en' | 'pt' | 'fr' | 'it' | 'ar') => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.parent.postMessage({
        pluginMessage: { type: 'set-language', language: lang }
      }, '*');
    }
  }, []);

  const clearCredentials = useCallback(() => {
    setCredentialsState(null);
    setIsAuthenticated(false);
    window.parent.postMessage({
      pluginMessage: { type: 'clear-credentials' }
    }, '*');
  }, []);

  // API Call Wrapper
  const fetchFromKama = useCallback(async (endpoint: string, creds: Credentials) => {
    const auth = btoa(`${creds.username}:${creds.password}`);
    const response = await fetch(`https://api.kingsleague.kama.sport/api/v1/${endpoint}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error API KAMA: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }, []);

  // Load competitions list
  const loadCompetitions = useCallback(async () => {
    if (!credentials) return;
    setLoading(true);
    setError(null);
    try {
      const responseData = await fetchFromKama('competitions', credentials);
      setCompetitions(responseData.data || []);
    } catch (e: any) {
      setError(e.message || 'Error cargando competiciones');
    } finally {
      setLoading(false);
    }
  }, [credentials, fetchFromKama]);

  // Load seasons list
  const loadSeasons = useCallback(async (competitionId: number) => {
    if (!credentials) return;
    setLoading(true);
    setError(null);
    try {
      const responseData = await fetchFromKama(`competitions/${competitionId}/seasons`, credentials);
      const competitionDetails = responseData.data || {};
      setSeasons(competitionDetails.seasons || []);
    } catch (e: any) {
      setError(e.message || 'Error cargando temporadas');
    } finally {
      setLoading(false);
    }
  }, [credentials, fetchFromKama]);

  // Load season detail (turns/matches) and team mapping details
  const loadSeasonDetails = useCallback(async (seasonId: number) => {
    if (!credentials) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch matches schedule structure
      const responseData = await fetchFromKama(`seasons/${seasonId}`, credentials);
      const seasonData = responseData.data || {};
      
      // Extract all turns (jornadas)
      const extractedTurns: Turn[] = [];
      if (seasonData.phases) {
        for (const phase of seasonData.phases) {
          if (phase.groups) {
            for (const group of phase.groups) {
              if (group.turns) {
                extractedTurns.push(...group.turns);
              }
            }
          }
        }
      }
      setTurns(extractedTurns);

      // 2. Fetch team logos/colors mapping
      const responseTeamsData = await fetchFromKama(`seasons/${seasonId}/teams`, credentials);
      const teamsData = responseTeamsData.data || {};
      const mapping: Record<number, TeamDetails> = {};
      if (teamsData.teams) {
        teamsData.teams.forEach((t: Team) => {
          mapping[t.id] = {
            id: t.id,
            name: t.name,
            shortName: t.shortName,
            logoUrl: t.logo?.url || '',
            colorHex: t.firstColorHEX || '#7F8C8D'
          };
        });
      }
      setTeamMap(mapping);
    } catch (e: any) {
      setError(e.message || 'Error cargando jornadas de la temporada');
    } finally {
      setLoading(false);
    }
  }, [credentials, fetchFromKama]);

  // Helper to resolve match teams with metadata details
  const resolveMatch = useCallback((match: Match): ResolvedMatch => {
    const defaultTeam = (id: number): TeamDetails => ({
      id,
      name: `Equipo ${id}`,
      shortName: `EQ${id}`,
      logoUrl: '',
      colorHex: '#7F8C8D'
    });

    return {
      id: match.id,
      date: match.date,
      scores: match.scores,
      homeTeamId: match.participants.homeTeamId,
      awayTeamId: match.participants.awayTeamId,
      homeTeam: teamMap[match.participants.homeTeamId] || defaultTeam(match.participants.homeTeamId),
      awayTeam: teamMap[match.participants.awayTeamId] || defaultTeam(match.participants.awayTeamId)
    };
  }, [teamMap]);

  return {
    credentials,
    isAuthenticated,
    isAuthLoading,
    saveCredentials,
    clearCredentials,
    language,
    changeLanguage,
    competitions,
    seasons,
    turns,
    teamMap,
    loading,
    error,
    loadCompetitions,
    loadSeasons,
    loadSeasonDetails,
    resolveMatch
  };
}
