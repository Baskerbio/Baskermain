import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Coffee, Heart, CreditCard, Gift, Star, Users, Code, MessageCircle } from 'lucide-react';

export default function Support() {
  const { isAuthenticated } = useAuth();

  const donationMethods = [
    {
      title: "Buy us a coffee",
      description: "Support development with a small donation",
      icon: Coffee,
      color: "from-orange-500 to-red-500",
      amount: "$3-5"
    },
    {
      title: "Monthly supporter",
      description: "Become a monthly supporter and get early access",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      amount: "$3.99/month"
    },
    {
      title: "One-time donation",
      description: "Make a one-time contribution to support Basker",
      icon: CreditCard,
      color: "from-blue-500 to-cyan-500",
      amount: "Any amount"
    }
  ];

  const supportMethods = [
    {
      title: "Join our Discord",
      description: "Get help from the community and developers",
      icon: MessageCircle,
      color: "from-indigo-500 to-purple-500",
      action: "Join Discord"
    },
    {
      title: "Follow on Bluesky",
      description: "Stay updated with the latest news and updates",
      icon: Users,
      color: "from-sky-500 to-blue-500",
      action: "Follow @basker"
    },
    {
      title: "Contribute on GitHub",
      description: "Help improve Basker with code, design, or feedback",
      icon: Code,
      color: "from-green-500 to-emerald-500",
      action: "View on GitHub"
    }
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
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/info#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/info" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Info Center
              </Link>
            </div>
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
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Support Basker
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Help us keep Basker free, open source, and accessible to everyone
            </p>
          </div>
        </section>

        {/* Why Support Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why support Basker?</h2>
              <p className="text-lg text-muted-foreground">
                Your support helps us build a better, more decentralized web
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Fund Development</h3>
                  <p className="text-muted-foreground text-sm">
                    Help us build new features, improve performance, and maintain the platform
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Keep It Free</h3>
                  <p className="text-muted-foreground text-sm">
                    Ensure Basker remains free and accessible to everyone, regardless of their financial situation
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Open Source</h3>
                  <p className="text-muted-foreground text-sm">
                    Support open source initiatives and help build a more transparent, decentralized internet
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Donation Methods */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ways to Support</h2>
              <p className="text-lg text-muted-foreground">
                Choose how you'd like to support Basker
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {donationMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{method.title}</h3>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    <div className="text-2xl font-bold text-primary mb-6">{method.amount}</div>
                    <Button className="w-full h-12" variant="outline">
                      <method.icon className="w-4 h-4 mr-2" />
                      {method.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Support */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Community Support</h2>
              <p className="text-lg text-muted-foreground">
                Get help, share feedback, and connect with other Basker users
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {supportMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{method.title}</h3>
                    <p className="text-muted-foreground mb-6">{method.description}</p>
                    <Button className="w-full h-12" variant="outline">
                      <method.icon className="w-4 h-4 mr-2" />
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Supporter Benefits */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Supporter Benefits</h2>
              <p className="text-lg text-muted-foreground">
                Get exclusive perks when you support Basker
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Monthly Supporters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Supporter badge on your profile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Early access to new features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Priority support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Advanced themes and customization</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4">All Supporters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Our eternal gratitude</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Help shape Basker's future</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Support open source development</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-foreground">Keep Basker free for everyone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to support Basker?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every contribution, no matter how small, helps us build a better decentralized web
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8">
                <Coffee className="w-4 h-4 mr-2" />
                Buy us a coffee
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
                <Heart className="w-4 h-4 mr-2" />
                Become a supporter
              </Button>
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
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">v2.1.0.0</span>
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
