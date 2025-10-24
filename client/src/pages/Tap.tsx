import React from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative">
      {/* Light Rays Background */}
      <div className="fixed inset-0 z-0" style={{ zIndex: 0 }}>
        <LightRays />
      </div>
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ zIndex: 1 }}>
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
              animation: 'float 12s ease-in-out infinite'
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
        <section className="relative py-20 sm:py-32">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating particles */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-60 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-80 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-8">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Digital Business Cards</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8">
                Basker <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Solaris</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
                The future of networking is here. Create stunning digital business cards 
                that never go out of style and always stay connected.
              </p>
              
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 px-4 py-2 rounded-full mb-4">
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Coming Soon</span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Solaris cards are coming soon! Stay up to date with updates on development and join our community on{' '}
                <a 
                  href="https://discord.com/invite/d32M7SJvjT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors duration-200"
                >
                  Discord
                </a>
                .
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                Integrated with <span className="font-semibold text-blue-600 dark:text-blue-400">BaskerBio</span> for seamless 
                professional networking and contact management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" disabled className="bg-gradient-to-r from-gray-400 to-gray-500 text-lg px-8 py-4 shadow-xl cursor-not-allowed opacity-60">
                  Coming Soon
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                  <Download className="w-5 h-5 mr-2" />
                  See Examples
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Card Showcase */}
        <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Beautiful Card Designs
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Choose from professional templates that make an impact
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Professional Blue Card */}
            <div className="flex justify-center">
              <div className="physical-card-container">
                <div className="physical-card-border">
                  <div className="physical-card physical-card-blue">
                    <div className="absolute top-3 right-3 text-white/80 text-xs font-mono">BASKER</div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold text-center">ALEX CHEN</div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white/90 text-xs text-center">Software Engineer</div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs text-center">
                      <div>alex@company.com</div>
                      <div className="text-[10px] mt-1">+1 (555) 123-4567</div>
                    </div>
                    <div className="absolute top-2 left-2 text-white/80 text-[10px] font-mono">@alexchen.bsky.social</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Creative Purple Card */}
            <div className="flex justify-center">
              <div className="physical-card-container">
                <div className="physical-card-border">
                  <div className="physical-card physical-card-purple">
                    <div className="absolute top-3 right-3 text-white/80 text-xs font-mono">BASKER</div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold text-center">SARAH KIM</div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white/90 text-xs text-center">Creative Director</div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs text-center">
                      <div>sarah@studio.com</div>
                      <div className="text-[10px] mt-1">+1 (555) 987-6543</div>
                    </div>
                    <div className="absolute top-2 left-2 text-white/80 text-[10px] font-mono">@sarahkim.bsky.social</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Green Card */}
            <div className="flex justify-center">
              <div className="physical-card-container">
                <div className="physical-card-border">
                  <div className="physical-card physical-card-green">
                    <div className="absolute top-3 right-3 text-white/80 text-xs font-mono">BASKER</div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold text-center">MIKE WANG</div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white/90 text-xs text-center">Tech Lead</div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs text-center">
                      <div>mike@tech.com</div>
                      <div className="text-[10px] mt-1">+1 (555) 456-7890</div>
                    </div>
                    <div className="absolute top-2 left-2 text-white/80 text-[10px] font-mono">@mikewang.bsky.social</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wellness Orange Card */}
            <div className="flex justify-center">
              <div className="physical-card-container">
                <div className="physical-card-border">
                  <div className="physical-card physical-card-orange">
                    <div className="absolute top-3 right-3 text-white/80 text-xs font-mono">BASKER</div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold text-center">LISA BROWN</div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white/90 text-xs text-center">Wellness Coach</div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs text-center">
                      <div>lisa@wellness.com</div>
                      <div className="text-[10px] mt-1">+1 (555) 321-0987</div>
                    </div>
                    <div className="absolute top-2 left-2 text-white/80 text-[10px] font-mono">@lisabrown.bsky.social</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Solaris?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                The most advanced digital business card platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mobile First</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Designed for the modern world. Your card looks perfect on any device, 
                  from smartphones to tablets to desktops.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Responsive Design</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Always Updated</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Never hand out an outdated card again. Update your information 
                  instantly and everyone gets the latest version.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Real-time Updates</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">BaskerBio Integration</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Seamlessly integrated with BaskerBio for professional networking, 
                  contact management, and business relationship building.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Professional Networking</span>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 shadow-2xl">
              <CardContent className="p-12">
                <div className="text-center mb-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Sun className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    The Solaris Advantage
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Why thousands choose Basker Solaris
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share with a simple tap or QR code scan
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your data is protected with enterprise-grade security
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Lightning className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lightning-fast loading and instant updates
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Memorable</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stand out with stunning, interactive designs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-20 right-10 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-10 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Make Your Mark?</h2>
                <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                  Join thousands of professionals who will upgrade to digital business cards. 
                  Coming soon with full BaskerBio integration.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Coming Soon</span>
                </div>
                <p className="text-sm text-white/80 mb-8 max-w-2xl mx-auto">
                  Stay updated on development progress and join our community on{' '}
                  <a 
                    href="https://discord.com/invite/d32M7SJvjT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/90 underline transition-colors duration-200"
                  >
                    Discord
                  </a>
                  .
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" disabled className="bg-white/50 text-white/70 text-lg px-8 py-4 shadow-xl cursor-not-allowed opacity-60">
                    Coming Soon
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    View Examples
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
