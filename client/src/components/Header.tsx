import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Info, Crown, HelpCircle, Users } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
              alt="Basker"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Basker</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              Pricing
            </Link>
            <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              FAQ
            </Link>
            <Link href="/starter-packs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              Starter Packs
            </Link>
            <Link href="/info" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              Info Center
            </Link>
          </div>
          
          {isAuthenticated && user ? (
            <Link href="/profile">
              <Button size="sm" className="text-sm px-3">
                My Profile
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden px-2"
        >
          {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
            {/* User info for authenticated users */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-medium">
                    {user?.handle?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">@{user?.handle}</div>
                  <div className="text-xs text-muted-foreground">Welcome back!</div>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <div className="space-y-2">
              <Link href="/about">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                  <Info className="w-4 h-4" />
                  About
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                  <Crown className="w-4 h-4" />
                  Pricing
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </Button>
              </Link>
              <Link href="/starter-packs">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                  <Users className="w-4 h-4" />
                  Starter Packs
                </Button>
              </Link>
              <Link href="/info">
                <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                  <Info className="w-4 h-4" />
                  Info Center
                </Button>
              </Link>
              {isAuthenticated && user ? (
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                    <Users className="w-4 h-4" />
                    My Profile
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-3">
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
