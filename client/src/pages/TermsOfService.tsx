import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale } from 'lucide-react';
import { Link } from 'wouter';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/info">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Info Center
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Scale className="w-8 h-8" />
                Terms of Service
              </h1>
              <p className="text-muted-foreground">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="prose prose-sm max-w-none p-8 prose-invert">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Basker ("the Service"), you accept and agree to be bound by the 
              terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Basker is a link-in-bio platform that allows users to create personalized profile pages 
              with links, widgets, work history, and verification features. The service integrates 
              with Bluesky and other third-party platforms.
            </p>

            <h2>3. User Accounts</h2>
            <p>To use our service, you must:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Spam or send unsolicited communications</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with the service's operation</li>
            </ul>

            <h2>5. Content and Intellectual Property</h2>
            <p>
              You retain ownership of content you create and share through our service. By using our 
              service, you grant us a license to host, display, and distribute your content as 
              necessary to provide the service.
            </p>

            <h2>6. Verification System</h2>
            <p>
              Our verification system allows users to verify their work history and employment. 
              Verification is subject to our review and approval. We reserve the right to reject 
              verification requests that don't meet our standards.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how 
              we collect, use, and protect your information.
            </p>

            <h2>8. Service Availability</h2>
            <p>
              We strive to maintain high service availability but cannot guarantee uninterrupted 
              access. We may temporarily suspend service for maintenance, updates, or other reasons.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Basker shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Basker from any claims, damages, or expenses 
              arising from your use of the service or violation of these terms.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violation of these terms or 
              for any other reason at our discretion. You may also terminate your account at any time.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through the service.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@basker.bio</li>
              <li>Support: support@basker.bio</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
