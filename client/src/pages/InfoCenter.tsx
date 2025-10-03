import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { VersionInfo } from '../components/VersionInfo';
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Info Center</h1>
                <p className="text-sm text-muted-foreground">
                  Everything you need to know about Basker and our services
                </p>
              </div>
            </div>
            {isAuthenticated && (
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  Go to Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-8">
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Legal
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Legal Tab */}
          <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Legal Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/privacy">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium">Privacy Policy</h3>
                            <p className="text-sm text-muted-foreground">
                              How we collect, use, and protect your data
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/terms">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Scale className="w-5 h-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">Terms of Service</h3>
                            <p className="text-sm text-muted-foreground">
                              Rules and guidelines for using our platform
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/eula">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <div>
                            <h3 className="font-medium">End User License Agreement</h3>
                            <p className="text-sm text-muted-foreground">
                              Software licensing terms and conditions
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Free Forever
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Always Free</h2>
                  <p className="text-muted-foreground mb-6">
                    Basker is completely free to use. No hidden fees, no premium tiers, no limits.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Unlimited Links</h3>
                      <p className="text-sm text-muted-foreground">
                        Add as many links as you want to your profile
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">All Widgets</h3>
                      <p className="text-sm text-muted-foreground">
                        Access to all widgets and customization options
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Work History</h3>
                      <p className="text-sm text-muted-foreground">
                        Track and display your professional experience
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Support Our Mission
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    While Basker is free, donations help us keep the service running and improve it for everyone.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Buy us a coffee
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Get Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Get help with your account, technical issues, or general questions.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground">
                          support@basker.bio
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Common Questions</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">How do I create my profile?</h4>
                      <p className="text-sm text-muted-foreground">
                        Sign in with your Bluesky account and start adding links, widgets, and work history to customize your profile.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Can I customize my profile?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! You can customize colors, fonts, layouts, and add various widgets to make your profile unique.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Is my data secure?</h4>
                      <p className="text-sm text-muted-foreground">
                        Absolutely. We use AT Protocol for data storage and follow industry best practices for security.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-2">Basker.bio</h3>
              <p className="text-sm text-muted-foreground">
                Your personal link hub powered by AT Protocol
              </p>
            </div>
            <VersionInfo />
          </div>
        </div>
      </footer>
    </div>
  );
}