'use client';

import { useState, useEffect } from 'react';
import { useGame } from './context/game-context';
import { usePreferences } from './context/preferences-context';
import {
  GameStats,
  DiscoveryPanel,
  SubmitPanel,
  DirectionsModal,
  FailurePanel,
  PreferencesScreen,
  GameHeader,
  ExampleArrays,
  WinScreen,
  LossScreen,
} from './components';
import { AuthScreen } from './components/auth-screen';
import { SkeletonLoader } from './components/skeleton-loader';
import { ThemeToggle } from '@/components/theme-toggle';

export default function GamePage() {
  const game = useGame();
  const preferences = usePreferences();
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showFailurePanel, setShowFailurePanel] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setShowAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setAuthToken(null);
    setShowAuth(true);
    game.handleRestart();
  };

  const handleShowLogin = () => {
    setShowAuth(true);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDirectionsModal) {
          setShowDirectionsModal(false);
        } else if (showFailurePanel) {
          setShowFailurePanel(false);
        }
      }
    };

    if (showDirectionsModal || showFailurePanel) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDirectionsModal, showFailurePanel]);

  useEffect(() => {
    if (game.gamePhase === 'failed' && game.submitResult) {
      setShowFailurePanel(true);
    } else if (game.gamePhase === 'playing') {
      setShowFailurePanel(false);
    }
  }, [game.gamePhase, game.submitResult]);

  // Auth Screen
  if (showAuth && (game.gamePhase === 'preferences' || game.gamePhase === 'playing')) {
    return (
      <AuthScreen
        onSkip={() => setShowAuth(false)}
        onLogin={(token, username) => {
          setAuthToken(token);
          preferences.setPlayerName(username); // Persist to localStorage
          game.updatePlayerName(username); // Update current session display
          setShowAuth(false);
        }}
      />
    );
  }

  // Preferences Screen
  if (game.gamePhase === 'preferences') {
    return (
      <PreferencesScreen
        error={game.error}
        onStartGame={game.startNewGame}
      />
    );
  }

  // Loading Screen
  if (game.gamePhase === 'loading') {
    return <SkeletonLoader />;
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <GameHeader
          playerName={game.playerName}
          sessionId={game.sessionId}
          difficulty={game.difficulty}
          onDirections={() => setShowDirectionsModal(true)}
          onRestart={game.handleRestart}
          onLogout={authToken ? handleLogout : undefined}
          onLogin={!authToken ? handleShowLogin : undefined}
          isGuest={!authToken}
        />

        {/* Error Display */}
        {game.error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
            {game.error}
          </div>
        )}

        {/* Stats */}
        <GameStats
          score={game.score}
          checksUsed={game.checksUsed}
          maxChecks={game.maxChecks}
          freeChecks={game.freeChecks}
          submissions={game.submissions}
          startTime={game.startTime}
          gamePhase={game.gamePhase}
        />

        {/* Example Arrays */}
        <ExampleArrays arrays={game.exampleArrays} />

        {/* Win State */}
        {game.gamePhase === 'won' && game.submitResult && (
          <WinScreen
            playerName={game.playerName}
            message={game.submitResult.message || ''}
            score={game.score}
            onPlayAgain={() => game.startNewGame(game.playerName)}
            onNewPlayer={game.handleRestart}
          />
        )}

        {/* Lost State - Score Hit Zero */}
        {game.gamePhase === 'lost' && (
          <LossScreen
            playerName={game.playerName}
            ruleDescription={game.revealedRule}
            onTryAgain={() => game.startNewGame(game.playerName)}
          />
        )}


        {/* Game Panels */}
        {(game.gamePhase === 'playing' || game.gamePhase === 'testing' || game.gamePhase === 'failed') && (
          <div className="grid md:grid-cols-2 gap-6">
            <DiscoveryPanel
              checkHistory={game.checkHistory}
              onCheck={game.handleCheck}
              checksRemaining={game.maxChecks - game.checksUsed}
              disabled={game.gamePhase === 'testing'}
              hintUsed={game.hintUsed}
              hint={game.hint}
              onHint={game.handleHint}
            />

            <SubmitPanel
              onSubmit={game.handleSubmit}
              disabled={game.gamePhase === 'testing'}
              isSubmitting={game.gamePhase === 'testing'}
              hasFailed={game.gamePhase === 'failed'}
              onViewFailure={() => setShowFailurePanel(true)}
            />
          </div>
        )}

        <FailurePanel
          isOpen={showFailurePanel && game.gamePhase === 'failed' && !!game.submitResult}
          onClose={() => setShowFailurePanel(false)}
          failedCase={game.submitResult?.failedCase}
          expectedResult={game.submitResult?.expectedResult}
          playerResult={game.submitResult?.playerResult}
          message={game.submitError || game.submitResult?.message || ''}
        />

        <DirectionsModal
          isOpen={showDirectionsModal}
          onClose={() => setShowDirectionsModal(false)}
          freeChecks={game.freeChecks}
        />
      </div>
    </div>
  );
}
