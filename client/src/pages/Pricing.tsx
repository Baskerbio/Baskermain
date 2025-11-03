import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { ArrowLeft, Gift, Check, Star, Zap, Heart, Coffee, QrCode, ExternalLink } from 'lucide-react';

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const features = [
    "Unlimited links",
    "Custom themes",
    "Stories and notes",
    "Widgets",
    "Public profiles",
    "AT Protocol integration",
    "Data ownership",
    "Open source"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <Header />
      
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
            backgroundSize: '30px 30px',
            animation: 'gridMove 25s linear infinite'
          }}></div>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-8 px-4 overflow-hidden">
          {/* Modern gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Modern Pricing Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <Gift className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Free Forever</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">Free Forever</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Basker is completely free to use. No hidden fees, no premium tiers, no limits.
            </p>
          </div>
        </section>


        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What's Included</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Everything you need to create an amazing link-in-bio page
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:-translate-y-1 animate-fade-in group"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature}</h3>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2 text-gray-900 dark:text-white">
                <Heart className="w-5 h-5 text-pink-500" />
                Support Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                While Basker is free, donations help us keep the service running and improve it for everyone.
              </p>
              <div className="flex justify-center">
                <a 
                  href="https://buymeacoffee.com/basker" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.38 0 2.5-1.12 2.5-2.5S19.88 3 18.5 3zM16 5v1.5c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5V5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5z"/>
                  </svg>
                  <span>Support on Buy Me a Coffee</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Physical Card Section */}
        <section className="pt-8 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Physical Basker Card</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
              Take your digital presence offline with a physical card
            </p>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4 sm:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Scan & Connect</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    A sleek physical card with QR/NFC that instantly connects to your Basker profile. 
                    Choose from icons, patterns, emojis, or simple colors.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-900 dark:text-white">QR code scanning for instant access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-900 dark:text-white">NFC tap technology for seamless connection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-900 dark:text-white">Premium card design with your branding</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-900 dark:text-white">Eco-friendly materials</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">Coming Soon</h3>
                    
                    {/* Card Examples Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
                      {/* Text Example Card - Professional Layout */}
                      <div className="physical-card-container">
                        <div className="physical-card-border">
                          <div className="physical-card physical-card-blue">
                            {/* Top right corner branding */}
                            <div className="absolute top-3 right-3 text-white/80 text-xs font-mono">BASKER</div>
                            
                            {/* Large name in center */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-2xl font-bold text-center">ALEX CHEN</div>
                            
                            {/* Title below name */}
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white/90 text-xs sm:text-sm text-center">Software Engineer</div>
                            
                            {/* Contact info */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs sm:text-sm text-center">
                              <div>alex@company.com</div>
                              <div className="text-[10px] sm:text-xs mt-1">+1 (555) 123-4567</div>
                            </div>
                            
                            {/* User handle in top left */}
                            <div className="absolute top-2 left-2 text-white/80 text-[10px] sm:text-xs font-mono">@MaxParsons.bsky.social</div>
                            
                            <div className="card-signature"></div>
                            <div className="card-doodle"></div>
                          </div>
                        </div>
                      </div>

                      {/* Icons Example Card - Visual Only */}
                      <div className="physical-card-container">
                        <div className="physical-card-border">
                          <div className="physical-card physical-card-purple">
                            {/* Large decorative elements - centered */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white/90 text-2xl sm:text-4xl text-center">
                              ✨ 🎨 ✨
                            </div>
                            
                            {/* User handle in top left corner */}
                            <div className="absolute top-2 left-2 text-white/80 text-[10px] sm:text-xs font-mono">@CreativeStudio.bsky.social</div>
                            
                            {/* Decorative elements in corners */}
                            <div className="absolute top-2 right-2 text-white/60 text-sm sm:text-lg">🎨</div>
                            <div className="absolute bottom-2 left-2 text-white/60 text-sm sm:text-lg">🖌️</div>
                            <div className="absolute bottom-2 right-2 text-white/60 text-sm sm:text-lg">🎭</div>
                            
                            <div className="card-signature"></div>
                            <div className="card-doodle"></div>
                          </div>
                        </div>
                      </div>

                      {/* Custom Wallpaper Card - Minimal Design */}
                      <div className="physical-card-container">
                        <div className="physical-card-border">
                          <div className="physical-card" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                          }}>
                            {/* Nature pattern overlay */}
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")'
                            }}></div>
                            
                            {/* Minimal text in center */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-2xl font-bold text-center">
                              Emma Wilson
                            </div>
                            
                            {/* User handle in top right corner */}
                            <div className="absolute top-2 right-2 text-white/80 text-[10px] sm:text-xs font-mono">@WellnessJourney.bsky.social</div>
                            
                            {/* Simple decorative line */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-white/30"></div>
                            
                            <div className="card-signature"></div>
                            <div className="card-doodle"></div>
                          </div>
                        </div>
                      </div>

                      {/* Full Color Card - Solid Color Only */}
                      <div className="physical-card-container">
                        <div className="physical-card-border">
                          <div className="physical-card" style={{
                            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
                            backgroundSize: '400% 400%',
                            animation: 'gradient 3s ease infinite',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
                          }}>
                            {/* User handle in bottom right corner - NO NAME */}
                            <div className="absolute bottom-2 right-2 text-white/80 text-[10px] sm:text-xs font-mono drop-shadow-lg">@TechNewsSite.com</div>
                            
                            {/* Simple decorative elements */}
                            <div className="absolute top-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full drop-shadow-lg"></div>
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full drop-shadow-lg"></div>
                            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full drop-shadow-lg"></div>
                            
                            <div className="card-signature"></div>
                            <div className="card-doodle"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        <QrCode className="w-3 h-3" />
                        Interactive Examples - Hover to see 3D effect
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Ready to get started?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <Zap className="w-4 h-4 mr-2" />
                    Go to My Profile
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Your Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-60"></div>
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                    className="relative w-8 h-8 rounded-full ring-2 ring-white/50 dark:ring-gray-700/50"
                  />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Basker</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                Your decentralized link-in-bio platform built on the AT Protocol. 
                Create, customize, and share your digital identity with complete data ownership.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Powered by</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AT Protocol</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Pricing</Link></li>
                <li><Link href="/starter-packs" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Starter Packs</Link></li>
                <li><Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">FAQ</Link></li>
                <li><Link href="/info" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Info Center</Link></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/info#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">About Us</Link></li>
                <li><a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Bluesky</a></li>
                <li><a href="https://atproto.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">AT Protocol</a></li>
                <li><a href="mailto:support@basker.bio" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 dark:border-gray-700/30 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Basker. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Privacy</a>
                  <a href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Terms</a>
                  <a href="/cookies" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Cookies</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">All systems operational</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Made with ❤️ for the decentralized web
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  v2.0.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
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
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(30px, 30px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
