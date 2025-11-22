import { Trophy } from 'lucide-react';

interface WinScreenProps {
  playerName: string;
  message: string;
  score: number;
  onPlayAgain: () => void;
  onNewPlayer: () => void;
}

export function WinScreen({ playerName, message, score, onPlayAgain, onNewPlayer }: WinScreenProps) {
  return (
    <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-6 shadow-md">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-foreground mb-2">
          Congratulations, {playerName}!
        </h2>
        <p className="text-foreground mb-4">{message}</p>
        <div className="text-3xl font-bold font-serif text-primary mb-4">
          Final Score: {score}
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity"
          >
            Play Again
          </button>
          <button
            onClick={onNewPlayer}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity"
          >
            New Player
          </button>
        </div>
      </div>
    </div>
  );
}
