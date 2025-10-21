import React from 'react';
import { Header } from '../components/Header';

export default function DataProcessingAgreement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Data Processing Agreement</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This Data Processing Agreement (DPA) describes how Basker processes personal data in compliance with applicable data protection laws, including the General Data Protection Regulation (GDPR) and other relevant privacy regulations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Controller and Processor</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Basker acts as a data processor when processing personal data on behalf of users who create profiles. Users are the data controllers of their own personal data and content. <strong>Important:</strong> User accounts and authentication are handled entirely by third-party AT Protocol services (including Bluesky). Basker provides a login option to access our platform, but all account management, user authentication, and core user data are managed by the AT Protocol and fall under their respective terms of service and privacy policies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Types of Personal Data We Process</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Account information (Bluesky handle, display name, avatar)</li>
              <li>Profile content (links, stories, notes, customizations)</li>
              <li>Usage data (how you interact with the platform)</li>
              <li>Technical data (IP address, browser type, device information)</li>
              <li>Communication data (support inquiries, feedback)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Legal Basis for Processing</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">We process personal data based on:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Consent:</strong> When you create an account and use our services</li>
              <li><strong>Contract Performance:</strong> To provide the link-in-bio service you requested</li>
              <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Purpose of Processing</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">We process personal data to:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li>Provide and maintain our link-in-bio platform</li>
              <li>Enable profile creation and customization</li>
              <li>Ensure platform security and prevent abuse</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Provide customer support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Retention</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We retain personal data only for as long as necessary to fulfill the purposes outlined in this agreement, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete your personal data within 30 days, unless we are required to retain it for legal reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Security</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We implement appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls, regular security assessments, and staff training.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Subject Rights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Under applicable data protection laws, you have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Transfers</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              As a decentralized platform built on the AT Protocol, your data may be stored and processed across multiple nodes in the network. We ensure that any international transfers comply with applicable data protection laws and implement appropriate safeguards.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AT Protocol Integration and Data Handling</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Basker is built on the AT Protocol, a decentralized social networking protocol. This integration affects how we handle your data:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Account Management:</strong> Your user account, authentication, and core identity data are managed entirely by AT Protocol services (such as Bluesky), not by Basker</li>
              <li><strong>Data Storage:</strong> Your profile content and customizations are stored on our platform, but your account credentials and authentication are handled by the AT Protocol</li>
              <li><strong>Third-Party Terms:</strong> Your use of AT Protocol services is subject to their terms of service and privacy policies, which are separate from this agreement</li>
              <li><strong>Data Portability:</strong> Due to the decentralized nature of the AT Protocol, you may have additional data portability options through the protocol itself</li>
              <li><strong>Account Deletion:</strong> While you can delete your Basker profile data, account deletion must be handled through the AT Protocol service you use (e.g., Bluesky)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Third-Party Processors</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may use third-party service providers to help us operate our platform. These processors are bound by contractual obligations to protect your data and only process it as instructed by us. Additionally, AT Protocol services (including Bluesky) act as independent data controllers for your account and authentication data.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Breach Notification</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              In the event of a data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and inform affected users without undue delay.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For any questions about this Data Processing Agreement or to exercise your data protection rights, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                Email: privacy@basker.bio<br />
                Data Protection Officer: dpo@basker.bio
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Changes to This Agreement</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may update this Data Processing Agreement from time to time. We will notify you of any material changes and obtain your consent where required by law.
            </p>
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
