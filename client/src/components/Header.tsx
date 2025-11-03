import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Info, Crown, HelpCircle, Users, Sparkles } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 shadow-lg' 
        : 'bg-gradient-to-r from-white/80 via-blue-50/80 to-purple-50/80 dark:from-gray-900/80 dark:via-blue-900/20 dark:to-purple-900/20 backdrop-blur-md border-b border-white/30 dark:border-gray-700/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-0"></div>
              <img 
                src="/baskerchristmas.jpg"
                alt="Basker"
                className="relative w-full h-full rounded-full ring-2 ring-white/50 dark:ring-gray-700/50 group-hover:scale-110 transition-transform duration-300 z-10 object-cover"
                style={{ display: 'block', width: '100%', height: '100%', position: 'relative', visibility: logoError ? 'hidden' : 'visible' }}
                loading="eager"
                onError={(e) => {
                  console.error('Logo image failed to load:', e);
                  setLogoError(true);
                }}
              />
              {logoError && (
                <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 z-20 flex items-center justify-center ring-2 ring-white/50 dark:ring-gray-700/50">
                  <span className="text-white text-sm sm:text-base font-bold">B</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300">
                Basker
              </h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/about" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group">
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/pricing" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-lg hover:bg-purple-50/50 dark:hover:bg-purple-900/20 group">
              <span className="relative z-10">Pricing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/solaris" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 rounded-lg hover:bg-pink-50/50 dark:hover:bg-pink-900/20 group">
              <span className="relative z-10">Solaris</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/starter-packs" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 group">
              <span className="relative z-10">Starter Packs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/info" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 rounded-lg hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 group">
              <span className="relative z-10">Info Center</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            {isAuthenticated && user && (
              <>
                <Link href="/analytics" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 group">
                  <span className="relative z-10">Analytics</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/import" className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 rounded-lg hover:bg-orange-50/50 dark:hover:bg-orange-900/20 group">
                  <span className="relative z-10">Import</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </div>
          
          <div className="ml-4 pl-4 border-l border-gray-200/50 dark:border-gray-700/50">
            {isAuthenticated && user ? (
              <Link href="/profile">
                <Button size="sm" className="text-sm px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Sparkles className="w-4 h-4 mr-2" />
                  My Profile
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-sm px-6 py-2 border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
        >
          {showMobileMenu ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-white/20 dark:border-gray-700/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* User info for authenticated users */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-60"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.handle?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">@{user?.handle}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Welcome back!</div>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/about">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  <Info className="w-4 h-4" />
                  About
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                  <Crown className="w-4 h-4" />
                  Pricing
                </Button>
              </Link>
              <Link href="/solaris">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-gray-800/50 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300">
                  <Sparkles className="w-4 h-4" />
                  Solaris
                </Button>
              </Link>
              <Link href="/starter-packs">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300">
                  <Users className="w-4 h-4" />
                  Starter Packs
                </Button>
              </Link>
              <Link href="/info">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-gray-800/50 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-300">
                  <Info className="w-4 h-4" />
                  Info Center
                </Button>
              </Link>
              {isAuthenticated && user ? (
                <Link href="/profile">
                  <Button size="sm" className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-300">
                    <Sparkles className="w-4 h-4" />
                    My Profile
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
