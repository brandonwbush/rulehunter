'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('./code-editor').then(mod => ({ default: mod.CodeEditor })), {
  loading: () => (
    <div className="border border-input rounded bg-muted/30 p-4 font-mono text-sm min-h-[200px] flex items-center justify-center">
      <div className="text-muted-foreground">Loading editor...</div>
    </div>
  ),
  ssr: false,
});

interface SubmitPanelProps {
  onSubmit: (code: string) => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  hasFailed?: boolean;
  onViewFailure?: () => void;
}

const defaultCode = `function satisfies(arr: number[]): boolean {
  // Your code here
  // Return true if arr satisfies the rule

  // Example: Check if all elements are positive
  // return arr.every(n => n > 0);

  return true;
}`;

export function SubmitPanel({ onSubmit, disabled, isSubmitting, hasFailed, onViewFailure }: SubmitPanelProps) {
  const [code, setCode] = useState(defaultCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-serif text-foreground">Implement the Rule</h2>
        {hasFailed && onViewFailure && (
          <button
            onClick={onViewFailure}
            className="px-3 py-1 text-sm bg-destructive/10 border border-destructive text-destructive rounded hover:bg-destructive/20 font-medium transition-colors"
          >
            Failures
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <CodeEditor
            value={code}
            onChange={setCode}
            disabled={disabled}
            onSubmit={() => !disabled && !isSubmitting && code.trim() && handleSubmit(new Event('submit') as any)}
          />
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Define any function that takes an array and returns a boolean. TypeScript syntax is supported!
            <span className="ml-2 text-primary">Press Ctrl+Enter to submit</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={disabled || isSubmitting || !code.trim()}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 font-medium shadow-sm transition-opacity relative overflow-hidden"
        >
          {isSubmitting && (
            <div className="absolute inset-0 bg-primary-foreground/10">
              <div className="h-full bg-primary-foreground/20 animate-[progress_2s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
            </div>
          )}
          <span className="relative z-10">
            {isSubmitting ? 'Testing...' : 'Submit'}
          </span>
        </button>
      </form>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
