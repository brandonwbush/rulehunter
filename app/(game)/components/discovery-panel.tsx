'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { CheckResult } from '@/app/api/game/session';

interface DiscoveryPanelProps {
  checkHistory: CheckResult[];
  onCheck: (array: number[]) => void;
  checksRemaining: number;
  disabled?: boolean;
  hintUsed?: boolean;
  hint?: string;
  onHint?: () => void;
}

export function DiscoveryPanel({ checkHistory, onCheck, checksRemaining, disabled, hintUsed, hint, onHint }: DiscoveryPanelProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Parse input - support both JSON array and comma-separated
      let array: number[];

      if (input.trim().startsWith('[')) {
        // JSON format
        array = JSON.parse(input);
      } else {
        // Comma-separated format
        array = input
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .map(s => {
            const num = Number(s);
            if (isNaN(num)) throw new Error(`Invalid number: ${s}`);
            return num;
          });
      }

      if (!Array.isArray(array)) {
        throw new Error('Input must be an array');
      }

      onCheck(array);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-md">
      <h2 className="text-xl font-bold mb-4 font-serif text-foreground">Discover the Rule</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="check-input" className="sr-only">Enter array to test</label>
          <input
            id="check-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="[1, 2, 3] or 1, 2, 3"
            disabled={disabled || checksRemaining <= 0}
            className="w-full px-4 py-2 rounded border border-input bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            aria-invalid={!!error}
            aria-describedby={error ? "check-error" : undefined}
          />
          {error && (
            <p id="check-error" className="text-sm text-destructive mt-1" role="alert">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={disabled || checksRemaining <= 0 || !input.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 font-medium shadow-sm transition-opacity"
              aria-label={`Check array. ${checksRemaining} checks remaining`}
            >
              Check
            </button>
            {onHint && (
              <button
                type="button"
                onClick={onHint}
                disabled={disabled || hintUsed}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 disabled:opacity-50 font-medium shadow-sm transition-opacity"
              >
                Hint
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground font-mono" aria-live="polite">
            {checksRemaining} checks / {hintUsed ? '0 hints' : '1 hint'} left
          </span>
        </div>
      </form>

      {hint && (
        <div className="mb-4 p-3 bg-muted/50 rounded border border-border">
          <div className="text-xs text-muted-foreground font-mono mb-1">Hint</div>
          <div className="text-sm text-foreground">{hint}</div>
        </div>
      )}

      {checkHistory.length > 0 && (() => {
        const reversed = checkHistory.slice().reverse();
        const midpoint = Math.ceil(reversed.length / 2);
        const leftColumn = reversed.slice(0, midpoint);
        const rightColumn = reversed.slice(midpoint);

        const renderCheck = (check: typeof checkHistory[0], idx: number) => {
          const checkNumber = checkHistory.length - idx;
          return (
            <div
              key={checkNumber}
              className="flex items-center gap-1.5 py-0.5 px-2 rounded bg-muted/50 text-xs"
            >
              <span className="text-muted-foreground font-mono flex-shrink-0 w-7 text-right">#{checkNumber}</span>
              <code className="font-mono text-foreground truncate flex-1 min-w-0">
                [{check.array.join(', ')}]
              </code>
              {check.result ? (
                <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 ml-auto" />
              ) : (
                <X className="w-3.5 h-3.5 text-red-600 flex-shrink-0 ml-auto" />
              )}
            </div>
          );
        };

        return (
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground font-mono">
              Check History
            </h3>
            {checkHistory.length <= 10 ? (
              <div className="space-y-0.5 max-h-64 overflow-y-auto">
                {reversed.map((check, idx) => renderCheck(check, idx))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-1 max-h-64 overflow-y-auto">
                <div className="space-y-0.5">
                  {leftColumn.map((check, idx) => renderCheck(check, idx))}
                </div>
                <div className="space-y-0.5">
                  {rightColumn.map((check, idx) => renderCheck(check, midpoint + idx))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
