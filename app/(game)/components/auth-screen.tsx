'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

interface AuthScreenProps {
  onSkip: () => void;
  onLogin: (token: string, username: string) => void;
}

export function AuthScreen({ onSkip, onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.username);

      onLogin(data.token, data.username);
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-lg p-8 border border-border shadow-lg">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center gap-3 flex-1">
              <Image src="/icon.svg" alt="Rule Hunter" width={40} height={40} />
              <h1 className="text-3xl font-bold font-serif text-foreground">
                Rule Hunter
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-center mb-6 font-mono text-sm">
            Login to track your progress
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 px-4 py-2 rounded font-medium transition-all ${
                mode === 'login'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 px-4 py-2 rounded font-medium transition-all ${
                mode === 'register'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-4 py-3 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              required
              autoFocus
            />

            <label className="block mb-2 text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-3 rounded border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <button
            onClick={onSkip}
            className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded hover:opacity-90 font-medium shadow-sm transition-opacity"
          >
            Play as Guest
          </button>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            {mode === 'register'
              ? 'Username: 3-50 chars. Password: 8+ chars.'
              : 'No email required. No password recovery.'}
          </p>
        </div>
      </div>
    </div>
  );
}
