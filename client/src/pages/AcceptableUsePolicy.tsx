import React from 'react';
import { Header } from '../components/Header';

export default function AcceptableUsePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Acceptable Use Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This Acceptable Use Policy (AUP) outlines the rules and guidelines for using Basker, our decentralized link-in-bio platform. By using our service, you agree to comply with this policy and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Prohibited Uses</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">You may not use Basker for any of the following purposes:</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Illegal Activities</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Any activity that violates local, state, national, or international law</li>
              <li>Fraud, money laundering, or other financial crimes</li>
              <li>Human trafficking or exploitation</li>
              <li>Drug trafficking or illegal substance sales</li>
              <li>Weapons sales or illegal arms trading</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Harmful Content</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Content that promotes violence, hatred, or discrimination</li>
              <li>Harassment, bullying, or intimidation of others</li>
              <li>Threats of violence or harm</li>
              <li>Content that glorifies or promotes self-harm</li>
              <li>Graphic violence or disturbing imagery</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Inappropriate Content</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Sexually explicit content involving minors</li>
              <li>Non-consensual intimate content</li>
              <li>Excessive sexual or adult content</li>
              <li>Content that exploits or objectifies individuals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Spam and Abuse</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Spam, phishing, or fraudulent activities</li>
              <li>Creating multiple accounts to circumvent restrictions</li>
              <li>Automated scraping or data harvesting</li>
              <li>Distributing malware or malicious software</li>
              <li>Impersonating others or organizations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property Violations</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Copyright infringement or unauthorized use of copyrighted material</li>
              <li>Trademark violations</li>
              <li>Trade secret theft</li>
              <li>Counterfeit goods or services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Content Guidelines</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">When creating content on Basker, please ensure it is:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Accurate and truthful</li>
              <li>Respectful of others</li>
              <li>Appropriate for all audiences</li>
              <li>Legally compliant</li>
              <li>Your own original content or properly licensed</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Reporting Violations</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you encounter content or behavior that violates this policy, please report it immediately. We take all reports seriously and will investigate promptly.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Report violations to:</strong> moderation@basker.bio<br />
                Include the profile URL and description of the violation.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Enforcement Actions</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Violations of this policy may result in:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Content removal</li>
              <li>Account warnings</li>
              <li>Temporary account suspension</li>
              <li>Permanent account termination</li>
              <li>Legal action where appropriate</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Appeals Process</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you believe your account was suspended or content was removed in error, you may appeal the decision by contacting our moderation team with a detailed explanation of why you believe the action was incorrect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Age Requirements</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Basker is intended for users who are at least 13 years old. Users under 18 should have parental consent before using our platform. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">International Users</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This policy applies to all users regardless of location. You are responsible for ensuring your use of Basker complies with all applicable local laws and regulations in your jurisdiction.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Policy Updates</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may update this Acceptable Use Policy from time to time. We will notify users of significant changes and post the updated policy on our website. Continued use of Basker after changes constitutes acceptance of the new policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For questions about this Acceptable Use Policy or to report violations, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                Email: moderation@basker.bio<br />
                Support: support@basker.bio
              </p>
            </div>
          </div>
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
              <span className="text-muted-foreground">×</span>
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm text-blue-500 font-bold">Bluesky</span>
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
