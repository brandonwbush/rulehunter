import { Skull } from 'lucide-react';

interface LossScreenProps {
  playerName: string;
  ruleDescription: string;
  onTryAgain: () => void;
}

export function LossScreen({ ruleDescription, onTryAgain }: LossScreenProps) {
  return (
    <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6 mb-6">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <Skull className="w-12 h-12 text-destructive" />
        </div>
        <h3 className="text-lg font-bold font-serif text-foreground mb-2">
          Game Over
        </h3>
        <p className="text-muted-foreground mb-4">
          You lost.
        </p>
        <details className="mb-4">
          <summary className="cursor-pointer text-primary hover:underline font-medium">
            Click to reveal the answer
          </summary>
          <div className="mt-4 p-4 bg-muted rounded text-left">
            <p className="text-sm text-muted-foreground mb-2">The mystery rule was:</p>
            <p className="font-mono text-foreground">{ruleDescription || 'Unable to load rule description'}</p>
          </div>
        </details>
        <button
          onClick={onTryAgain}
          className="px-6 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
