import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CreditCard, Gift, Check, Star, Zap, Heart, Coffee } from 'lucide-react';

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

  const premiumFeatures = [
    "Everything in Free",
    "Advanced themes and customization",
    "Analytics and insights",
    "Priority support",
    "Early access to new features",
    "Supporter badge on your profile",
    "Custom domains (coming soon)",
    "Advanced widgets (coming soon)"
  ];

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
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the plan that works for you. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <Card className="border-border/50">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
                    <div className="text-4xl font-bold text-foreground mb-2">$0</div>
                    <p className="text-muted-foreground">Forever free</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isAuthenticated ? (
                    <Link href="/profile">
                      <Button className="w-full h-12">
                        <Zap className="w-4 h-4 mr-2" />
                        Go to My Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button className="w-full h-12">
                        <Zap className="w-4 h-4 mr-2" />
                        Get Started Free
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

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
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
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
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Feature Comparison</h2>
              <p className="text-lg text-muted-foreground">
                See what's included in each plan
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Free</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">Unlimited links</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">Basic themes</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">Stories & notes</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">Public profiles</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">AT Protocol</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Supporter</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">Everything in Free</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">Advanced themes</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">Analytics</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">Priority support</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">Supporter badge</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Coming Soon</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Custom domains</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Advanced widgets</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Team features</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">API access</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">White-label</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Support Basker Development</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Help us keep Basker free and open source
            </p>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Buy us a coffee</h3>
                  <p className="text-sm text-muted-foreground">Support development with a small donation</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Spread the word</h3>
                  <p className="text-sm text-muted-foreground">Share Basker with your friends and followers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Contribute</h3>
                  <p className="text-sm text-muted-foreground">Help improve Basker with code, design, or feedback</p>
                </div>
              </div>
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
                    <Zap className="w-4 h-4 mr-2" />
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
              <Link href="/support">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                  <Coffee className="w-4 h-4 mr-2" />
                  Support Basker
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
