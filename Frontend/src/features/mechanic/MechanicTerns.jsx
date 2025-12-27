import {
  X,
  FileText,
  Wrench,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const MechanicApplicationTerms = ({
  showMechanicTerms,
  setShowMechanicTerms,
}) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showMechanicTerms ? "opacity-100 visible" : "opacity-0 invisible"
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
        showMechanicTerms ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold">
              Mechanic Application – The Not-So-Scary Rules
            </h2>
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
          <p className="text-gray-500 mb-6 text-sm">
            Last updated: August 14, 2025 (yes, we keep things updated)
          </p>

          <div className="space-y-6">
            {/* Eligibility */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                1. Who Can Apply
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>You must be 18+ (sorry, prodigies).</li>
                <li>
                  You should have valid mechanic certifications or licenses.
                </li>
                <li>
                  At least 1 year of real-world experience (YouTube-only doesn’t
                  count 😄).
                </li>
                <li>
                  No criminal history involving theft, fraud, or violence.
                </li>
              </ul>
            </section>

            {/* Verification */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                2. Verification Stuff (The Important Part)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By applying, you agree to identity checks, license verification,
                and basic background screening. Don’t worry — we’re verifying
                mechanics, not running a spy agency.
              </p>
            </section>

            {/* Work */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                3. How We Expect You to Work
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Show up on time (customers really appreciate this).</li>
                <li>Update job status honestly — no mystery repairs.</li>
                <li>
                  Be respectful to customers, their vehicles, and fellow
                  mechanics.
                </li>
                <li>Follow safety rules — broken bones help no one.</li>
              </ul>
            </section>

            {/* Conduct */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                4. Things That Will Get You Kicked Out
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Fraud, fake jobs, rude behavior, or breaking trust. If you try
                something shady, we’ll have to say goodbye — permanently.
              </p>
            </section>

            {/* Agreement */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                5. Final Word
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By submitting this application, you confirm that the information
                you provided is accurate and that you’ll play by OneTap’s rules.
                Be honest, do good work, and everyone wins.
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
            Sounds Fair, Let’s Go 🚀
          </button>
        </div>
      </div>
    </div>
  </div>
);
