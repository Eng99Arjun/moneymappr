// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return (
        <Fallback 
          error={this.state.error!} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
      <div className="text-center">
        <div className="text-4xl mb-4">🚫</div>
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Something went wrong with the dashboard
        </h2>
        <p className="text-red-600 dark:text-red-300 text-sm mb-4">
          {error.message}
        </p>
        <Button onClick={reset} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    </Card>
  );
}