import Image from 'next/image';

interface GameHeaderProps {
  playerName: string;
  sessionId: string;
  difficulty: string;
  onDirections: () => void;
  onRestart: () => void;
}

export function GameHeader({ playerName, sessionId, difficulty, onDirections, onRestart }: GameHeaderProps) {
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
        <div className="flex gap-2">
          <button
            onClick={onDirections}
            className="px-4 py-2 bg-muted text-foreground rounded hover:opacity-90 font-medium text-sm shadow-sm transition-opacity"
          >
            Directions
          </button>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 font-medium text-sm shadow-sm transition-opacity"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
