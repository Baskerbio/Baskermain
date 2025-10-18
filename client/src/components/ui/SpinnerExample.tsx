import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useLoading } from '../../hooks/use-loading';
import { Button } from './button';

export const SpinnerExample: React.FC = () => {
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
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Spinner Examples</h2>
      
      {/* Different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="sm" text="Small" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="md" text="Medium" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" text="Large" />
          </div>
        </div>
      </div>

      {/* Different colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Colors</h3>
        <div className="flex items-center gap-8">
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
      </div>

      {/* Interactive example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Example</h3>
        <Button 
          onClick={handleAsyncOperation}
          disabled={isLoading}
          className="w-48"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" text="Loading..." />
          ) : (
            'Start Async Operation'
          )}
        </Button>
      </div>

      {/* Overlay example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Overlay Example</h3>
        <Button 
          onClick={() => {
            // Show overlay for 3 seconds
            const overlay = document.createElement('div');
            overlay.innerHTML = `
              <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div class="flex flex-col items-center justify-center gap-3">
                  <div class="spinner w-9 h-9" style="color: currentColor;">
                    ${Array.from({ length: 10 }, (_, i) => '<div></div>').join('')}
                  </div>
                  <p class="text-sm text-muted-foreground animate-pulse">Processing...</p>
                </div>
              </div>
            `;
            document.body.appendChild(overlay);
            setTimeout(() => {
              document.body.removeChild(overlay);
            }, 3000);
          }}
        >
          Show Overlay Spinner
        </Button>
      </div>
    </div>
  );
};

export default SpinnerExample;
