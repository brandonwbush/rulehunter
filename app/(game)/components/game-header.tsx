'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface GameHeaderProps {
  playerName: string;
  sessionId: string;
  difficulty: string;
  onDirections: () => void;
  onRestart: () => void;
  onLogout?: () => void;
  onLogin?: () => void;
  isGuest?: boolean;
}

export function GameHeader({ playerName, sessionId, difficulty, onDirections, onRestart, onLogout, onLogin, isGuest }: GameHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

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
          <ThemeToggle />
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 bg-card border border-border shadow-sm hover:shadow-md transition-all rounded"
              aria-label="Options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded shadow-lg z-10">
                <button
                  onClick={() => {
                    onDirections();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-foreground"
                >
                  Directions
                </button>
                <button
                  onClick={() => {
                    onRestart();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-foreground font-medium"
                >
                  New Game
                </button>
                {isGuest && onLogin && (
                  <button
                    onClick={() => {
                      onLogin();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-foreground border-t border-border"
                  >
                    Login
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-foreground border-t border-border"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
