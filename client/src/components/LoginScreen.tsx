import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { QRCodeShare } from './QRCodeShare';
import { Footer } from './Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          ></div>
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 dark:border-gray-700/30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Basker</h1>
            <span className="text-gray-400">×</span>
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm text-gray-500">Bluesky</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center p-4 py-12">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 rounded-2xl p-8 max-w-md w-full shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Bluesky Login</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gray-900 dark:text-white">Welcome to</span>{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Basker
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Your Digital Identity Hub</p>
          </div>
        
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>

          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-gray-900 dark:text-white text-lg font-semibold">Login with Bluesky</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-gray-700 dark:text-gray-300 font-medium">
                    Handle or Email
                  </Label>
                  <Input
                    id="identifier"
                    data-testid="input-identifier"
                    type="text"
                    placeholder="user.bsky.social or email@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 dark:border-blue-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    data-testid="input-password"
                    type="password"
                    placeholder="Your Bluesky password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 dark:border-blue-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                
                <Button
                  type="submit"
                  data-testid="button-login"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
              
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-4">
                Create your personalized link-in-bio page powered by the AT Protocol
              </p>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Don't have a Bluesky account yet?
                </p>
                <a 
                  href="https://bsky.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline text-sm font-medium transition-colors duration-300"
                >
                  Create a free Bluesky account →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modern CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.9;
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
