'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePreferences } from '../context/preferences-context';

interface PreferencesScreenProps {
  error: string;
  onStartGame: (name: string, difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function PreferencesScreen({ error, onStartGame }: PreferencesScreenProps) {
  const preferences = usePreferences();
  const [nameInput, setNameInput] = useState(preferences.playerName);
  const [difficulty, setDifficulty] = useState(preferences.difficulty);
  const [sessionInput, setSessionInput] = useState(preferences.lastSessionId);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim() || 'Anonymous';
    // Save preferences
    preferences.setPlayerName(name);
    preferences.setDifficulty(difficulty);
    onStartGame(name, difficulty);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-lg p-8 border border-border shadow-lg">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center gap-3 flex-1">
              <Image src="/icon.svg" alt="Rule Hunter" width={40} height={40} />
              <h1 className="text-3xl font-bold font-serif text-foreground">
                Rule Hunter
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-center mb-6 font-mono text-sm">
            Discover the mystery rule
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleStartGame} className="mb-4">
            <label className="block mb-2 text-sm font-medium text-foreground">
              Your Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              autoFocus
            />

            <label className="block mb-2 text-sm font-medium text-foreground">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-3 rounded font-medium transition-all ${
                  difficulty === 'easy'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Easy
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-3 rounded font-medium transition-all ${
                  difficulty === 'medium'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-3 rounded font-medium transition-all ${
                  difficulty === 'hard'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Hard
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity"
            >
              Start New Game
            </button>
          </form>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const id = sessionInput.trim();
            if (id) {
              window.location.href = `/?session=${id}`;
            }
          }}>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Resume Session
            </label>
            <input
              type="text"
              value={sessionInput}
              onChange={(e) => setSessionInput(e.target.value)}
              placeholder="Enter session ID..."
              className="w-full px-4 py-3 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity"
            >
              Load Session
            </button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded text-sm text-muted-foreground">
            <p className="font-semibold mb-2">How to Play:</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Query up to 20 arrays to discover the pattern</li>
              <li>Write a TypeScript/JavaScript function</li>
              <li>Your code is tested against 1000+ test cases</li>
              <li>Win if no failures are found!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
