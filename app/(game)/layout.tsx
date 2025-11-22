import { GameProvider } from './context/game-context';
import { PreferencesProvider } from './context/preferences-context';
import { GameErrorBoundary } from './components/error-boundary';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameErrorBoundary>
      <PreferencesProvider>
        <GameProvider>{children}</GameProvider>
      </PreferencesProvider>
    </GameErrorBoundary>
  );
}
