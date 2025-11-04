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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <Header />
      
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/60 to-purple-400/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 5}s`
            }}
          ></div>
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '25px 25px',
            animation: 'gridMove 30s linear infinite'
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
            {/* Modern FAQ Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">FAQ</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find answers to common questions about Basker
            </p>
            
            {/* Enhanced Search */}
            <div className="max-w-md mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 group-hover:text-purple-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-blue-200 dark:border-blue-800 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-600 focus:border-purple-500 dark:focus:border-purple-400 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Modern Categories */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <button
                onClick={() => setSearchTerm('')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  searchTerm === '' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchTerm(category)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    searchTerm === category 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Modern FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <button
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors rounded-2xl group"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{faq.question}</span>
                        <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0 group-hover:text-purple-500 transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try searching with different keywords or browse all questions.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105"
                >
                  Show All Questions
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="h-12 px-8 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105">
                <HelpCircle className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105">
                <Search className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-5 h-5 rounded-full"
              />
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Basker</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">© 2025</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">v2.1.0.0</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Built on the AT Protocol • Your data, your control
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Create your own link-in-bio page with basker
              </p>
            </div>
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
            transform: translate(25px, 25px);
          }
        }
        
        @keyframes accordionSlide {
          from {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            max-height: 200px;
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
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
        
        .animate-accordion {
          animation: accordionSlide 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
