import {
  X,
  Shield,
  FileText,
  Eye,
  Lock,
  Users,
  AlertTriangle,
} from "lucide-react";

export const TermsOfService = ({
  setShowTerms,
  showTerms,
  setTermsAccepted,
}) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showTerms ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowTerms(false)}
    />

    {/* Modal */}
    <div
      className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
        showTerms ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      }`}
    >
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
            Last updated: December 27, 2025
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-red-600" />
                Using OneTap
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By using OneTap, you agree to follow these basic rules. We
                connect vehicle owners with nearby mechanics — that's it, simple
                and straightforward.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                What We Do
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                OneTap helps you find mechanics for roadside help, repairs, and
                basic maintenance. We don't fix vehicles ourselves — we help you
                reach the right people faster.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our services include emergency roadside assistance, routine
                maintenance, vehicle diagnostics, parts replacement, and mobile
                mechanic services.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Your Responsibility
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>As a customer, you should:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Share correct vehicle and location details</li>
                  <li>Be present during service appointments</li>
                  <li>Pay agreed charges after service completion</li>
                  <li>Be respectful — mechanics are humans too</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Important Stuff
              </h3>
              <p className="text-gray-700 leading-relaxed">
                OneTap is a platform, not the mechanic. Service quality depends
                on the mechanic you choose. All mechanics go through
                verification, but we're not responsible for their work quality.
                Misuse, fraud, or bad behavior can get your account blocked
                permanently.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Changes to Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We can update these terms anytime. We'll notify you via email or
                app notification about major changes. Continued use means you
                accept the updated terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Us
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Questions about these terms? Reach out to us:
                <br />
                Email: onetapservicemail@gmail.com
                <br />
                Phone: +91 xxxxx xxxxx
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
            onClick={() => {
              setShowTerms(false);
              setTermsAccepted(true);
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            I Agree 👍
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = ({
  setShowPrivacy,
  showPrivacy,
  setPrivacyAccepted,
}) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showPrivacy ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowPrivacy(false)}
    />

    {/* Modal */}
    <div
      className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
        showPrivacy ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      }`}
    >
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
            Short version: We respect your privacy and protect your data.
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                What We Collect
              </h3>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Basic Information:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Name, phone number, and email address</li>
                  <li>Vehicle details (make, model, year)</li>
                  <li>Location when you request service</li>
                </ul>

                <p>
                  <strong>Usage Data:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Service history and ratings you give</li>
                  <li>App usage patterns and preferences</li>
                  <li>Messages with mechanics and support</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                How We Use It
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Connect you with mechanics near you</li>
                <li>Send service updates and notifications</li>
                <li>Improve the app and fix issues</li>
                <li>Keep things safe and prevent fraud</li>
                <li>Provide customer support when you need help</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Who Sees Your Data
              </h3>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Mechanics:</strong> Only mechanics involved in your
                  request see necessary details (contact info, vehicle,
                  location) to help you.
                </p>

                <p className="font-semibold text-gray-900">
                  We might sell your personal information, Buyer please contact.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Location Data
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We use your location to find nearby mechanics and deliver
                accurate service. You can control location sharing in your
                device settings — we only use it when needed for service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Your Control
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Edit or delete your account anytime</li>
                <li>Control location access permissions</li>
                <li>Opt out of notifications and marketing emails</li>
                <li>Request a copy of your data</li>
                <li>Ask us to delete your information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Data Retention
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We keep your data as long as you use OneTap. If you delete your
                account, we remove your info within 30 days (except what we need
                to keep for legal reasons).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Us
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Privacy questions? Want to access or delete your data? Contact
                us:
                <br />
                Email: onetapservicemail@gmail.com
                <br />
                Phone: +91 xxxxx xxxxx
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
            onClick={() => {
              setShowPrivacy(false);
              setPrivacyAccepted(true);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Got it 👍
          </button>
        </div>
      </div>
    </div>
  </div>
);
