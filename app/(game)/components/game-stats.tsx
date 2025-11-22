'use client';

import { useState, useEffect, useMemo } from 'react';

interface GameStatsProps {
  score: number;
  checksUsed: number;
  maxChecks: number;
  freeChecks: number;
  submissions: number;
  startTime: number;
  gamePhase?: string;
}

export function GameStats({ score, checksUsed, maxChecks, freeChecks, submissions, startTime, gamePhase }: GameStatsProps) {
  const [elapsed, setElapsed] = useState(Date.now() - startTime);

  // Memoize time formatting
  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [elapsed]);

  useEffect(() => {
    // Stop timer if game has ended
    if (gamePhase === 'won' || gamePhase === 'lost') {
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gamePhase]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground font-mono">Score</div>
        <div className="text-2xl font-bold text-foreground font-serif">{score.toFixed(2)}</div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground font-mono">Checks</div>
        <div className="text-2xl font-bold text-foreground font-serif">
          {checksUsed} / {maxChecks}
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground font-mono">Attempts</div>
        <div className="text-2xl font-bold text-foreground font-serif">{submissions}</div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground font-mono">Time</div>
        <div className="text-2xl font-bold text-foreground font-serif">
          {timeDisplay}
        </div>
      </div>
    </div>
  );
}
