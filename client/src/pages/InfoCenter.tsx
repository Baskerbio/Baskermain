import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { VersionInfo } from '../components/VersionInfo';
import { Header } from '../components/Header';
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
  Heart
} from 'lucide-react';

export default function InfoCenter() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('legal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
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
            <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg rounded-xl p-0.5">
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
            </TabsList>
          </div>

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
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105">
                      <Coffee className="w-4 h-4" />
                      Buy us a coffee
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105">
                      <Gift className="w-4 h-4" />
                      Send a tip
                    </Button>
                  </div>
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
      </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Basker.bio</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your personal link hub powered by AT Protocol
              </p>
            </div>
            <VersionInfo />
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