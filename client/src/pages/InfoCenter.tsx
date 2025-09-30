import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { VersionInfo } from '../components/VersionInfo';
import { 
  Shield, 
  FileText, 
  Scale, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Building2, 
  Users, 
  Mail,
  ExternalLink,
  Star,
  Zap,
  Crown,
  ArrowLeft
} from 'lucide-react';

export default function InfoCenter() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('verification');

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
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
              <Shield className="w-10 h-10" />
              Info Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Everything you need to know about Basker, verification, and our services
            </p>
          </div>
        </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Verification
            </TabsTrigger>
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

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">How Verification Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">1. Submit Work History</h4>
                        <p className="text-sm text-muted-foreground">
                          Add your work experience and company information to your profile
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">2. Request Verification</h4>
                        <p className="text-sm text-muted-foreground">
                          Submit verification request with supporting documentation to Verification@basker.bio
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">3. Admin Review</h4>
                        <p className="text-sm text-muted-foreground">
                          Our admin team reviews your submission and verifies your employment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Verification Status Types</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">Unverified</span>
                        <Badge variant="outline">Default</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        User claims to work at a company but hasn't submitted verification
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Pending</span>
                        <Badge variant="secondary">In Review</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Verification request submitted and under admin review
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Verified</span>
                        <Badge variant="default" className="bg-green-500">Verified</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Employment verified by admin team with supporting documentation
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Rejected</span>
                        <Badge variant="destructive">Rejected</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Verification request rejected due to insufficient documentation
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Required Documentation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Employment contract or offer letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Pay stubs or salary statements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Company email verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">LinkedIn profile or company directory listing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Manager or HR contact verification</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Tab */}
          <TabsContent value="legal" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how we collect, use, and protect your personal information.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/privacy">
                      <FileText className="w-4 h-4 mr-2" />
                      Read Privacy Policy
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Terms of Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understand the terms and conditions for using Basker.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/terms">
                      <FileText className="w-4 h-4 mr-2" />
                      Read Terms of Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    End User License Agreement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review the software license agreement for Basker.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/eula">
                      <FileText className="w-4 h-4 mr-2" />
                      Read EULA
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Verification Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed guidelines for our verification process and requirements.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/verification-policy">
                      <FileText className="w-4 h-4 mr-2" />
                      Read Verification Policy
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Choose Your Plan</CardTitle>
                <p className="text-center text-muted-foreground">
                  All plans include unlimited links, widgets, and verification features
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Free Plan */}
                  <Card className="relative">
                    <CardHeader>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">Free</h3>
                        <div className="text-3xl font-bold mt-2">$0</div>
                        <p className="text-sm text-muted-foreground">Forever</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Unlimited links</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Basic widgets</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Work history tracking</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Verification requests</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Custom themes</span>
                        </li>
                      </ul>
                      <Button className="w-full mt-6" variant="outline">
                        Current Plan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="relative border-primary">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                    <CardHeader>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">Pro</h3>
                        <div className="text-3xl font-bold mt-2">$9</div>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Everything in Free</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">Priority verification</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Advanced analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Premium widgets</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Custom domain</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Priority support</span>
                        </li>
                      </ul>
                      <Button className="w-full mt-6">
                        Upgrade to Pro
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Enterprise Plan */}
                  <Card className="relative">
                    <CardHeader>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">Enterprise</h3>
                        <div className="text-3xl font-bold mt-2">Custom</div>
                        <p className="text-sm text-muted-foreground">Contact us</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Everything in Pro</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">White-label solution</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Custom verification</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Dedicated support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">API access</span>
                        </li>
                      </ul>
                      <Button className="w-full mt-6" variant="outline">
                        Contact Sales
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get help with your account, verification, or technical issues.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      support@basker.bio
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Verification@basker.bio
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Help Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find answers to common questions and troubleshooting guides.
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Help Center
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our community for tips, updates, and discussions.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Status Page
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check the current status of Basker services and any ongoing issues.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    View Status
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
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
    </div>
  );
}
