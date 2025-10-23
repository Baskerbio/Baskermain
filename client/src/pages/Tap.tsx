import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Solaris() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Basker</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Solaris</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/profile">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Profile
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-6">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Digital Business Cards</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Basker <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Solaris</span>
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto">
            The future of networking is here. Create stunning digital business cards 
            that never go out of style and always stay connected.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/profile">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                  Create Your Card
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <Download className="w-5 h-5 mr-2" />
              See Examples
            </Button>
          </div>
        </div>

        {/* Card Showcase */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Beautiful Card Designs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Choose from professional templates that make an impact</p>
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

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Solaris?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">The most advanced digital business card platform</p>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Multiple design options to match your personal or corporate brand. 
                  Look professional in any industry.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Brand Customization</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-xl">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Sun className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">The Solaris Advantage</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">Why thousands choose Basker Solaris</p>
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

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Ready to Make Your Mark?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have already upgraded to digital business cards. 
                Create yours in minutes and start networking like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href="/profile">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                      Create Your Card
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
                  <Download className="w-5 h-5 mr-2" />
                  View Examples
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
