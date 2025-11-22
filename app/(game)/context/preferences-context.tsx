'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PreferencesContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  lastSessionId: string;
  setLastSessionId: (id: string) => void;
  clearPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAYER_NAME: 'rulehunter_player_name',
  DIFFICULTY: 'rulehunter_difficulty',
  LAST_SESSION: 'rulehunter_last_session',
} as const;

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerNameState] = useState('');
  const [difficulty, setDifficultyState] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [lastSessionId, setLastSessionIdState] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
    if (savedName) {
      setPlayerNameState(savedName);
    }

    const savedDifficulty = localStorage.getItem(STORAGE_KEYS.DIFFICULTY);
    if (savedDifficulty === 'easy' || savedDifficulty === 'medium' || savedDifficulty === 'hard') {
      setDifficultyState(savedDifficulty);
    }

    const savedSession = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
    if (savedSession) {
      setLastSessionIdState(savedSession);
    }

    setIsInitialized(true);
  }, []);

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
    if (name && name !== 'Anonymous') {
      localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
    }
  };

  const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setDifficultyState(difficulty);
    localStorage.setItem(STORAGE_KEYS.DIFFICULTY, difficulty);
  };

  const setLastSessionId = (id: string) => {
    setLastSessionIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEYS.LAST_SESSION, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LAST_SESSION);
    }
  };

  const clearPreferences = () => {
    setPlayerNameState('');
    setDifficultyState('medium');
    setLastSessionIdState('');
    localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME);
    localStorage.removeItem(STORAGE_KEYS.DIFFICULTY);
    localStorage.removeItem(STORAGE_KEYS.LAST_SESSION);
  };

  // Don't render children until localStorage is loaded to avoid hydration mismatches
  if (!isInitialized) {
    return null;
  }

  return (
    <PreferencesContext.Provider
      value={{
        playerName,
        setPlayerName,
        difficulty,
        setDifficulty,
        lastSessionId,
        setLastSessionId,
        clearPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
