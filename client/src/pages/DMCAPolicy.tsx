import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function DMCAPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">DMCA Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Digital Millennium Copyright Act (DMCA) Compliance</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Basker respects the intellectual property rights of others and expects our users to do the same. This DMCA Policy outlines our procedures for handling copyright infringement claims in accordance with the Digital Millennium Copyright Act.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Reporting Copyright Infringement</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you believe that your copyrighted work has been used on Basker without permission, you may submit a DMCA takedown notice. To be effective, your notice must include the following information:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Required Information for DMCA Notice</h3>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Identification of the copyrighted work:</strong> A description of the work you claim has been infringed</li>
              <li><strong>Location of the infringing material:</strong> The specific URL or location where the infringing content appears on Basker</li>
              <li><strong>Your contact information:</strong> Your name, address, telephone number, and email address</li>
              <li><strong>Good faith statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law</li>
              <li><strong>Accuracy statement:</strong> A statement that the information in your notice is accurate and that you are authorized to act on behalf of the copyright owner</li>
              <li><strong>Electronic signature:</strong> Your physical or electronic signature</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Submit a DMCA Notice</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Send your DMCA takedown notice to:</p>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>DMCA Agent:</strong><br />
                Email: dmca@basker.bio<br />
                Subject: DMCA Takedown Notice
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Response to DMCA Notices</h2>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Important: Limited Control Over Content</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>AT Protocol Integration:</strong> Basker is built on the AT Protocol, and we do not have direct control over user accounts or the ability to modify user content. All user content and accounts are managed by third-party AT Protocol services (such as Bluesky).
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>What we can do:</strong> We can review DMCA notices and forward them to the appropriate AT Protocol service provider, but we cannot directly remove content or disable user accounts.
              </p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Upon receipt of a valid DMCA takedown notice, we will:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Review the notice for completeness and validity</li>
              <li>Forward the notice to the appropriate AT Protocol service provider (e.g., Bluesky)</li>
              <li>Provide you with contact information for direct submission to the AT Protocol service</li>
              <li>Maintain records of the notice as required by law</li>
              <li>Assist with the process where technically possible</li>
            </ol>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recommended Action</h3>
              <p className="text-gray-600 dark:text-gray-300">
                For the most effective resolution, we recommend submitting DMCA notices directly to the AT Protocol service provider (such as Bluesky) that hosts the user's account. This ensures the fastest response and most comprehensive enforcement.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Counter-Notification Process</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you believe your content was removed in error by an AT Protocol service provider, you may submit a counter-notification directly to that service. Since Basker does not control content removal, counter-notifications should be submitted to the AT Protocol service provider (e.g., Bluesky) that removed the content.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To be effective, your counter-notification must include:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Required Information for Counter-Notification</h3>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Identification of the removed content:</strong> Description of the content that was removed and its location before removal</li>
              <li><strong>Good faith statement:</strong> A statement under penalty of perjury that you have a good faith belief the content was removed as a result of mistake or misidentification</li>
              <li><strong>Consent to jurisdiction:</strong> Your consent to the jurisdiction of the federal court in your district</li>
              <li><strong>Contact information:</strong> Your name, address, and telephone number</li>
              <li><strong>Electronic signature:</strong> Your physical or electronic signature</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Submit a Counter-Notification</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Since Basker does not control content removal, submit your counter-notification directly to the AT Protocol service provider that removed the content (e.g., Bluesky). You can also send a copy to us for our records:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>For AT Protocol Services (Primary):</strong><br />
                Contact the service provider directly (e.g., Bluesky support)<br /><br />
                <strong>Copy to Basker (For Records):</strong><br />
                Email: dmca@basker.bio<br />
                Subject: DMCA Counter-Notification Copy
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Repeat Infringer Policy</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Due to our integration with the AT Protocol, we cannot directly terminate user accounts. However, we will forward all valid DMCA takedown notices to the appropriate AT Protocol service provider, which may maintain their own repeat infringer policies. We recommend that rights holders also submit notices directly to AT Protocol services for comprehensive enforcement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">False Claims</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please be aware that making false claims of copyright infringement may result in legal consequences. The DMCA provides for damages and attorney's fees for those who knowingly misrepresent that material is infringing.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Designated Agent Information</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>DMCA Designated Agent:</strong><br />
                Basker Legal Department<br />
                Email: dmca@basker.bio<br />
                Response Time: Within 24-48 hours for valid notices
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Alternative Submission Methods</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Due to our integration with the AT Protocol, you have several options for addressing copyright infringement:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Submit to Basker:</strong> Send DMCA notices to dmca@basker.bio for content removal from our platform</li>
              <li><strong>Submit to AT Protocol Service:</strong> Contact the user's AT Protocol service provider (e.g., Bluesky) directly for account-level enforcement</li>
              <li><strong>Direct User Contact:</strong> Reach out to the user directly through their AT Protocol profile to resolve the matter amicably</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We recommend submitting to both Basker and the relevant AT Protocol service for comprehensive enforcement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Alternative Dispute Resolution</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Before filing a DMCA notice, we encourage you to contact the user directly to resolve the matter amicably. Many copyright disputes can be resolved through direct communication.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">International Copyright</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              While this policy is based on U.S. law, we respect international copyright laws and will work with rights holders from other countries to address copyright concerns.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Policy Updates</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may update this DMCA Policy from time to time. We will notify users of significant changes and post the updated policy on our website. Continued use of Basker after changes constitutes acceptance of the new policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For questions about this DMCA Policy or copyright-related matters, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                DMCA Agent: dmca@basker.bio<br />
                General Legal: legal@basker.bio<br />
                Support: support@basker.bio
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
