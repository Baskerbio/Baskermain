import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both identifier and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password);
      toast({
        title: 'Welcome to Basker!',
        description: 'Successfully logged in with Bluesky',
      });
      // Redirect to profile after successful login
      setLocation('/profile');
    } catch (error: any) {
      console.error('Login error details:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      
      let errorMessage = 'Please check your credentials and try again';
      
      if (error.message?.includes('Invalid identifier or password')) {
        errorMessage = 'Invalid username or password';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network connection issue. Please check your internet connection.';
      } else if (error.message?.includes('CORS')) {
        errorMessage = 'Connection blocked. Please try refreshing the page.';
      } else if (error.message) {
        errorMessage = `Login failed: ${error.message}`;
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <span className="text-muted-foreground">|</span>
            <h1 className="text-2xl font-bold text-primary">basker</h1>
            <span className="text-muted-foreground">×</span>
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm text-muted-foreground">Bluesky</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-4 py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 max-w-md w-full shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-1">basker</h1>
            <p className="text-muted-foreground text-sm">Your Digital Identity Hub</p>
          </div>
        
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>

          <Card className="bg-background/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-foreground text-lg">Login with Bluesky</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-foreground">
                    Handle or Email
                  </Label>
                  <Input
                    id="identifier"
                    data-testid="input-identifier"
                    type="text"
                    placeholder="user.bsky.social or email@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    data-testid="input-password"
                    type="password"
                    placeholder="Your Bluesky password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                
                <Button
                  type="submit"
                  data-testid="button-login"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Continue with Bluesky
                    </>
                  )}
                </Button>
              </form>
              
              <p className="text-muted-foreground text-xs text-center mt-3">
                Create your personalized link-in-bio page powered by the AT Protocol
              </p>
              
              <div className="mt-4 text-center">
                <p className="text-muted-foreground text-xs mb-1">
                  Don't have a Bluesky account yet?
                </p>
                <a 
                  href="https://bsky.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline text-xs font-medium"
                >
                  Create a free Bluesky account →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-primary">basker</h3>
              <span className="text-muted-foreground">×</span>
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm text-muted-foreground">Bluesky</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                Built on the AT Protocol • Your data, your control
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your own link-in-bio page with basker
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
