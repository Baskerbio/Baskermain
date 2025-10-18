import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, AlertTriangle, Sparkles, Zap } from 'lucide-react';
import DecryptedText from '@/components/DecryptedText';
import LightRays from '@/components/LightRays';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating particles */}
        {Array.from({ length: 20 }, (_, i) => (
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
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Light Rays Effect */}
      <LightRays />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number with Animation */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              404
            </h1>
            {/* Floating sparkles around 404 */}
            <div className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-ping">
              <Sparkles className="w-full h-full" />
            </div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 text-cyan-400 animate-pulse">
              <Zap className="w-full h-full" />
            </div>
            <div className="absolute top-1/2 -right-12 w-5 h-5 text-pink-400 animate-bounce">
              <Sparkles className="w-full h-full" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <DecryptedText 
                text="Oops! Page Not Found" 
                className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
              />
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
          </div>

          {/* Animated Card with Actions */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-2xl hover:shadow-3xl transition-all duration-300 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <AlertTriangle className="w-16 h-16 text-orange-500 animate-pulse" />
                  <div className="absolute inset-0 w-16 h-16 bg-orange-500/20 rounded-full animate-ping" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                What happened here?
              </h3>
              
              <div className="space-y-4 text-left mb-8">
                <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    The URL might be misspelled or the page might have been moved
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    The page might be temporarily unavailable or under maintenance
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    You might not have permission to access this page
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                
                <Button 
                  variant="outline"
                  asChild
                  className="border-2 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/search">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fun Facts Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold text-foreground mb-2">Space Explorer</h4>
              <p className="text-sm text-muted-foreground">
                You've discovered a new digital frontier! Even astronauts get lost sometimes.
              </p>
            </div>
            
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-foreground mb-2">Precision Shot</h4>
              <p className="text-sm text-muted-foreground">
                You're 404% accurate at finding pages that don't exist. That's quite a skill!
              </p>
            </div>
            
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-semibold text-foreground mb-2">Digital Magic</h4>
              <p className="text-sm text-muted-foreground">
                You've found the secret page where all the missing pixels go to party!
              </p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? <Link href="/support" className="text-blue-500 hover:text-blue-600 underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
