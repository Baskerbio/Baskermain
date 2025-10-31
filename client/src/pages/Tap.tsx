import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  Download, 
  Share2, 
  ArrowRight,
  Sparkles,
  Palette,
  Zap,
  Heart,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Printer,
  CheckCircle,
  Users,
  Shield,
  Zap as Lightning,
  Sun,
  Moon,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import LightRays from '../components/LightRays';

export default function Solaris() {
  const { user } = useAuth();
  const [scrollProgress, setScrollProgress] = useState({ steve: 0, tony: 0, ron: 0 });
  const [dragRotation, setDragRotation] = useState({ steve: 0, tony: 0, ron: 0 });
  const [isDragging, setIsDragging] = useState({ steve: false, tony: false, ron: false });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rotation: 0 });
  const steveRef = useRef<HTMLDivElement>(null);
  const tonyRef = useRef<HTMLDivElement>(null);
  const ronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const calculateProgress = (ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return 0;
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementCenter = elementTop + (elementBottom - elementTop) * 0.5;
        
        // If element is completely above viewport (not yet visible), show front (0)
        if (elementBottom < 0) return 0;
        
        // If element is completely below viewport, show front (0) until it enters
        if (elementTop > windowHeight) return 0;
        
        // When element is in viewport, animate based on its position
        // Start flipping when element center passes viewport center
        // Use viewport as the scroll range for smooth animation
        const viewportCenter = windowHeight * 0.5;
        
        // Animation range: from when element center is at top 70% of viewport to bottom 30%
        const animationStart = windowHeight * 0.7; // Start flipping here (upper viewport)
        const animationEnd = windowHeight * 0.3;   // Finish flipping here (lower viewport)
        
        // If element center is above animation start - show front (0)
        if (elementCenter > animationStart) return 0;
        
        // If element center is below animation end - show back (1)
        if (elementCenter < animationEnd) return 1;
        
        // Calculate smooth progress between start and end
        // Progress goes from 0 (at start) to 1 (at end)
        const rawProgress = (animationStart - elementCenter) / (animationStart - animationEnd);
        // Apply smoothstep easing for buttery smooth animation
        const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);
        
        return Math.max(0, Math.min(1, easedProgress));
      };

      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        setScrollProgress({
          steve: calculateProgress(steveRef),
          tony: calculateProgress(tonyRef),
          ron: calculateProgress(ronRef)
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drag handlers for card interaction
  const handleMouseDown = (e: React.MouseEvent, cardType: 'steve' | 'tony' | 'ron') => {
    setIsDragging(prev => ({ ...prev, [cardType]: true }));
    setDragStart({ 
      x: e.clientX, 
      y: e.clientY, 
      rotation: dragRotation[cardType] 
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent, cardType: 'steve' | 'tony' | 'ron') => {
    if (!isDragging[cardType]) return;
    
    const deltaX = e.clientX - dragStart.x;
    const sensitivity = 0.5; // Adjust rotation sensitivity
    const newRotation = dragStart.rotation + deltaX * sensitivity;
    
    setDragRotation(prev => ({ ...prev, [cardType]: newRotation }));
  };

  const handleMouseUp = (cardType: 'steve' | 'tony' | 'ron') => {
    setIsDragging(prev => ({ ...prev, [cardType]: false }));
  };

  // Global mouse move handler
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging.steve) handleMouseMove(e, 'steve');
      if (isDragging.tony) handleMouseMove(e, 'tony');
      if (isDragging.ron) handleMouseMove(e, 'ron');
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.steve) handleMouseUp('steve');
      if (isDragging.tony) handleMouseUp('tony');
      if (isDragging.ron) handleMouseUp('ron');
    };

    if (isDragging.steve || isDragging.tony || isDragging.ron) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, cardType: 'steve' | 'tony' | 'ron') => {
    const touch = e.touches[0];
    setIsDragging(prev => ({ ...prev, [cardType]: true }));
    setDragStart({ 
      x: touch.clientX, 
      y: touch.clientY, 
      rotation: dragRotation[cardType] 
    });
  };

  const handleTouchMove = (e: TouchEvent, cardType: 'steve' | 'tony' | 'ron') => {
    if (!isDragging[cardType]) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const sensitivity = 0.5;
    const newRotation = dragStart.rotation + deltaX * sensitivity;
    
    setDragRotation(prev => ({ ...prev, [cardType]: newRotation }));
  };

  const handleTouchEnd = (cardType: 'steve' | 'tony' | 'ron') => {
    setIsDragging(prev => ({ ...prev, [cardType]: false }));
  };

  // Global touch move handler
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging.steve) handleTouchMove(e, 'steve');
      if (isDragging.tony) handleTouchMove(e, 'tony');
      if (isDragging.ron) handleTouchMove(e, 'ron');
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging.steve) handleTouchEnd('steve');
      if (isDragging.tony) handleTouchEnd('tony');
      if (isDragging.ron) handleTouchEnd('ron');
    };

    if (isDragging.steve || isDragging.tony || isDragging.ron) {
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalTouchEnd);
      
      return () => {
        window.removeEventListener('touchmove', handleGlobalTouchMove);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging, dragStart]);

  // Seeded random number generator for consistent but varied values
  const seededRandom = (seed: number) => {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  };

  // Generate stable top-level particle configurations
  const topParticleConfigs = useMemo(() => {
    const rng = seededRandom(12345);
    return Array.from({ length: 15 }, (_, i) => {
      return {
        key: i,
        left: rng() * 100,
        top: rng() * 100,
        delay: rng() * 10,
        duration: 12 + rng() * 8
      };
    });
  }, []);

  // Generate stable particle configurations (only once, not on every render)
  const particleConfigs = useMemo(() => {
    const particleColors = [
      { bg: 'bg-gray-600', opacity: 0.25 },
      { bg: 'bg-blue-500', opacity: 0.2 },
      { bg: 'bg-purple-500', opacity: 0.2 },
      { bg: 'bg-pink-500', opacity: 0.2 },
      { bg: 'bg-cyan-500', opacity: 0.2 },
      { bg: 'bg-yellow-500', opacity: 0.2 },
      { bg: 'bg-red-500', opacity: 0.2 },
      { bg: 'bg-green-500', opacity: 0.2 },
      { bg: 'bg-orange-500', opacity: 0.2 },
      { bg: 'bg-indigo-500', opacity: 0.2 }
    ];
    
    const rng = seededRandom(67890);
    return Array.from({ length: 60 }, (_, i) => {
      const color = particleColors[Math.floor(rng() * particleColors.length)];
      const size = 1 + rng() * 3;
      const left = rng() * 100;
      const top = rng() * 100;
      const delay = rng() * 10;
      const duration = 15 + rng() * 10;
      
      return {
        key: i,
        color,
        size,
        left,
        top,
        delay,
        duration
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Clean minimal background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
      
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-5" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(239,68,68)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>
      
        {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ zIndex: 2 }}>
        {topParticleConfigs.map((particle) => (
          <div
            key={particle.key}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              animation: 'float 12s ease-in-out infinite',
              willChange: 'transform'
            }}
          ></div>
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-50 sticky top-0">
        <Header />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-8 sm:pt-12 md:pt-16 pb-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-200">Coming Soon</span>
              </div>
              
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight px-2">
                  Your digital identity
                  <span className="block text-red-500">
                    reimagined
                  </span>
              </h1>
              
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-2">
                  Basker Solaris will transform how you share your professional presence. 
                  <span className="text-gray-500 italic">One card, infinite possibilities.</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-1 px-4">
                <Button 
                  size="lg" 
                  disabled
                  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-400 text-white px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg md:text-xl font-semibold rounded-lg shadow-lg cursor-not-allowed opacity-60"
                >
                  Coming Soon
                </Button>
                
                <Link href="/info-center#cards">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg md:text-xl font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Card Showcase */}
        <section className="pb-12 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" style={{paddingTop: '1rem'}}>
          {/* Background particles and gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient orbs on edges - more visible */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/15 to-rose-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-2/3 left-1/2 w-88 h-88 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2.2s'}}></div>
            <div className="absolute bottom-1/2 left-1/3 w-70 h-70 bg-gradient-to-r from-fuchsia-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.8s'}}></div>
            <div className="absolute top-3/4 right-1/2 w-56 h-56 bg-gradient-to-r from-lime-500/15 to-green-500/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '2.8s'}}></div>
            
            {/* Floating particles with varied colors - adjusted for light background */}
            {particleConfigs.map((particle) => (
              <div
                key={particle.key}
                className={`absolute ${particle.color.bg} rounded-full dark:opacity-30`}
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.color.opacity,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  animation: 'float 15s ease-in-out infinite',
                  willChange: 'transform',
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color.bg.replace('bg-', '')}`
                }}
              ></div>
            ))}
            
            {/* Subtle pattern overlay on edges */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-100/30 to-transparent dark:from-black/5 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100/30 to-transparent dark:from-black/5 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-100/30 to-transparent dark:from-black/5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-100/30 to-transparent dark:from-black/5 pointer-events-none"></div>
            
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            ></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{paddingTop: '0'}}>
            <div className="text-center mb-8 sm:mb-10" style={{marginTop: '0', paddingTop: '0'}}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
                Preview designs
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto px-4">
                Preview designs only - Basker Solaris is not yet available. These are concept previews showing potential professional card designs that may be available in the future.
              </p>
            </div>
            
            {/* Steve card section */}
            <div className="mb-10 sm:mb-12" ref={steveRef}>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white px-4">A little danger looks good on you.</h3>
              </div>
            <div className="flex justify-center px-4">
                <div className="flex flex-col items-center" style={{ perspective: '1000px', width: 'min(280px, 85vw)', height: 'min(177px, 53.8vw)', aspectRatio: '1.586' }}>
                  <div 
                    className="relative w-full h-full cursor-grab active:cursor-grabbing"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${scrollProgress.steve * 180 + dragRotation.steve}deg)`,
                      transition: isDragging.steve ? 'none' : 'transform 0.3s ease-out',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'steve')}
                    onTouchStart={(e) => handleTouchStart(e, 'steve')}
                  >
                    <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg) translateZ(1px)' }}>
                      <img 
                        src="/stevecardfrontd.png" 
                        alt="Solaris card front design - Steve" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}>
                      <img 
                        src="/stevecardbackd.png" 
                        alt="Solaris card back design - Steve" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tony card section */}
            <div className="mb-10 sm:mb-12" ref={tonyRef}>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white px-4">Say hello to my little links.</h3>
              </div>
            <div className="flex justify-center px-4">
                <div className="flex flex-col items-center" style={{ perspective: '1000px', width: 'min(280px, 85vw)', height: 'min(177px, 53.8vw)', aspectRatio: '1.586' }}>
                  <div 
                    className="relative w-full h-full cursor-grab active:cursor-grabbing"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${scrollProgress.tony * 180 + dragRotation.tony}deg)`,
                      transition: isDragging.tony ? 'none' : 'transform 0.3s ease-out',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'tony')}
                    onTouchStart={(e) => handleTouchStart(e, 'tony')}
                  >
                    <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg) translateZ(1px)' }}>
                      <img 
                        src="/tonycardfront.png" 
                        alt="Solaris card front design - Tony" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}>
                      <img 
                        src="/tonycardback.png" 
                        alt="Solaris card back design - Tony" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ron card section */}
            <div className="mb-10 sm:mb-12" ref={ronRef}>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white px-4">Digital or not, wood still wins.</h3>
              </div>
            <div className="flex justify-center px-4">
                <div className="flex flex-col items-center" style={{ perspective: '1000px', width: 'min(280px, 85vw)', height: 'min(177px, 53.8vw)', aspectRatio: '1.586' }}>
                  <div 
                    className="relative w-full h-full cursor-grab active:cursor-grabbing"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${scrollProgress.ron * 180 + dragRotation.ron}deg)`,
                      transition: isDragging.ron ? 'none' : 'transform 0.3s ease-out',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'ron')}
                    onTouchStart={(e) => handleTouchStart(e, 'ron')}
                  >
                    <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg) translateZ(1px)' }}>
                      <img 
                        src="/roncardfront.png" 
                        alt="Solaris card front design - Ron" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}>
                      <img 
                        src="/roncardback.png" 
                        alt="Solaris card back design - Ron" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More images section */}
            <div>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white px-4">And much more!</h3>
                    </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
                <div className="flex justify-center group">
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/50">
                    <img 
                      src="/4stackfront.png" 
                      alt="Solaris card stack front design" 
                      className="w-full max-w-[323px] h-auto rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                    </div>
                <div className="flex justify-center group">
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/50">
                    <img 
                      src="/4stackback.png" 
                      alt="Solaris card stack back design" 
                      className="w-full max-w-[323px] h-auto rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
                What Solaris will offer
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Instant sharing */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Instant sharing</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Share your entire professional profile with a single tap</p>
                </div>

              {/* Always updated */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Always updated</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Your information will stay current across all platforms</p>
              </div>

              {/* Professional networking */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Professional networking</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Build meaningful business relationships effortlessly</p>
              </div>

              {/* Analytics insights */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Analytics insights</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track engagement and optimize your professional presence</p>
              </div>

              {/* Seamless integration */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <LinkIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Seamless integration</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Will work perfectly with BaskerBio and your existing workflow</p>
              </div>

              {/* Premium materials */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Star className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Premium materials</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">High-quality cards that will reflect your professional standards</p>
                </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
                Built for professionals
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
                Solaris will integrate seamlessly with BaskerBio to create a complete professional networking solution
                  </p>
                </div>
                
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart networking</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Connect with the right people at the right time</p>
                </div>
                
                <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Global reach</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Share your profile anywhere in the world</p>
                </div>
                
                <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Memorable impact</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Leave a lasting impression with premium design</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-12 sm:pt-16 md:pt-20 pb-0 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
                Stay updated on Solaris
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-3xl mx-auto px-2">
                Be the first to know when Solaris launches. Join our community and get early access to the future of professional networking.
              </p>
              
              <div style={{marginBottom: 0}}>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 px-2">Coming Soon</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-3 px-2">
                  We're working hard to bring you the most innovative professional networking solution. 
                  Follow our development progress and be among the first to experience Solaris.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4" style={{marginBottom: 0, paddingBottom: 0}}>
                  <Button 
                    size="lg" 
                    disabled
                    className="w-full sm:w-auto bg-gray-400 hover:bg-gray-400 text-white px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg md:text-xl font-semibold rounded-lg shadow-lg cursor-not-allowed opacity-60"
                  >
                    Coming Soon
                  </Button>
                <Link href="/info-center#cards">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg md:text-xl font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Get Notified
                  </Button>
                </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
