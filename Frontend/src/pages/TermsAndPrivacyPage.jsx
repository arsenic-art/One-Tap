import { X, Shield, FileText, Eye, Lock, Users, AlertTriangle } from 'lucide-react';
 export const TermsOfService = ({setShowPrivacy, setShowTerms, showPrivacy, showTerms, setTermsAccepted}) => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showTerms ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowTerms(false)}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
        showTerms ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <h2 className="text-xl font-bold">Terms of Service</h2>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 text-sm">
              Last updated: August 14, 2025
            </p>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-red-600" />
                  1. Acceptance of Terms
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using OneTap's mechanic services platform, you accept and agree to be bound by the terms and provision of this agreement. OneTap provides on-demand automotive repair and maintenance services through our network of verified mechanics.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-600" />
                  2. Service Description
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  OneTap connects customers with qualified mechanics for various automotive services including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Emergency roadside assistance</li>
                  <li>Routine maintenance and repairs</li>
                  <li>Vehicle diagnostics and inspections</li>
                  <li>Parts replacement and installation</li>
                  <li>Mobile mechanic services</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  3. User Responsibilities
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Customers must:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Provide accurate vehicle and contact information</li>
                    <li>Be present during service appointments</li>
                    <li>Pay for services as agreed upon</li>
                    <li>Treat mechanics with respect and professionalism</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Mechanics must:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Maintain valid licenses and certifications</li>
                    <li>Provide quality workmanship and parts</li>
                    <li>Arrive punctually for appointments</li>
                    <li>Follow safety protocols and best practices</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  4. Limitations and Liability
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  OneTap acts as a platform connecting customers with independent mechanics. We are not responsible for the quality of work performed by mechanics, though we maintain quality standards through our verification process. All services are subject to individual mechanic warranties and guarantees.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Payment Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  Payment for services is processed through our secure platform. Customers agree to pay all charges incurred for services requested. Refunds are handled on a case-by-case basis according to our refund policy.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Privacy and Data Protection</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information when using our services.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Modification of Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  OneTap reserves the right to modify these terms at any time. Users will be notified of significant changes via email or app notification. Continued use of the service constitutes acceptance of modified terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Contact Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms of Service, please contact us at:
                  <br />Email: legal@onetap.com
                  <br />Phone: +91 123-456-7890
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowTerms(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {setShowTerms(false); setTermsAccepted(true);}}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );

export const PrivacyPolicy = ({setShowPrivacy, setShowTerms, showPrivacy, showTerms, setPrivacyAccepted}) => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showPrivacy ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowPrivacy(false)}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
        showPrivacy ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <h2 className="text-xl font-bold">Privacy Policy</h2>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 text-sm">
              Last updated: August 14, 2025
            </p>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  1. Information We Collect
                </h3>
                <div className="text-gray-700 space-y-3">
                  <p><strong>Personal Information:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Name, email address, and phone number</li>
                    <li>Vehicle information (make, model, year, VIN)</li>
                    <li>Location data for service requests</li>
                    <li>Payment information (processed securely)</li>
                  </ul>
                  
                  <p><strong>Usage Information:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>App usage patterns and preferences</li>
                    <li>Service history and ratings</li>
                    <li>Communication with mechanics and support</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  2. How We Use Your Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Connect you with qualified mechanics in your area</li>
                  <li>Process payments and manage your account</li>
                  <li>Send service updates and notifications</li>
                  <li>Improve our services and user experience</li>
                  <li>Ensure safety and prevent fraud</li>
                  <li>Provide customer support</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  3. Information Sharing
                </h3>
                <div className="text-gray-700 space-y-3">
                  <p><strong>With Mechanics:</strong> We share necessary information (contact details, vehicle info, service location) to facilitate service delivery.</p>
                  
                  <p><strong>With Service Providers:</strong> We work with trusted partners for payment processing, SMS/email services, and analytics.</p>
                  
                  <p><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety.</p>
                  
                  <p className="font-semibold text-gray-900">We never sell your personal information to third parties.</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Location Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect location data to match you with nearby mechanics and provide accurate service delivery. Location sharing can be controlled through your device settings and is only used when necessary for service provision.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Data Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information. Payment data is processed through PCI-compliant payment processors.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights and Choices</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Control location sharing permissions</li>
                  <li>Request data portability</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Data Retention</h3>
                <p className="text-gray-700 leading-relaxed">
                  We retain your information for as long as necessary to provide services, comply with legal obligations, and resolve disputes. Account deletion requests are processed within 30 days.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Children's Privacy</h3>
                <p className="text-gray-700 leading-relaxed">
                  OneTap is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Contact Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  For privacy-related questions or to exercise your rights, contact us at:
                  <br />Email: privacy@onetap.com
                  <br />Phone: +91 123-456-7890
                  <br />Mail: OneTap Privacy Team, 123 Tech Street, San Francisco, CA 94102
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowPrivacy(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={() => { setShowPrivacy(false); setPrivacyAccepted(true); }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );