import React from 'react';
import { Header } from '../components/Header';

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
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Upon receipt of a valid DMCA takedown notice, we will:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Review the notice for completeness and validity</li>
              <li>Remove or disable access to the allegedly infringing content</li>
              <li>Notify the user who posted the content about the takedown</li>
              <li>Provide the user with information about the DMCA process</li>
              <li>Maintain records of the takedown as required by law</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Counter-Notification Process</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you believe your content was removed in error, you may submit a counter-notification. To be effective, your counter-notification must include:
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
            <p className="text-gray-600 dark:text-gray-300 mb-4">Send your counter-notification to:</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>DMCA Agent:</strong><br />
                Email: dmca@basker.bio<br />
                Subject: DMCA Counter-Notification
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Repeat Infringer Policy</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              In accordance with the DMCA, we maintain a policy of terminating accounts of users who are repeat infringers. A user is considered a repeat infringer if they have been the subject of multiple valid DMCA takedown notices.
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
