import { X, FileText, Wrench, Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const MechanicApplicationTerms = ({ showMechanicTerms, setShowMechanicTerms }) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showMechanicTerms ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowMechanicTerms(false)}
    />

    {/* Modal */}
    <div
      className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
        showMechanicTerms ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold">Mechanic Application – Terms & Conditions</h2>
          </div>
          <button
            onClick={() => setShowMechanicTerms(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6 text-sm">Last updated: August 14, 2025</p>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                1. Eligibility Criteria
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Applicants must be at least 18 years old.</li>
                <li>Must hold valid mechanic certifications and licenses.</li>
                <li>Must have at least 1 year of hands-on automotive experience.</li>
                <li>No criminal record related to theft, fraud, or violence.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                2. Verification Process
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By applying, you consent to identity verification, license validation, and background checks conducted by OneTap or its authorized partners.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                3. Work Commitments
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Be punctual for all assigned jobs.</li>
                <li>Provide accurate service completion updates.</li>
                <li>Maintain professional behavior with customers and colleagues.</li>
                <li>Follow all safety guidelines and company protocols.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                4. Code of Conduct
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Any misconduct, fraudulent activity, or breach of trust may result in suspension or permanent removal from the platform.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                5. Agreement
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By submitting this application, you confirm that all information provided is true and complete. You also agree to abide by the policies and operational guidelines of OneTap.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowMechanicTerms(false)}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);
