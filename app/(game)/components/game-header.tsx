'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Play, XCircle, LogOut, LogIn, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface GameHeaderProps {
  playerName: string;
  sessionId: string;
  difficulty: string;
  onDirections: () => void;
  onRestart: () => void;
  onQuit?: () => void;
  onLogout?: () => void;
  onLogin?: () => void;
  isGuest?: boolean;
}

export function GameHeader({ playerName, sessionId, difficulty, onDirections, onRestart, onQuit, onLogout, onLogin, isGuest }: GameHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Image src="/icon.svg" alt="Rule Hunter" width={48} height={48} />
            <h1 className="text-4xl font-bold font-serif text-foreground">
              Rule Hunter
            </h1>
          </div>
          <p className="text-muted-foreground font-mono">
            Welcome, {playerName}!
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground font-mono mt-1">
            <span>Session: {sessionId}</span>
            <span className="capitalize">Difficulty: {difficulty}</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2 items-center overflow-hidden">
            <div className={`flex gap-2 items-center transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
              <button
                onClick={onDirections}
                className="p-2 bg-secondary dark:bg-primary/5 border border-primary dark:border-primary/20 shadow-sm hover:shadow-md transition-all rounded"
                aria-label="Directions"
                title="Directions"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button
                onClick={onRestart}
                className="p-2 bg-secondary dark:bg-primary/5 border border-primary dark:border-primary/20 shadow-sm hover:shadow-md transition-all rounded"
                aria-label="New Game"
                title="New Game"
              >
                <Play className="w-5 h-5" />
              </button>
              {onQuit && (
                <button
                  onClick={onQuit}
                  className="p-2 bg-secondary dark:bg-primary/5 border border-primary dark:border-primary/20 shadow-sm hover:shadow-md transition-all rounded"
                  aria-label="Quit Game"
                  title="Quit Game"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
              <ThemeToggle className="p-2 bg-accent dark:bg-accent/30 border border-accent dark:border-accent/40 shadow-sm hover:shadow-md transition-all rounded text-accent-foreground" />
              {isGuest && onLogin && (
                <button
                  onClick={onLogin}
                  className="p-2 bg-accent dark:bg-accent/30 border border-accent dark:border-accent/40 shadow-sm hover:shadow-md transition-all rounded text-accent-foreground"
                  aria-label="Login"
                  title="Login"
                >
                  <LogIn className="w-5 h-5" />
                </button>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 bg-accent dark:bg-accent/30 border border-accent dark:border-accent/40 shadow-sm hover:shadow-md transition-all rounded text-accent-foreground"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-card border border-border shadow-sm hover:shadow-md transition-all rounded"
            aria-label="Menu"
            title="Menu"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
