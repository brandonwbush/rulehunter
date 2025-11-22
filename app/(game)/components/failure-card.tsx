'use client';

import { AlertTriangle, Check, X } from 'lucide-react';

interface FailureCardProps {
  failedCase: number[];
  expectedResult: boolean;
  playerResult: boolean;
  message: string;
}

export function FailureCard({
  failedCase,
  expectedResult,
  playerResult,
  message
}: FailureCardProps) {
  return (
    <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6 shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-destructive font-serif mb-1">
            Failed Test Case
          </h3>
          <p className="text-sm text-foreground">{message}</p>
        </div>
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>

      <div className="bg-card rounded p-4 mb-4 border border-border">
        <div className="mb-3">
          <div className="text-sm text-muted-foreground font-mono mb-1">Test Array:</div>
          <code className="text-lg font-mono text-foreground font-bold">
            [{failedCase.join(', ')}]
          </code>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground font-mono mb-1">Mystery Rule:</div>
            <div className="font-bold font-mono flex items-center gap-2">
              {expectedResult ? 'true' : 'false'}
              {expectedResult ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground font-mono mb-1">Your Rule:</div>
            <div className="font-bold font-mono flex items-center gap-2">
              {playerResult ? 'true' : 'false'}
              {playerResult ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-mono">
        Fix your code and resubmit to try again. Each failed submission costs -0.20 points.
      </p>
    </div>
  );
}
