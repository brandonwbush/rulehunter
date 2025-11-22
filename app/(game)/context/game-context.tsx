'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CheckResult, GamePhase, GameSession } from '@/app/api/game/session';
import { SubmitResponse } from '@/app/api/game/submit/types';
import { usePreferences } from './preferences-context';

function calculateLiveScore(checksUsed: number, freeChecks: number, submissions: number, hintUsed: boolean): number {
  const CHECK_PENALTY = 0.05;
  const SUBMISSION_PENALTY = 0.2;
  const HINT_PENALTY = 0.1;

  let score = 1.0;

  // Deduct for checks after the free ones
  const extraChecks = Math.max(0, checksUsed - freeChecks);
  score -= extraChecks * CHECK_PENALTY;

  // Deduct for submissions after the first one
  const extraSubmissions = Math.max(0, submissions - 1);
  score -= extraSubmissions * SUBMISSION_PENALTY;

  // Deduct for hint if used
  if (hintUsed) {
    score -= HINT_PENALTY;
  }

  // Ensure minimum score is 0
  return Math.max(0, score);
}

interface GameContextType {
  gamePhase: GamePhase;
  playerName: string;
  sessionId: string;
  difficulty: string;
  exampleArrays: number[][];
  checkHistory: CheckResult[];
  checksUsed: number;
  maxChecks: number;
  freeChecks: number;
  submissions: number;
  score: number;
  startTime: number;
  submitResult: SubmitResponse | null;
  error: string;
  submitError: string;
  revealedRule: string;
  hintUsed: boolean;
  hint: string;

  startNewGame: (name: string, difficulty?: 'easy' | 'medium' | 'hard', isDaily?: boolean) => Promise<void>;
  loadSession: (id: string) => Promise<void>;
  handleCheck: (array: number[]) => Promise<void>;
  handleSubmit: (code: string) => Promise<void>;
  handleRetry: () => void;
  handleRestart: () => void;
  handleHint: () => Promise<void>;
  handleQuit: () => Promise<void>;
  updatePlayerName: (name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const preferences = usePreferences();
  const [gamePhase, setGamePhase] = useState<GamePhase>('preferences');
  const [playerName, setPlayerName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [exampleArrays, setExampleArrays] = useState<number[][]>([]);
  const [checkHistory, setCheckHistory] = useState<CheckResult[]>([]);
  const [checksUsed, setChecksUsed] = useState(0);
  const [maxChecks, setMaxChecks] = useState(20);
  const [freeChecks, setFreeChecks] = useState(1);
  const [submissions, setSubmissions] = useState(0);
  const [score, setScore] = useState(1000);
  const [startTime, setStartTime] = useState(Date.now());
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [revealedRule, setRevealedRule] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [hint, setHint] = useState('');

  const loadSession = async (id: string) => {
    try {
      setGamePhase('loading');
      setError('');

      const response = await fetch(`/api/game/session/${id}`);
      if (!response.ok) {
        throw new Error('Session not found');
      }

      const session = await response.json();

      setSessionId(session.id);
      setPlayerName(preferences.playerName || session.username || 'Player');
      setDifficulty(session.difficulty || 'medium');
      setExampleArrays(session.exampleArrays || []);
      setMaxChecks(session.maxChecks);
      setFreeChecks(session.freeChecks || 1);
      setCheckHistory(session.checkHistory || []);
      setChecksUsed(session.checksUsed);
      setSubmissions(session.submissions);
      setScore(session.score);
      setStartTime(session.startTime);
      setHintUsed(session.hintUsed || false);

      // Map backend phase to frontend phase
      const phaseMap: Record<string, GamePhase> = {
        'discovery': 'playing',
        'submission': 'playing',
        'testing': 'testing',
        'won': 'won',
        'failed': 'failed'
      };
      setGamePhase(phaseMap[session.phase] || 'playing');

      // Save session ID to preferences
      preferences.setLastSessionId(session.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
      setGamePhase('preferences');
    }
  };

  const startNewGame = async (name: string, difficulty?: 'easy' | 'medium' | 'hard', isDaily?: boolean) => {
    try {
      setGamePhase('loading');
      setError('');
      setSubmitError('');

      const authToken = localStorage.getItem('authToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch('/api/game/new', {
        method: 'POST',
        headers,
        body: JSON.stringify({ username: name, difficulty, isDaily })
      });

      if (!response.ok) {
        throw new Error('Failed to start game');
      }

      const data = await response.json();

      setPlayerName(name);
      setSessionId(data.sessionId);
      setDifficulty(difficulty || 'medium');
      setExampleArrays(data.exampleArrays);
      setMaxChecks(data.maxChecks);
      setFreeChecks(data.freeChecks);
      setCheckHistory([]);
      setChecksUsed(0);
      setSubmissions(0);
      setScore(1.0);
      setStartTime(Date.now());
      setSubmitResult(null);
      setHintUsed(false);
      setHint('');
      setGamePhase('playing');

      // Save session ID to preferences
      preferences.setLastSessionId(data.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
      setGamePhase('preferences');
    }
  };

  const handleCheck = async (array: number[]) => {
    try {
      setError('');

      const response = await fetch('/api/game/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, array })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Check failed');
      }

      const data = await response.json();

      const newChecksUsed = checksUsed + 1;
      setCheckHistory([...checkHistory, {
        array,
        result: data.result,
        timestamp: Date.now()
      }]);
      setChecksUsed(newChecksUsed);

      // Recalculate score on frontend
      const newScore = calculateLiveScore(newChecksUsed, freeChecks, submissions, hintUsed);
      setScore(newScore);

      // Check if score hit zero
      if (newScore <= 0) {
        const ruleResponse = await fetch(`/api/game/reveal/${sessionId}`);
        if (ruleResponse.ok) {
          const ruleData = await ruleResponse.json();
          setRevealedRule(ruleData.description);
        }
        setGamePhase('lost');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check failed');
    }
  };

  const handleSubmit = async (code: string) => {
    try {
      setGamePhase('testing');
      setError('');
      setSubmitError('');
      setSubmitResult(null);

      const response = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, code })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }

      const data: SubmitResponse = await response.json();

      setSubmitResult(data);
      const newSubmissions = submissions + 1;
      setSubmissions(newSubmissions);

      // Recalculate score on frontend
      const newScore = calculateLiveScore(checksUsed, freeChecks, newSubmissions, hintUsed);
      setScore(newScore);

      if (data.success) {
        setGamePhase('won');
      } else {
        // Check if score hit zero after failed submission
        if (newScore <= 0) {
          const ruleResponse = await fetch(`/api/game/reveal/${sessionId}`);
          if (ruleResponse.ok) {
            const ruleData = await ruleResponse.json();
            setRevealedRule(ruleData.description);
          }
          setGamePhase('lost');
        } else {
          setGamePhase('failed');
          setSubmitError(data.message || 'Your rule failed the tests');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Submission failed';
      setSubmitError(errorMsg);
      setError(errorMsg);
      setGamePhase('playing');
    }
  };

  const handleRetry = () => {
    setGamePhase('playing');
    setSubmitResult(null);
    setSubmitError('');
  };

  const handleRestart = () => {
    setPlayerName('');
    setGamePhase('preferences');
  };

  const updatePlayerName = (name: string) => {
    setPlayerName(name);
  };

  const handleHint = async () => {
    try {
      setError('');

      const response = await fetch('/api/game/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get hint');
      }

      const data = await response.json();
      setHint(data.hint);
      setHintUsed(true);

      // Recalculate score on frontend
      const newScore = calculateLiveScore(checksUsed, freeChecks, submissions, true);
      setScore(newScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get hint');
    }
  };

  const handleQuit = async () => {
    try {
      setError('');

      const response = await fetch('/api/game/quit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to quit game');
      }

      // Reveal the rule
      const ruleResponse = await fetch(`/api/game/reveal/${sessionId}`);
      if (ruleResponse.ok) {
        const ruleData = await ruleResponse.json();
        setRevealedRule(ruleData.description);
      }

      // Update state to reflect quit
      setScore(0);
      setGamePhase('lost');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to quit game');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');
    if (sessionParam) {
      loadSession(sessionParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameContext.Provider value={{
      gamePhase,
      playerName,
      sessionId,
      difficulty,
      exampleArrays,
      checkHistory,
      checksUsed,
      maxChecks,
      freeChecks,
      submissions,
      score,
      startTime,
      submitResult,
      error,
      submitError,
      revealedRule,
      hintUsed,
      hint,
      startNewGame,
      loadSession,
      handleCheck,
      handleSubmit,
      handleRetry,
      handleRestart,
      handleHint,
      handleQuit,
      updatePlayerName
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
