import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../components/LoginScreen';
import { ArrowRight, Link as LinkIcon, Globe, Users, Zap, Menu, X, Star, Sparkles, Heart, Share2, Palette, StickyNote, Link2, Settings, Image as ImageIcon, ChevronDown, ChevronUp, CreditCard, Gift, Coffee, HelpCircle, Info } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [searchHandle, setSearchHandle] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [nextFeature, setNextFeature] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const features = [
    {
      title: "Links",
      description: "Share unlimited links with custom icons and descriptions",
      image: "/assets/links example .png",
      icon: Link2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Notes",
      description: "Add personal notes and thoughts to your profile",
      image: "/assets/Notes example .png",
      icon: StickyNote,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Profile",
      description: "Customize your profile with themes and personal info",
      image: "/assets/Profile example .png",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Themes",
      description: "Choose from beautiful themes or create your own",
      image: "/assets/themes example .png",
      icon: Palette,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Widgets",
      description: "Add interactive widgets to enhance your profile",
      image: "/assets/widgets example .png",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isAuthenticated && user) {
    // Show a welcome interface for authenticated users instead of redirecting
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
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
            
            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-4">
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </div>
              <Link href="/profile">
                <Button size="sm" className="text-sm px-3">
                  My Profile
                </Button>
              </Link>
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
                {/* User info */}
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

                {/* Action buttons */}
                <div className="space-y-2">
                  <Link href="/about">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                      <Info className="w-4 h-4" />
                      About
                    </Button>
                  </Link>
                  <Link href="/faq">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                      <HelpCircle className="w-4 h-4" />
                      FAQ
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                      <CreditCard className="w-4 h-4" />
                      Pricing
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                      <Coffee className="w-4 h-4" />
                      Support
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3">
                      <Users className="w-4 h-4" />
                      My Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        <main>
          {/* Welcome Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Welcome back, <span className="text-primary">{user.displayName || user.handle}</span>!
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your link-in-bio page is ready. Manage your links, stories, and content.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto">
                    Edit My Profile
                  </Button>
                </Link>
                <Link href={`/${user.handle}`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View My Public Profile
                  </Button>
                </Link>
              </div>
              
              {/* Bluesky Link */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Powered by</span>
                  <span className="text-sm text-blue-500 font-bold">the AT Protocol</span>
                </div>
                <a 
                  href="https://bsky.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline text-sm font-medium"
                >
                  Visit Bluesky →
                </a>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Explore Other Profiles
              </h2>
              
              {/* Search Box */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="username.bsky.social"
                      value={searchHandle}
                      onChange={(e) => setSearchHandle(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-8"
                    />
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-6 h-6 rounded-full"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Basker</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
          
          {/* Sun Animation */}
          <div className="absolute top-20 right-20 w-32 h-32 opacity-30">
            {/* Sun Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full sun-pulse"></div>
            
            {/* Sun Rays */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sun-rays">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute top-1/2 right-0 transform translate-y-1/2 w-8 h-1 bg-gradient-to-l from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute top-2 left-2 w-1 h-6 bg-gradient-to-br from-yellow-300 to-transparent ray-glow transform rotate-45"></div>
              <div className="absolute top-2 right-2 w-1 h-6 bg-gradient-to-bl from-yellow-300 to-transparent ray-glow transform -rotate-45"></div>
              <div className="absolute bottom-2 left-2 w-1 h-6 bg-gradient-to-tr from-yellow-300 to-transparent ray-glow transform -rotate-45"></div>
              <div className="absolute bottom-2 right-2 w-1 h-6 bg-gradient-to-tl from-yellow-300 to-transparent ray-glow transform rotate-45"></div>
            </div>
          </div>
          
          {/* Additional Sun Elements */}
          <div className="absolute top-40 left-10 w-20 h-20 opacity-20">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full sun-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sun-rays">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-yellow-300 ray-glow"></div>
              <div className="absolute top-1/2 right-0 transform translate-y-1/2 w-4 h-0.5 bg-yellow-300 ray-glow"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-yellow-300 ray-glow"></div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-0.5 bg-yellow-300 ray-glow"></div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Powered by the AT Protocol</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Link-in-Bio,
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Decentralized</span>
            </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
                    Create stunning link-in-bio pages with unlimited customization. 
              Share your links, stories, and content with the world.
            </p>
                </div>
            
            {/* Search Box */}
                <div className="max-w-md">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="username.bsky.social"
                    value={searchHandle}
                    onChange={(e) => setSearchHandle(e.target.value)}
                    onKeyPress={handleKeyPress}
                        className="pl-8 h-12"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                    <Button onClick={handleSearch} className="px-6 h-12">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Search for any Bluesky user's profile
              </p>
            </div>

            {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8">
                      <Sparkles className="w-4 h-4 mr-2" />
                  Create Your Profile
                </Button>
              </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                    <Heart className="w-4 h-4 mr-2" />
                    See Examples
              </Button>
                </div>
              </div>

              {/* Right Content - Feature Showcase */}
              <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="relative">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                  
                  {/* Feature Display */}
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-2xl">
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
                      />
                      
                      {/* Next Image (for crossfade) */}
                      <img 
                        src={features[nextFeature].image} 
                        alt={features[nextFeature].title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-out ${
                          isTransitioning ? 'opacity-100' : 'opacity-0'
                        }`}
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

        {/* Features Showcase Section */}
        <section className="py-20 px-4 relative">
          {/* Background Sun Elements */}
          <div className="absolute top-10 right-1/4 w-16 h-16 opacity-15">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full sun-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sun-rays">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-300 ray-glow"></div>
              <div className="absolute top-1/2 right-0 transform translate-y-1/2 w-3 h-0.5 bg-yellow-300 ray-glow"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-300 ray-glow"></div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-0.5 bg-yellow-300 ray-glow"></div>
            </div>
          </div>
          
          <div className="absolute bottom-20 left-20 w-12 h-12 opacity-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full sun-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sun-rays">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-300 ray-glow"></div>
              <div className="absolute top-1/2 right-0 transform translate-y-1/2 w-2 h-0.5 bg-yellow-300 ray-glow"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-300 ray-glow"></div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-300 ray-glow"></div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything you need for your link-in-bio
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built on the decentralized AT Protocol, your profile is truly yours with unlimited customization
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Feature Image */}
                      <div className="relative rounded-xl overflow-hidden bg-muted/20 group-hover:bg-muted/30 transition-colors">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                          {React.createElement(feature.icon, { className: "w-5 h-5 text-white" })}
                        </div>
                  </div>
                      
                      {/* Feature Content */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                </CardContent>
              </Card>
              ))}
            </div>

            {/* Additional Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                  </div>
                <h3 className="text-xl font-semibold text-foreground">Public Profiles</h3>
                <p className="text-muted-foreground text-sm">
                    Your profile is accessible at a clean URL that you can share anywhere. No platform lock-in.
                  </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Decentralized</h3>
                <p className="text-muted-foreground text-sm">
                  Powered by the AT Protocol. Your data belongs to you and works across the entire network.
                </p>
                  </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Share2 className="w-8 h-8 text-white" />
                    </div>
                <h3 className="text-xl font-semibold text-foreground">Easy Sharing</h3>
                <p className="text-muted-foreground text-sm">
                  Share your profile anywhere with a simple link. Works on all platforms and devices.
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
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                    <Heart className="w-4 h-4 mr-2" />
                    See Examples
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
          
          {/* Large Background Sun */}
          <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-40 h-40 opacity-5">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full sun-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sun-rays">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gradient-to-b from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute top-1/2 right-0 transform translate-y-1/2 w-10 h-1 bg-gradient-to-l from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gradient-to-t from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-10 h-1 bg-gradient-to-r from-yellow-300 to-transparent ray-glow"></div>
              <div className="absolute top-3 left-3 w-1 h-8 bg-gradient-to-br from-yellow-300 to-transparent ray-glow transform rotate-45"></div>
              <div className="absolute top-3 right-3 w-1 h-8 bg-gradient-to-bl from-yellow-300 to-transparent ray-glow transform -rotate-45"></div>
              <div className="absolute bottom-3 left-3 w-1 h-8 bg-gradient-to-tr from-yellow-300 to-transparent ray-glow transform -rotate-45"></div>
              <div className="absolute bottom-3 right-3 w-1 h-8 bg-gradient-to-tl from-yellow-300 to-transparent ray-glow transform rotate-45"></div>
            </div>
          </div>
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

        {/* Pricing & Supporter Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Support Basker
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help us build the future of decentralized link-in-bio pages
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Supporter Plan */}
              <Card className="relative border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Supporter</h3>
                    <div className="text-4xl font-bold text-primary mb-2">$3.99</div>
                    <p className="text-muted-foreground">per month</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Advanced themes and customization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Analytics and insights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Priority support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Early access to new features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Supporter badge on your profile</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12" 
                    disabled
                    variant="outline"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              {/* Donation Section */}
              <Card className="border-border/50">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Coffee className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Support Development</h3>
                    <p className="text-muted-foreground">
                      Help us keep Basker free and open source
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Fund server costs and development</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Support open source initiatives</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Help us build new features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Keep Basker accessible to everyone</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12" variant="outline">
                      <Coffee className="w-4 h-4 mr-2" />
                      Buy us a coffee
                    </Button>
                    <Button className="w-full h-12" variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Donate via PayPal
                    </Button>
                    <Button className="w-full h-12" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      One-time donation
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Every contribution helps us improve Basker for everyone
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Join our community
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get updates, share feedback, and connect with other Basker users
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" className="h-12 px-6">
                    <Globe className="w-4 h-4 mr-2" />
                    Join Discord
                  </Button>
                  <Button variant="outline" className="h-12 px-6">
                    <Share2 className="w-4 h-4 mr-2" />
                    Follow on Bluesky
                  </Button>
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
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for smooth crossfade animations and sun effects */}
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
        
        .sun-rays {
          animation: sunRays 20s linear infinite;
        }
        
        .sun-pulse {
          animation: sunPulse 4s ease-in-out infinite;
        }
        
        .ray-glow {
          animation: rayGlow 3s ease-in-out infinite;
        }
        
        .ray-glow:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        .ray-glow:nth-child(3) {
          animation-delay: 1s;
        }
        
        .ray-glow:nth-child(4) {
          animation-delay: 1.5s;
        }
        
        .ray-glow:nth-child(5) {
          animation-delay: 2s;
        }
        
        .ray-glow:nth-child(6) {
          animation-delay: 2.5s;
        }
        
        .ray-glow:nth-child(7) {
          animation-delay: 3s;
        }
        
        .ray-glow:nth-child(8) {
          animation-delay: 3.5s;
        }
      `}</style>
    </div>
  );
}
