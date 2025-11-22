import { X, XCircle } from 'lucide-react';
import { FailureCard } from './failure-card';

interface FailurePanelProps {
  isOpen: boolean;
  onClose: () => void;
  failedCase?: number[];
  expectedResult?: boolean;
  playerResult?: boolean;
  message: string;
}

export function FailurePanel({
  isOpen,
  onClose,
  failedCase,
  expectedResult,
  playerResult,
  message,
}: FailurePanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} aria-label="Close failure panel" />
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="failure-panel-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="failure-panel-title" className="text-2xl font-bold font-serif text-foreground">Submission Failed</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close failure panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {failedCase ? (
            <FailureCard
              failedCase={failedCase}
              expectedResult={expectedResult || false}
              playerResult={playerResult || false}
              message={message}
            />
          ) : (
            <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <XCircle className="w-12 h-12 text-destructive" />
                </div>
                <h3 className="text-lg font-bold font-serif text-foreground mb-2">
                  Code Error
                </h3>
                <p className="text-destructive mb-4">{message}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  Fix your code below and resubmit. Each failed submission costs -0.20 points.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
