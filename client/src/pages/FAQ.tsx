import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FAQ() {
  const { isAuthenticated } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      question: "What is Basker?",
      answer: "Basker is a decentralized link-in-bio platform built on the AT Protocol. It allows you to create beautiful, customizable profile pages with unlimited links, stories, notes, and widgets. Unlike centralized platforms, your data belongs to you and works across the entire decentralized network.",
      category: "General"
    },
    {
      question: "How is Basker different from other link-in-bio services?",
      answer: "Unlike centralized platforms like Linktree or Bio.link, Basker is built on the AT Protocol, meaning your data belongs to you and works across the entire decentralized network. There's no platform lock-in, no data harvesting, and your profile is truly portable.",
      category: "General"
    },
    {
      question: "Do I need a Bluesky account to use Basker?",
      answer: "Yes, Basker uses Bluesky authentication for security and decentralization. You'll need a Bluesky account to sign in and create your profile. If you don't have one, you can create a free account at bsky.app.",
      category: "Getting Started"
    },
    {
      question: "Is Basker free to use?",
      answer: "Yes! Basker is currently free to use for all features. We're working on premium features that will be available soon for supporters, but the core functionality will always remain free.",
      category: "Pricing"
    },
    {
      question: "Can I customize my profile?",
      answer: "Absolutely! You can customize your profile with different themes, add unlimited links, create stories, add notes, and include various widgets. Everything is drag-and-drop for easy editing, and you have complete control over the appearance and content.",
      category: "Customization"
    },
    {
      question: "Is my data secure?",
      answer: "Yes! Since Basker is built on the AT Protocol, your data is decentralized and secure. You own your data, and it's not stored on our servers in a traditional sense. The AT Protocol ensures your data is encrypted and distributed across the network.",
      category: "Security"
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Since your data is stored on the AT Protocol, you have complete control over it. You can export your profile data at any time, and it will work with other AT Protocol applications.",
      category: "Data"
    },
    {
      question: "What happens if Basker shuts down?",
      answer: "Your data is safe! Since Basker is built on the AT Protocol, your profile data is stored on the decentralized network, not on our servers. Even if Basker were to shut down, your data would remain accessible through other AT Protocol applications.",
      category: "Data"
    },
    {
      question: "How do I share my profile?",
      answer: "Your profile is accessible at a clean URL that you can share anywhere. Simply copy the URL and share it on social media, in your email signature, or anywhere else you want people to find your links.",
      category: "Sharing"
    },
    {
      question: "Can I add custom domains?",
      answer: "Custom domain support is coming soon! This will be available as part of our premium features, allowing you to use your own domain name for your Basker profile.",
      category: "Customization"
    },
    {
      question: "Is there a mobile app?",
      answer: "Basker is a web application that works great on mobile devices. We're considering a mobile app in the future, but for now, you can access all features through your mobile browser.",
      category: "Mobile"
    },
    {
      question: "How do I get support?",
      answer: "You can get support by joining our Discord community, following us on Bluesky, or checking our FAQ. For premium users, we'll offer priority support channels.",
      category: "Support"
    }
  ];

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqData.map(faq => faq.category))];

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
            {/* Animated FAQ Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full mb-6 animate-pulse">
              <HelpCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">FAQ</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Frequently Asked <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find answers to common questions about Basker
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setSearchTerm('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchTerm === '' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchTerm(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchTerm === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="border border-border/50 rounded-lg">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-foreground">{faq.question}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try searching with different keywords or browse all questions.
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Show All Questions
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Still have questions?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="h-12 px-8">
                <HelpCircle className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                <Search className="w-4 h-4 mr-2" />
                Contact Support
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
