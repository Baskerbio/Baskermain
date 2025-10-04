import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { ArrowLeft, Info, Zap, Heart, Globe, Users, Shield, Code, Lock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main>
        {/* Hero Section */}
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
            {/* Animated About Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full mb-6 animate-pulse">
              <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">About Us</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              About <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Basker</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              We're building the future of link-in-bio pages on the decentralized web
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a truly decentralized link-in-bio platform where users own their data and have complete control over their online presence.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that your online identity should be portable, secure, and truly yours. That's why we built Basker on the AT Protocol, ensuring that your profile works across the entire decentralized network.
                </p>
              </div>
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Decentralized</h3>
                      <p className="text-muted-foreground">
                        Your data belongs to you, not to us. Built on the AT Protocol for true decentralization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Fast & Reliable</h3>
                      <p className="text-muted-foreground">
                        Lightning-fast performance with 99.9% uptime, powered by the AT Protocol network.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Open Source</h3>
                      <p className="text-muted-foreground">
                        Transparent, community-driven development. Everyone can contribute and improve Basker.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Security & Privacy</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your security and privacy are our top priorities. Here's how we protect you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">End-to-End Encryption</h3>
                  <p className="text-muted-foreground text-sm">
                    All data is encrypted in transit and at rest using industry-standard encryption protocols.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-muted-foreground text-sm">
                    We can't see your private data. Your content is stored on the decentralized AT Protocol network.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Content Security Policy</h3>
                  <p className="text-muted-foreground text-sm">
                    Strict CSP headers prevent XSS attacks and unauthorized script execution.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Rate Limiting</h3>
                  <p className="text-muted-foreground text-sm">
                    Advanced rate limiting protects against DDoS attacks and abuse.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Input Validation</h3>
                  <p className="text-muted-foreground text-sm">
                    All user inputs are validated and sanitized to prevent injection attacks.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-teal-200 dark:border-teal-800">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">HTTPS Everywhere</h3>
                  <p className="text-muted-foreground text-sm">
                    All connections are encrypted with TLS 1.3 and HSTS headers for maximum security.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4 text-center">Security Measures</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Data Protection</h4>
                  <ul className="space-y-2 text-muted-foreground">
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
                  <h4 className="text-lg font-semibold text-foreground mb-3">Technical Security</h4>
                  <ul className="space-y-2 text-muted-foreground">
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
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Privacy First</h3>
                  <p className="text-muted-foreground text-sm">
                    Your data is yours. We don't track, sell, or misuse your personal information.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Interoperable</h3>
                  <p className="text-muted-foreground text-sm">
                    Works across the entire AT Protocol ecosystem. No vendor lock-in.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Community Driven</h3>
                  <p className="text-muted-foreground text-sm">
                    Built by the community, for the community. Your feedback shapes our future.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Transparent</h3>
                  <p className="text-muted-foreground text-sm">
                    Open source code, transparent development process, and clear communication.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Built with ❤️</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Basker is developed by a passionate team of developers who believe in the power of decentralized technology.
            </p>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <p className="text-muted-foreground mb-6">
                We're a small team of developers, designers, and blockchain enthusiasts who came together to build something better than the centralized alternatives.
              </p>
              <p className="text-muted-foreground">
                Our goal is simple: create a link-in-bio platform that puts users first, respects their privacy, and gives them complete control over their online presence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to get started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who have already created their decentralized link-in-bio pages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8">
                    <Users className="w-4 h-4 mr-2" />
                    Go to My Profile
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Your Profile
                  </Button>
                </Link>
              )}
              <Link href="/faq">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                  <Info className="w-4 h-4 mr-2" />
                  Read FAQ
                </Button>
              </Link>
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
    </div>
  );
}
