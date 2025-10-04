import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../components/LoginScreen';
import { VersionInfo } from '../components/VersionInfo';
import { Header } from '../components/Header';
import { ArrowRight, Link as LinkIcon, Globe, Users, Zap, Star, Sparkles, Heart, Share2, Palette, StickyNote, Link2, Settings, Image as ImageIcon, ChevronDown, ChevronUp, Info, ExternalLink } from 'lucide-react';
import { atprotocol } from '../lib/atprotocol';
import { createPortal } from 'react-dom';

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [searchHandle, setSearchHandle] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchBoxRect, setSearchBoxRect] = useState<DOMRect | null>(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [nextFeature, setNextFeature] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const features = [
    {
      title: "Links",
      description: "Share unlimited links with custom icons and descriptions",
      image: "/links-example.png",
      icon: Link2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Notes",
      description: "Add personal notes and thoughts to your profile",
      image: "/notes-example.png",
      icon: StickyNote,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Profile",
      description: "Customize your profile with themes and personal info",
      image: "/profile-example.png",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Themes",
      description: "Choose from beautiful themes or create your own",
      image: "/themes-example.png",
      icon: Palette,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Widgets",
      description: "Add interactive widgets to enhance your profile",
      image: "/widgets-example.png",
      icon: Settings,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const faqData = [
    {
      question: "What is Basker?",
      answer: "Basker is a decentralized link-in-bio platform built on the AT Protocol. It allows you to create beautiful, customizable profile pages with unlimited links, stories, notes, and widgets."
    },
    {
      question: "How is Basker different from other link-in-bio services?",
      answer: "Unlike centralized platforms, Basker is built on the AT Protocol, meaning your data belongs to you and works across the entire decentralized network. No platform lock-in, no data harvesting."
    },
    {
      question: "Do I need a Bluesky account to use Basker?",
      answer: "Yes, Basker uses Bluesky authentication. You'll need a Bluesky account to sign in and create your profile. If you don't have one, you can create a free account at bsky.app."
    },
    {
      question: "Is Basker free to use?",
      answer: "Yes! Basker is currently free to use. We're working on premium features that will be available soon for supporters."
    },
    {
      question: "Can I customize my profile?",
      answer: "Absolutely! You can customize your profile with different themes, add unlimited links, create stories, add notes, and include various widgets. Everything is drag-and-drop for easy editing."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! Since Basker is built on the AT Protocol, your data is decentralized and secure. You own your data, and it's not stored on our servers in a traditional sense."
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      const next = (currentFeature + 1) % features.length;
      setNextFeature(next);
      setIsTransitioning(true);
      
      // Complete the transition immediately after starting it
      setTimeout(() => {
        setCurrentFeature(next);
        setIsTransitioning(false);
      }, 50); // Very short delay just to allow the transition to start
    }, 5000); // 5 seconds between transitions
    return () => clearInterval(interval);
  }, [currentFeature]);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(Array.from(prev).concat(entry.target.id)));
        }
      });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Debounced search function
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchHandle.trim().length >= 2) {
        setIsSearching(true);
        try {
          // Use the public API directly for search without authentication
          console.log('Searching for:', searchHandle.trim());
          const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?term=${encodeURIComponent(searchHandle.trim())}&limit=5`);
          const data = await response.json();
          
          console.log('Search response:', data);
          
          if (data.actors && data.actors.length > 0) {
            const suggestions = data.actors.map((actor: any) => ({
              did: actor.did,
              handle: actor.handle,
              displayName: actor.displayName || actor.handle,
              avatar: actor.avatar,
              description: actor.description || '',
              followersCount: actor.followersCount || 0,
              followsCount: actor.followsCount || 0,
              postsCount: actor.postsCount || 0,
            }));
            console.log('Suggestions:', suggestions);
            setSearchSuggestions(suggestions);
            setShowSuggestions(true);
            // Update position when suggestions change
            if (searchInputRef.current) {
              setSearchBoxRect(searchInputRef.current.getBoundingClientRect());
            }
          } else {
            console.log('No actors found');
            setSearchSuggestions([]);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    // Update position on scroll and resize
    const handleScroll = () => {
      if (showSuggestions && searchInputRef.current) {
        setSearchBoxRect(searchInputRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      clearTimeout(searchTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [searchHandle, showSuggestions]);

  const handleSearch = () => {
    if (searchHandle.trim()) {
      let handle = searchHandle.trim();
      // Remove @ if present
      if (handle.startsWith('@')) {
        handle = handle.substring(1);
      }
      // Navigate to the profile
      window.location.href = `/${handle}`;
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchHandle(suggestion.handle);
    setShowSuggestions(false);
    window.location.href = `/${suggestion.handle}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isAuthenticated && user) {
    // Show a welcome interface for authenticated users instead of redirecting
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Header />

        <main>
          {/* Welcome Section */}
          <section className="relative py-20 px-4 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating particles */}
              <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-32 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-60 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-80 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Animated sun rays */}
              <div className="absolute top-10 right-10 opacity-20">
                <svg width="60" height="60" viewBox="0 0 60 60" className="animate-spin" style={{ animationDuration: '20s' }}>
                  <g>
                    <line x1="30" y1="0" x2="30" y2="8" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="30" y1="52" x2="30" y2="60" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="0" y1="30" x2="8" y2="30" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="52" y1="30" x2="60" y2="30" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="8.5" y1="8.5" x2="13.5" y2="13.5" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="46.5" y1="46.5" x2="51.5" y2="51.5" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="8.5" y1="51.5" x2="13.5" y2="46.5" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <line x1="46.5" y1="8.5" x2="51.5" y2="13.5" stroke="url(#rayGradient)" strokeWidth="2" opacity="0.6"/>
                    <defs>
                      <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24"/>
                        <stop offset="100%" stopColor="#f97316"/>
                      </linearGradient>
                    </defs>
                  </g>
                </svg>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              {/* Animated Welcome Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full mb-6 animate-pulse">
                <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Welcome Back!</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                Welcome back, <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">{user.displayName || user.handle}</span>!
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your link-in-bio page is ready. Manage your links, stories, and content with ease.
              </p>
              
              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Settings className="w-5 h-5 mr-2" />
                    Edit My Profile
                  </Button>
                </Link>
                <Link href={`/${user.handle}`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View My Public Profile
                  </Button>
                </Link>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 dark:border-yellow-800">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Unlimited Links</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add as many links as you want</p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 dark:border-yellow-800">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Custom Themes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Personalize your profile</p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 dark:border-yellow-800">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Stories & Notes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share your moments</p>
                </div>
              </div>
              
              {/* Enhanced Bluesky Link */}
              <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AT</span>
                  </div>
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Powered by the AT Protocol</span>
                </div>
                <div>
                  <a 
                    href="https://bsky.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Visit Bluesky <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Explore Other Profiles
              </h2>
              
              {/* Search Box with Suggestions */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="username.bsky.social"
                      value={searchHandle}
                      onChange={(e) => setSearchHandle(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-8"
                    />
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] max-h-64 overflow-y-auto">
                        {searchSuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.did}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                              {suggestion.avatar ? (
                                <img 
                                  src={suggestion.avatar} 
                                  alt={suggestion.displayName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold text-xs">
                                  {suggestion.displayName.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                                {suggestion.displayName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                @{suggestion.handle}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button onClick={handleSearch} className="px-6">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Search for any Bluesky user's profile
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-5 h-5 rounded-full"
              />
              <h3 className="text-lg font-bold text-primary">Basker</h3>
                <span className="text-muted-foreground">×</span>
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm text-blue-500 font-bold">Bluesky</span>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">
                  Built on the AT Protocol • Your data, your control
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your own link-in-bio page with basker
                </p>
                <div className="mt-2">
                  <VersionInfo />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main>
        {/* Hero Section */}
        <section 
          ref={heroRef}
          id="hero"
          data-section="hero"
          className="relative overflow-hidden min-h-screen flex items-center"
        >
          {/* Warm sun-colored gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20"></div>
          
          {/* Sun rays background */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full opacity-15 dark:opacity-8" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="sunRayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <radialGradient id="sunCenter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="70%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </radialGradient>
              </defs>
              
              {/* Main sun center */}
              <circle cx="300" cy="200" r="40" fill="url(#sunCenter)" opacity="0.4" />
              
              {/* Animated sun rays radiating outward */}
              <g stroke="url(#sunRayGradient)" strokeWidth="3" opacity="0.3">
                {/* Vertical rays */}
                <line x1="300" y1="120" x2="300" y2="80" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
                <line x1="300" y1="280" x2="300" y2="320" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
                
                {/* Horizontal rays */}
                <line x1="220" y1="200" x2="180" y2="200" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
                <line x1="380" y1="200" x2="420" y2="200" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
                
                {/* Diagonal rays */}
                <line x1="240" y1="140" x2="200" y2="100" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }} />
                <line x1="360" y1="140" x2="400" y2="100" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
                <line x1="240" y1="260" x2="200" y2="300" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '3s' }} />
                <line x1="360" y1="260" x2="400" y2="300" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '2.3s', animationDuration: '3s' }} />
                
                {/* Additional rays for fuller sun */}
                <line x1="265" y1="125" x2="245" y2="105" strokeLinecap="round" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
                <line x1="335" y1="125" x2="355" y2="105" strokeLinecap="round" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '2.8s', animationDuration: '3s' }} />
                <line x1="265" y1="275" x2="245" y2="295" strokeLinecap="round" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1.3s', animationDuration: '3s' }} />
                <line x1="335" y1="275" x2="355" y2="295" strokeLinecap="round" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '3s' }} />
              </g>
              
              {/* Second smaller sun */}
              <circle cx="900" cy="600" r="25" fill="url(#sunCenter)" opacity="0.3" />
              
              {/* Animated rays for second sun */}
              <g stroke="url(#sunRayGradient)" strokeWidth="2" opacity="0.2">
                <line x1="900" y1="550" x2="900" y2="520" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '4s' }} />
                <line x1="900" y1="650" x2="900" y2="680" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '2.7s', animationDuration: '4s' }} />
                <line x1="850" y1="600" x2="820" y2="600" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.9s', animationDuration: '4s' }} />
                <line x1="950" y1="600" x2="980" y2="600" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '3.1s', animationDuration: '4s' }} />
                <line x1="875" y1="575" x2="855" y2="555" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '2.1s', animationDuration: '4s' }} />
                <line x1="925" y1="575" x2="945" y2="555" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '4s' }} />
                <line x1="875" y1="625" x2="855" y2="645" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '3.6s', animationDuration: '4s' }} />
                <line x1="925" y1="625" x2="945" y2="645" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.7s', animationDuration: '4s' }} />
              </g>
            </svg>
          </div>
          
          {/* Additional floating elements */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl"></div>
          </div>
          
          {/* Simple floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full floating-particle" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-orange-400/40 rounded-full floating-particle" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-red-400/30 rounded-full floating-particle" style={{ animationDelay: '4s' }}></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-500/20 rounded-full floating-particle" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="max-w-7xl mx-auto relative px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="space-y-6">
                  {/* Warm badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200/50 dark:border-yellow-800/50 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Powered by AT Protocol</span>
                  </div>
                  
                  {/* Modern typography */}
                  <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Your Link-in-Bio,
                    <span className="block bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">Decentralized</span>
                  </h1>
                  
                  <p className={`text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    Create stunning, personalized link-in-bio pages with unlimited customization. 
                    Share your digital presence with the world.
                  </p>
                </div>
            
            {/* Modern Search Box with Suggestions */}
                <div className={`max-w-lg transition-all duration-1000 delay-700 relative z-50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex gap-3 group">
                <div className="relative flex-1">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="username.bsky.social"
                    value={searchHandle}
                    onChange={(e) => setSearchHandle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => {
                      if (searchSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                      if (searchInputRef.current) {
                        setSearchBoxRect(searchInputRef.current.getBoundingClientRect());
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-12 h-14 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 group-hover:border-yellow-300 dark:group-hover:border-yellow-600 group-hover:shadow-xl focus:border-orange-500 dark:focus:border-orange-400"
                  />
                  <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-hover:text-orange-500" />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                    <Button 
                      onClick={handleSearch} 
                      className="px-8 h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              
              {/* Search Suggestions Dropdown - rendered as portal to break out of grid container */}
              {showSuggestions && searchSuggestions.length > 0 && searchBoxRect && createPortal(
                <div 
                  className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-h-64 overflow-y-auto"
                  style={{
                    top: `${searchBoxRect.bottom + 8}px`,
                    left: `${searchBoxRect.left}px`,
                    width: `${searchBoxRect.width}px`,
                    zIndex: 999999,
                  }}
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.did}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                        {suggestion.avatar ? (
                          <img 
                            src={suggestion.avatar} 
                            alt={suggestion.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-sm">
                            {suggestion.displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {suggestion.displayName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{suggestion.handle}
                        </div>
                        {suggestion.description && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                            {suggestion.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>,
                document.body
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 transition-all duration-1000 delay-800">
                Search for any Bluesky user's profile
              </p>
            </div>

            {/* Modern CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link href="/login">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                    >
                      <Sparkles className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" />
                  Create Your Profile
                </Button>
              </Link>
                  <Link href="/examples">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto h-14 px-10 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white dark:hover:bg-gray-800 group"
                    >
                      <Heart className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                      See Examples
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Content - Modern Feature Showcase */}
              <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="relative">
                  {/* Modern glassmorphism background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-800/20 dark:to-gray-900/20 rounded-3xl backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl"></div>
                  
                  {/* Feature Display */}
                  <div className="relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${features[currentFeature].color} flex items-center justify-center transition-all duration-800 ease-out`}>
                        {React.createElement(features[currentFeature].icon, { className: "w-5 h-5 text-white transition-all duration-800" })}
                      </div>
                      <div className="transition-all duration-800 ease-out">
                        <h3 className="font-semibold text-foreground transition-all duration-800">{features[currentFeature].title}</h3>
                        <p className="text-sm text-muted-foreground transition-all duration-800">{features[currentFeature].description}</p>
                      </div>
                    </div>
                    
                    {/* Feature Image - Crossfade */}
                    <div className="relative rounded-2xl overflow-hidden bg-muted/30 h-64">
                      {/* Current Image */}
                      <img 
                        src={features[currentFeature].image} 
                        alt={features[currentFeature].title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-out ${
                          isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                        onError={(e) => {
                          console.error('Hero image failed to load:', features[currentFeature].image, e);
                        }}
                        onLoad={() => {
                          console.log('Hero image loaded successfully:', features[currentFeature].image);
                        }}
                      />
                      
                      {/* Next Image (for crossfade) */}
                      <img 
                        src={features[nextFeature].image} 
                        alt={features[nextFeature].title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-out ${
                          isTransitioning ? 'opacity-100' : 'opacity-0'
                        }`}
                        onError={(e) => {
                          console.error('Next hero image failed to load:', features[nextFeature].image, e);
                        }}
                        onLoad={() => {
                          console.log('Next hero image loaded successfully:', features[nextFeature].image);
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
            </div>
            
                  {/* Feature Indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (index !== currentFeature && !isTransitioning) {
                            setNextFeature(index);
                            setIsTransitioning(true);
                            setTimeout(() => {
                              setCurrentFeature(index);
                              setIsTransitioning(false);
                            }, 50);
                          }
                        }}
                        className={`h-2 rounded-full transition-all duration-600 ease-in-out ${
                          index === currentFeature 
                            ? 'bg-primary w-8' 
                            : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50 hover:w-4'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Features Showcase Section */}
        <section 
          ref={featuresRef}
          id="features"
          data-section="features"
          className="py-24 px-6 lg:px-8 relative"
        >
          {/* Sun rays for features section */}
          <div className="absolute top-10 right-1/4 w-32 h-32 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 128 128">
              <defs>
                <radialGradient id="featureSunCenter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="70%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </radialGradient>
              </defs>
              <circle cx="64" cy="64" r="12" fill="url(#featureSunCenter)" />
              <g stroke="#fbbf24" strokeWidth="2" opacity="0.6">
                <line x1="64" y1="40" x2="64" y2="20" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0s', animationDuration: '2.5s' }} />
                <line x1="64" y1="88" x2="64" y2="108" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '2.5s' }} />
                <line x1="40" y1="64" x2="20" y2="64" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }} />
                <line x1="88" y1="64" x2="108" y2="64" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '2.5s' }} />
                <line x1="48" y1="48" x2="32" y2="32" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '2.5s' }} />
                <line x1="80" y1="48" x2="96" y2="32" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.9s', animationDuration: '2.5s' }} />
                <line x1="48" y1="80" x2="32" y2="96" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />
                <line x1="80" y1="80" x2="96" y2="96" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '2.1s', animationDuration: '2.5s' }} />
              </g>
            </svg>
          </div>
          
          <div className="absolute bottom-20 left-20 w-24 h-24 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="8" fill="url(#featureSunCenter)" />
              <g stroke="#f97316" strokeWidth="1.5" opacity="0.4">
                <line x1="48" y1="32" x2="48" y2="16" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '3.5s' }} />
                <line x1="48" y1="64" x2="48" y2="80" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '3.5s' }} />
                <line x1="32" y1="48" x2="16" y2="48" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '2.6s', animationDuration: '3.5s' }} />
                <line x1="64" y1="48" x2="80" y2="48" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '3.5s' }} />
                <line x1="36" y1="36" x2="24" y2="24" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.9s', animationDuration: '3.5s' }} />
                <line x1="60" y1="36" x2="72" y2="24" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
                <line x1="36" y1="60" x2="24" y2="72" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '3.1s', animationDuration: '3.5s' }} />
                <line x1="60" y1="60" x2="72" y2="72" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.7s', animationDuration: '3.5s' }} />
              </g>
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200/50 dark:border-yellow-800/50 mb-6">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                Everything you need for your
                <span className="block bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">link-in-bio</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Built on the decentralized AT Protocol, your profile is truly yours with unlimited customization and modern design tools
              </p>
            </div>

            {/* Modern Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`group hover:shadow-2xl transition-all duration-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 hover:border-yellow-300/50 dark:hover:border-yellow-600/50 hover:-translate-y-3 ${
                    visibleSections.has('features') 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Modern Feature Image */}
                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:from-yellow-50 dark:group-hover:from-yellow-900/20 transition-all duration-500">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            console.error('Image failed to load:', feature.image, e);
                            e.currentTarget.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', feature.image);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className={`absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          {React.createElement(feature.icon, { className: "w-6 h-6 text-white" })}
                        </div>
                  </div>
                      
                      {/* Modern Feature Content */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                </CardContent>
              </Card>
              ))}
            </div>

            {/* Modern Additional Features */}
            <div className="mt-24 grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-6 group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Public Profiles</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your profile is accessible at a clean URL that you can share anywhere. No platform lock-in, complete freedom.
                </p>
              </div>

              <div className="text-center space-y-6 group">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Decentralized</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Powered by the AT Protocol. Your data belongs to you and works across the entire network seamlessly.
                </p>
              </div>

              <div className="text-center space-y-6 group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Easy Sharing</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Share your profile anywhere with a simple link. Works on all platforms and devices effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes with our simple 3-step process
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-lg">
                  1
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">Sign in with Bluesky</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                  Use your existing Bluesky account to get started. No new passwords or accounts needed.
                </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-lg">
                  2
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Palette className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">Customize Your Profile</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                  Add your links, stories, notes, and widgets. Make it uniquely yours with drag-and-drop editing.
                </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-lg">
                  3
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Share2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">Share Your Link</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                  Share your profile URL anywhere. It works as your personal link-in-bio page.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to get started?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of users who have already created their decentralized link-in-bio pages
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Your Profile
                    </Button>
                  </Link>
                  <Link href="/examples">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                      <Heart className="w-4 h-4 mr-2" />
                      See Examples
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
          
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join the decentralized web
            </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Be part of the future of social media where you own your data
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">100%</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground mb-1">Decentralized</div>
                  <div className="text-muted-foreground text-sm">Your data, your control</div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">∞</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground mb-1">Unlimited Links</div>
                  <div className="text-muted-foreground text-sm">Share everything you want</div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">0</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground mb-1">Platform Lock-in</div>
                  <div className="text-muted-foreground text-sm">Truly portable profiles</div>
                </div>
              </div>
            </div>

            {/* Bluesky Integration */}
            <div className="mt-16 text-center">
              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <img 
                    src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                    alt="Bluesky"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="text-left">
                    <div className="text-lg font-semibold text-foreground">Powered by Bluesky</div>
                    <div className="text-sm text-muted-foreground">Built on the AT Protocol</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Basker integrates seamlessly with Bluesky, the decentralized social network. 
                  Your profile works across the entire AT Protocol ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a 
                    href="https://bsky.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Bluesky
                  </a>
                  <Link href="/login">
                    <Button variant="outline" className="px-6 py-3">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us & FAQ Section */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                About Basker
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're building the future of link-in-bio pages on the decentralized web
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To create a truly decentralized link-in-bio platform where users own their data and have complete control over their online presence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Built on AT Protocol</h3>
                    <p className="text-muted-foreground">
                      Leveraging the power of the AT Protocol to ensure your profile works across the entire decentralized network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Open Source</h3>
                    <p className="text-muted-foreground">
                      Basker is open source and community-driven. We believe in transparency and giving back to the community.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border border-border/50 rounded-lg">
                      <button
                        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      >
                        <span className="font-medium text-foreground">{faq.question}</span>
                        {openFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      {openFAQ === index && (
                        <div className="px-4 pb-4">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-5 h-5 rounded-full"
              />
              <h3 className="text-lg font-bold text-primary">Basker</h3>
              <span className="text-sm text-muted-foreground">© 2025</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                Built on the AT Protocol • Your data, your control
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your own link-in-bio page with basker
              </p>
              <div className="mt-2">
                <VersionInfo />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced CSS for smooth animations and effects */}
      <style>{`
        .feature-image {
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes sunRays {
          0% {
            transform: rotate(0deg);
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.3;
          }
        }
        
        @keyframes sunPulse {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
        }
        
        @keyframes rayGlow {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
        }
        
        @keyframes floatingParticle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.7;
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
        
        @keyframes floatUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        
        .floating-particle {
          animation: floatingParticle 8s ease-in-out infinite;
        }
        
        .floating-element {
          transition: transform 0.3s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced hover effects */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\\:rotate-12 {
          transform: rotate(12deg);
        }
        
        .group:hover .group-hover\\:translate-x-1 {
          transform: translateX(4px);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: hsl(var(--muted));
        }
        
        ::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </div>
  );
}
