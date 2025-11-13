import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { VersionInfo } from '../components/VersionInfo';
import { Header } from '../components/Header';
import { SEOHead } from '../components/SEOHead';
import { 
  FileText, 
  Scale, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Users, 
  Mail,
  ExternalLink,
  Star,
  Zap,
  Crown,
  ArrowLeft,
  Gift,
  Coffee,
  Heart,
  CreditCard,
  Info,
  Shield,
  Code,
  Lock,
  Eye,
  Globe
} from 'lucide-react';
import { Footer } from '../components/Footer';

export default function InfoCenter() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash === 'cards' || hash === 'legal' || hash === 'pricing' || hash === 'support' || hash === 'verification' || hash === 'about') {
      setActiveTab(hash);
      // Smooth scroll to tabs section
      setTimeout(() => {
        const tabsElement = document.querySelector('[role="tablist"]');
        if (tabsElement) {
          tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <SEOHead 
        title="Info Center - Basker Support, FAQ & Legal Information"
        description="Get help with Basker, read FAQs, legal information, and learn about the free link-in-bio platform on AT Protocol. Support and resources for Basker users."
        keywords="Basker help, Basker FAQ, Basker support, Basker legal, Basker privacy, link-in-bio support"
      />
      <Header />
      
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

      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Modern gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Modern Info Center Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Info Center</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">Info Center</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Everything you need to know about Basker
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="grid w-full grid-cols-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg rounded-xl p-0.5">
              <TabsTrigger 
                value="about" 
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
              <TabsTrigger 
                value="legal" 
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Legal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
              <TabsTrigger 
                value="verification" 
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Verification</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cards" 
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Basker</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                We're building the future of link-in-bio pages on the decentralized web
              </p>
            </div>

            {/* Mission Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Info className="w-5 h-5 text-blue-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      Our mission is to create the best free and truly decentralized link-in-bio platform. A platform where users own their data and have complete control over their online presence.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      We believe that your online identity should never be limited by paywalls or hidden fees. That's why Basker gives you full access to themes, widgets, customization and so much more! All for the low low price of $0
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Your digital identity should be truly yours, truly portable, and truly secure.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Info className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Decentralized</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Your data belongs to you, not to us. Built on the AT Protocol for true decentralization.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast & Reliable</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Lightning-fast performance with 99.9% uptime, powered by the AT Protocol network.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5 text-green-500" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
                  Your security and privacy are our top priorities. Here's how we protect you.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">End-to-End Encryption</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      All data is encrypted in transit and at rest using industry-standard encryption protocols.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Zero-Knowledge Architecture</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      We can't see your private data. Your content is stored on the decentralized AT Protocol network.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-pink-200/50 dark:border-pink-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Content Security Policy</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      Strict CSP headers prevent XSS attacks and unauthorized script execution.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-cyan-200/50 dark:border-cyan-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Rate Limiting</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      Advanced rate limiting protects against DDoS attacks and abuse.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Input Validation</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      All user inputs are validated and sanitized to prevent injection attacks.
                    </p>
                  </div>

                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-teal-200/50 dark:border-teal-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">HTTPS Everywhere</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      All connections are encrypted with TLS 1.3 and HSTS headers for maximum security.
                    </p>
                  </div>
                </div>

                <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Security Measures</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Protection</h4>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>End-to-end encryption for all data transmission</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>No personal data collection or tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Decentralized storage on AT Protocol</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Regular security audits and updates</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technical Security</h4>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Content Security Policy (CSP) headers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>XSS and injection attack prevention</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Rate limiting and DDoS protection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Secure CORS and authentication</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Your data is yours. We don't track, sell, or misuse your personal information.
                    </p>
                  </div>

                  <div className="text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interoperable</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Works across the entire AT Protocol ecosystem. No vendor lock-in.
                    </p>
                  </div>

                  <div className="text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-pink-200/50 dark:border-pink-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Driven</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Built by the community, for the community. Your feedback shapes our future.
                    </p>
                  </div>

                  <div className="text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-cyan-200/50 dark:border-cyan-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Transparent</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Open source code, transparent development process, and clear communication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Widget Submission Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Code className="w-5 h-5 text-green-500" />
                  Submit a Widget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
                  Share your custom widget creations with the Basker community. Coming soon!
                </p>

                <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Widget Submission Platform</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We're currently developing a platform where you can submit your custom HTML, CSS, and JavaScript widgets to share with the Basker community. This feature will allow developers to contribute their creations and help expand the available widget library.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Submit widgets using HTML, CSS, and JavaScript</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Share your creations with the community</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Collaborate with other developers</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Help expand the widget library</span>
                        </div>
                      </div>
                      <Link href="/submit-widget">
                        <Button variant="outline" className="mt-4 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                          <Code className="w-4 h-4 mr-2" />
                          Visit Widget Submission Page
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built with ❤️</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Basker is developed by people who wanted a new, better, free and decentralized Link in bio platform
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to get started?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Join thousands of users who have already created their decentralized link-in-bio pages
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuthenticated ? (
                    <Link href="/profile">
                      <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 shadow-lg">
                        <Users className="w-4 h-4 mr-2" />
                        Go to My Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 shadow-lg">
                        <Zap className="w-4 h-4 mr-2" />
                        Create Your Profile
                      </Button>
                    </Link>
                  )}
                  <Link href="/faq">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105">
                      <Info className="w-4 h-4 mr-2" />
                      Read FAQ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Tab */}
          <TabsContent value="legal" className="space-y-6">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Scale className="w-5 h-5 text-blue-500" />
                  Legal Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/privacy">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Privacy Policy</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              How we collect, use, and protect your data
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/terms">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300/50 dark:hover:border-purple-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Scale className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Terms of Service</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Rules and guidelines for using our platform
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/eula">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-pink-200/50 dark:border-pink-800/50 hover:border-pink-300/50 dark:hover:border-pink-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">End User License Agreement</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Software licensing terms and conditions
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/cookies">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 hover:border-green-300/50 dark:hover:border-green-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Cookie Policy</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              How we use cookies and tracking technologies
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/data-processing">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-orange-200/50 dark:border-orange-800/50 hover:border-orange-300/50 dark:hover:border-orange-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Data Processing Agreement</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              GDPR-compliant data processing information
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/acceptable-use">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-cyan-200/50 dark:border-cyan-800/50 hover:border-cyan-300/50 dark:hover:border-cyan-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Acceptable Use Policy</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Guidelines for appropriate platform usage
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dmca">
                    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-300/50 dark:hover:border-indigo-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">DMCA Policy</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Copyright infringement reporting procedures
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Crown className="w-5 h-5 text-purple-500" />
                  Free Forever
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Always Free</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Basker is completely free to use. No hidden fees, no premium tiers, no limits.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Unlimited Links</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Add as many links as you want to your profile
                      </p>
                    </div>
                    
                    <div className="p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">All Widgets</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Access to all widgets and customization options
                      </p>
                    </div>
                    
                    <div className="p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-pink-200/50 dark:border-pink-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Work History</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Track and display your professional experience
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Support Our Mission
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    While Basker is free, donations help us keep the service running and improve it for everyone.
                  </p>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users className="w-5 h-5 text-cyan-500" />
                  Get Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get help with your account, technical issues, or general questions.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Email Support</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          support@basker.bio
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">What is Basker?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Basker is a free link-in-bio platform powered by AT Protocol. It allows you to create a personalized profile where you can share all your important links in one place.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-purple-200/50 dark:border-purple-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">How do I create my profile?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Sign in with your Bluesky account and start adding links, widgets, and work history to customize your profile.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-pink-200/50 dark:border-pink-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Can I customize my profile?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Yes! You can customize colors, fonts, layouts, social icons, widgets, and add borders and containers to make your profile unique.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-green-200/50 dark:border-green-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Is my data secure?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Absolutely. We use AT Protocol for data storage and follow industry best practices for security. Your data is stored securely and you have full control over it.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-orange-200/50 dark:border-orange-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Is Basker really free?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Yes! Basker is completely free forever. There are no premium tiers, no hidden fees, and no usage limits.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-cyan-200/50 dark:border-cyan-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">How do I add links to my profile?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Click the "+ Add Link" button to add a new link. You can organize your links into groups and customize their appearance.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">What widgets are available?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        You can add text widgets, work history, and more. Each widget can be styled with custom colors, borders, and backgrounds.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Can I share my profile publicly?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Yes! Your profile is publicly accessible at basker.bio/your-handle. You can share this URL anywhere.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-yellow-200/50 dark:border-yellow-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">How do I update my banner image?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Click the "Update Banner" button in your profile. You can upload a new image and adjust its position, scale, and border styles.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-teal-200/50 dark:border-teal-800/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Can I track who visits my profile?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        You can enable view count tracking in your Privacy & Behavior settings. This will show how many people have viewed your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  About Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Verification badges help users identify authentic accounts and trusted sources on Basker. 
                    We support two types of verification systems.
                  </p>
                </div>

                {/* Bluesky Verification */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bluesky Verification</h3>
                  </div>
                  <div className="pl-11 space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Blue Checkmark:</strong> Accounts verified by trusted sources on Bluesky automatically 
                      display their verification status on Basker. This includes verification by Bluesky itself 
                      and other trusted labelers.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>How it works:</strong> When you hover over or click a blue verification badge, 
                        you'll see details about who verified the account and when. This information comes 
                        directly from Bluesky's decentralized verification system.
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Learn more about Bluesky verification at{' '}
                      <a 
                        href="https://bsky.social/about/blog/04-21-2025-verification" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        bsky.social/about/blog/04-21-2025-verification
                      </a>
                    </p>
                  </div>
                </div>

                {/* Basker Verification */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        {/* Blue background circle (Bluesky blue) */}
                        <circle cx="12" cy="12" r="11" fill="#0F73FF" stroke="#0F73FF" strokeWidth="1"/>
                        {/* White sun icon - properly centered and scaled */}
                        <g transform="scale(0.4) translate(5.4, 5.4)">
                          <path fill="#FFFFFF" d="M11 11H37V37H11z"></path>
                          <path fill="#FFFFFF" d="M11.272 11.272H36.728V36.728H11.272z" transform="rotate(-45.001 24 24)"></path>
                          <path fill="#FFFFFF" d="M13,24c0,6.077,4.923,11,11,11c6.076,0,11-4.923,11-11s-4.924-11-11-11C17.923,13,13,17.923,13,24"></path>
                        </g>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basker Verification</h3>
                  </div>
                  <div className="pl-11 space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Blue Circle with White Sun:</strong> Accounts affiliated with Basker receive a special 
                      verification badge to indicate their official status within the Basker ecosystem.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Basker verification is manually assigned to official team members and partners.
                    </p>
                  </div>
                </div>

                {/* Verification Benefits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Why Verification Matters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Trust & Authenticity</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Verification badges help users identify authentic accounts and avoid impersonators.
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Credibility</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Verified accounts are more likely to be trusted by visitors to your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <CreditCard className="w-5 h-5 text-red-500" />
                  Basker Solaris - Professional Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200 mb-1">Coming Soon</p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Basker Solaris is currently in development and not yet available for users. 
                          The designs shown on the Solaris page are previews and concepts only.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What is Basker Solaris?</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Basker Solaris will be a revolutionary professional networking solution that transforms 
                    how you share your professional presence. It combines physical business cards with digital 
                    identity technology, allowing you to share your entire professional profile with a single tap.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Features (Planned)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200">Instant Sharing</h4>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Share your entire professional profile with a single tap or scan.
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-purple-900 dark:text-purple-200">Smart Networking</h4>
                      </div>
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        Build meaningful business relationships effortlessly.
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-green-900 dark:text-green-200">Analytics Insights</h4>
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Track engagement and optimize your professional presence.
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <h4 className="font-semibold text-orange-900 dark:text-orange-200">Premium Materials</h4>
                      </div>
                      <p className="text-sm text-orange-800 dark:text-orange-300">
                        High-quality cards that reflect your professional standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integration with BaskerBio</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Solaris will integrate seamlessly with BaskerBio to create a complete professional 
                    networking solution. Your BaskerBio profile will automatically sync with your Solaris 
                    card, ensuring your information is always up to date.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Note:</strong> Since Solaris is not yet available, you can create your professional 
                      profile on BaskerBio today. When Solaris launches, your existing BaskerBio profile will 
                      be ready to integrate.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Designs</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The designs shown on the Solaris preview page are concept designs only. These are 
                    early previews of potential card designs that may be available when Solaris launches. 
                    Final designs, features, and availability will be announced closer to launch.
                  </p>
                  <Link href="/solaris">
                    <Button variant="outline" className="w-full sm:w-auto">
                      View Preview Designs
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We're working hard to bring you the most innovative professional networking solution. 
                    Follow our development progress and be among the first to experience Solaris when it launches.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
        </div>
      </main>

      {/* Footer */}
      <Footer />

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
            transform: translate(20px, 20px);
          }
        }
        
        @keyframes tabSlide {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes tabGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
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
        
        .animate-tab-slide {
          animation: tabSlide 0.3s ease-out;
        }
        
        .animate-tab-glow {
          animation: tabGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}