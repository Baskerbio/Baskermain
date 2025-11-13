import React from 'react';
import { Header } from '../components/Header';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '../components/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Basker uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Essential functionality (authentication, security)</li>
              <li>Remembering your preferences and settings</li>
              <li>Understanding how you use our platform</li>
              <li>Improving our services and user experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Essential Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Functional Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Analytics Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Managing Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Browser Settings</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Most browsers allow you to refuse cookies or delete them. You can usually find these settings in the options or preferences menu of your browser.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Some cookies on our site are set by third-party services. We use these services to enhance functionality and analyze usage. These third parties have their own privacy policies and cookie practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions about our use of cookies, please contact us at support@basker.bio
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
