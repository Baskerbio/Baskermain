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
              Basker is a decentralized link-in-bio platform built on the AT Protocol that allows users to create personalized profile pages. Our service provides:
            </p>
            <ul>
              <li><strong>Profile Customization:</strong> Custom themes, layouts, and branding options</li>
              <li><strong>Link Management:</strong> Organize and display multiple links with custom titles and descriptions</li>
              <li><strong>Widgets:</strong> Work history, social media integration, contact forms, and other interactive elements</li>
              <li><strong>Stories & Notes:</strong> Share updates, announcements, and personal content</li>
              <li><strong>Verification:</strong> Display verified credentials and professional achievements</li>
              <li><strong>Analytics:</strong> Track profile views and link clicks (where available)</li>
              <li><strong>AT Protocol Integration:</strong> Seamless login and data portability through Bluesky and other AT Protocol services</li>
            </ul>
            <p>
              <strong>Important:</strong> User accounts and authentication are managed by third-party AT Protocol services (such as Bluesky). Basker provides the platform interface but does not control user accounts or core identity data.
            </p>

            <h2>3. User Accounts and AT Protocol Integration</h2>
            <p>To use Basker, you must:</p>
            <ul>
              <li>Have a valid AT Protocol account (such as a Bluesky account)</li>
              <li>Provide accurate and complete information when creating your Basker profile</li>
              <li>Maintain the security of both your AT Protocol account and Basker profile</li>
              <li>Be responsible for all activities under your Basker profile</li>
              <li>Comply with the terms of service of your AT Protocol service provider</li>
              <li>Notify us immediately of any unauthorized use of your Basker profile</li>
            </ul>
            <p>
              <strong>Account Management:</strong> Your user account, authentication, and core identity are managed by your chosen AT Protocol service provider (e.g., Bluesky). Basker cannot reset passwords, modify account settings, or delete AT Protocol accounts. All account-related issues must be resolved through your AT Protocol service provider.
            </p>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use Basker to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Share malicious links or harmful content</li>
              <li>Create fake profiles or impersonate others</li>
              <li>Spam or send unsolicited communications through our platform</li>
              <li>Share content that is illegal, harmful, threatening, abusive, or discriminatory</li>
              <li>Attempt to hack, disrupt, or interfere with our platform or AT Protocol services</li>
              <li>Use automated tools to scrape or harvest user data</li>
              <li>Share false or misleading information in your work history or verification claims</li>
              <li>Circumvent any security measures or access controls</li>
            </ul>
            <p>
              <strong>Content Guidelines:</strong> All content you share on your Basker profile, including links, stories, notes, and work history, must comply with these terms and applicable laws. We reserve the right to remove content that violates these guidelines.
            </p>

            <h2>5. Content and Intellectual Property</h2>
            <p>
              You retain ownership of all content you create and share through Basker, including:
            </p>
            <ul>
              <li>Profile customization (themes, layouts, colors)</li>
              <li>Links and link descriptions</li>
              <li>Stories, notes, and personal updates</li>
              <li>Work history and professional information</li>
              <li>Widget content and customizations</li>
              <li>Profile images and banners</li>
            </ul>
            <p>
              By using Basker, you grant us a limited, non-exclusive license to host, display, and distribute your content as necessary to provide our link-in-bio service. This license terminates when you delete your Basker profile or remove specific content.
            </p>
            <p>
              <strong>AT Protocol Content:</strong> Content you share through AT Protocol services (like Bluesky) remains subject to their terms of service and intellectual property policies, which are separate from this agreement.
            </p>

            <h2>6. Work History and Professional Information</h2>
            <p>
              Basker allows you to add work history, employment information, skills, and professional achievements to your profile. This feature is designed to help you showcase your professional background and credentials.
            </p>
            <p>
              <strong>Accuracy Requirements:</strong> All work history and professional information must be accurate and truthful. You are responsible for:
            </p>
            <ul>
              <li>Providing correct employment dates, job titles, and company names</li>
              <li>Ensuring skills and qualifications are accurately represented</li>
              <li>Updating information when your employment status changes</li>
              <li>Not claiming false credentials or achievements</li>
            </ul>
            <p>
              <strong>Verification:</strong> While we provide tools to display verified credentials, we do not independently verify work history or professional claims. Users should verify information before making professional decisions based on profile content.
            </p>
            <p>
              We reserve the right to remove or modify content that violates our terms or appears to contain false information.
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

            <h2>11. AT Protocol Integration Terms</h2>
            <p>
              Basker's integration with the AT Protocol creates additional considerations:
            </p>
            <ul>
              <li><strong>Service Dependencies:</strong> Basker's functionality depends on AT Protocol services. Service interruptions or changes to AT Protocol may affect Basker's availability</li>
              <li><strong>Data Portability:</strong> Your profile data may be exportable through AT Protocol tools, providing additional data portability options</li>
              <li><strong>Third-Party Terms:</strong> Your use of AT Protocol services (like Bluesky) is subject to their terms of service, which may differ from these terms</li>
              <li><strong>Account Linking:</strong> Your Basker profile is linked to your AT Protocol identity. Changes to your AT Protocol account may affect your Basker profile</li>
            </ul>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your Basker profile at any time for violation of these terms or for any other reason at our discretion. You may also delete your Basker profile at any time.
            </p>
            <p>
              <strong>Important:</strong> Terminating your Basker profile does not affect your AT Protocol account. To fully delete your account, you must do so through your AT Protocol service provider (e.g., Bluesky).
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through the service.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h2>15. Contact Information</h2>
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
