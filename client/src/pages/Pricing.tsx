import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { ArrowLeft, Gift, Check, Star, Zap, Heart, Coffee, QrCode } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Free Forever
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Basker is completely free to use. No hidden fees, no premium tiers, no limits.
            </p>
          </div>
        </section>


        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">What's Included</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to create an amazing link-in-bio page
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold">{feature}</h3>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Support Our Mission
              </h3>
              <p className="text-muted-foreground mb-4">
                While Basker is free, donations help us keep the service running and improve it for everyone.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
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
          </div>
        </section>

        {/* Physical Card Section */}
        <section className="pt-8 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Physical Basker Card</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Take your digital presence offline with a physical card
            </p>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Scan & Connect</h3>
                  <p className="text-muted-foreground mb-6">
                    A sleek, physical card with QR code and NFC technology that instantly connects people to your Basker profile. 
                    Perfect for networking events, business meetings, or casual encounters.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">QR code scanning for instant access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">NFC tap technology for seamless connection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">Premium card design with your branding</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">Eco-friendly materials</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="w-64 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-primary/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Card Preview</p>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Might be coming soon 👀
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Ready to get started?</h2>
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
