import React from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useLoading } from '../hooks/use-loading';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function SpinnerDemo() {
  const { isLoading, withLoading } = useLoading();

  const simulateAsyncOperation = async () => {
    // Simulate an async operation
    await new Promise(resolve => setTimeout(resolve, 3000));
    return 'Operation completed!';
  };

  const handleAsyncOperation = async () => {
    try {
      const result = await withLoading(simulateAsyncOperation);
      console.log(result);
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" />
        
        {/* Animated grid background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Spinner Component Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Beautiful loading spinners from Uiverse.io integrated into Basker
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Different Sizes */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40">
              <CardHeader>
                <CardTitle>Different Sizes</CardTitle>
                <CardDescription>Three different spinner sizes available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner size="sm" text="Small" />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner size="md" text="Medium" />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner size="lg" text="Large" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Different Colors */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40">
              <CardHeader>
                <CardTitle>Different Colors</CardTitle>
                <CardDescription>Customize spinner colors to match your theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner color="#3b82f6" text="Blue" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner color="#10b981" text="Green" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner color="#f59e0b" text="Orange" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner color="#ef4444" text="Red" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Example */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40">
              <CardHeader>
                <CardTitle>Interactive Example</CardTitle>
                <CardDescription>Try the loading spinner with async operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={handleAsyncOperation}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" text="Loading..." />
                    ) : (
                      'Start Async Operation'
                    )}
                  </Button>
                  {isLoading && (
                    <p className="text-sm text-muted-foreground text-center">
                      This will take 3 seconds to complete...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usage Example */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40">
              <CardHeader>
                <CardTitle>Usage Example</CardTitle>
                <CardDescription>How to use the spinner in your components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                    <pre className="text-sm text-gray-800 dark:text-gray-200">
{`import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Basic usage
<LoadingSpinner size="md" text="Loading..." />

// With custom color
<LoadingSpinner 
  size="lg" 
  color="#3b82f6" 
  text="Processing..." 
/>

// Overlay mode
<LoadingSpinner 
  overlay={true}
  text="Please wait..." 
/>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hook Example */}
          <Card className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40">
            <CardHeader>
              <CardTitle>useLoading Hook</CardTitle>
              <CardDescription>Manage loading states easily with the custom hook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 dark:text-gray-200">
{`import { useLoading } from '@/hooks/use-loading';

const { isLoading, withLoading } = useLoading();

const handleAsyncOperation = async () => {
  await withLoading(async () => {
    // Your async operation here
    await fetch('/api/data');
  });
};`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
