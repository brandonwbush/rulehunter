import { X } from 'lucide-react';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  freeChecks: number;
}

export function DirectionsModal({ isOpen, onClose, freeChecks }: DirectionsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="directions-title"
    >
      <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="directions-title" className="text-2xl font-bold font-serif text-foreground">Directions & Scoring</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close directions"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">How to Play:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Check up to 20 arrays to discover the rule</li>
              <li>Implement the rule as a TypeScript/JavaScript function</li>
              <li>Your code is tested against 1000+ test cases</li>
              <li>Win if no failures are found!</li>
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-2">Example Techniques:</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <div className="mb-1">Loop through elements:</div>
                <code className="block text-foreground font-mono bg-muted/50 px-3 py-2 rounded">for (let i = 0; i &lt; arr.length; i++)</code>
              </div>
              <div>
                <div className="mb-1">Use array methods:</div>
                <code className="block text-foreground font-mono bg-muted/50 px-3 py-2 rounded">arr.every(...), arr.filter(...), arr.reduce(...)</code>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-2">Scoring:</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-mono">
                <span className="text-foreground font-semibold">Starting Score:</span> 1.00
              </p>
              <p className="font-mono">
                <span className="text-foreground font-semibold">Free Checks:</span> {freeChecks} (based on difficulty)
              </p>
              <p className="font-mono">
                <span className="text-foreground font-semibold">Check Penalty:</span> -0.05 per check after free ones
              </p>
              <p className="font-mono">
                <span className="text-foreground font-semibold">Submission Penalty:</span> -0.20 per failed attempt (first is free)
              </p>
              <p className="font-mono">
                <span className="text-foreground font-semibold">Hint Cost:</span> -0.10 (max 1 per game)
              </p>
              <p className="text-xs mt-2">
                Your score decreases as you use more checks and make incorrect attempts.
                Harder difficulties give you more free checks and examples!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
