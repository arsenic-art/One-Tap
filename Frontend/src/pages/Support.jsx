import { useState } from "react";
import {
  BadgeQuestionMark,
  CircleAlert,
  FolderOpen,
  Mail,
  MapPin,
  ShieldAlert,
  Star,
  Phone,
  MessageCircleMore,
  Siren,
  BookOpenText,
  TicketPercent,
  Wrench,
  CreditCard,
} from "lucide-react";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "How do I request a service?",
          answer:
            "Open OneTap, choose the service you need, share your location, and nearby mechanics will be notified instantly.",
        },
        {
          question: "Which areas does OneTap support?",
          answer:
            "We currently operate in selected cities. Availability depends on active mechanics near your location.",
        },
        {
          question: "Are mechanics verified?",
          answer:
            "Yes. Mechanics are onboarded after basic verification and review checks to ensure reliable service.",
        },
        {
          question: "Can I cancel a request?",
          answer:
            "Yes, you can cancel anytime before a mechanic accepts your request without any charges.",
        },
      ],
    },
    {
      category: "Pricing & Payments",
      questions: [
        {
          question: "How is pricing decided?",
          answer:
            "Prices depend on the service and issue. Final charges are discussed before work begins.",
        },
        {
          question: "What payment methods are supported?",
          answer:
            "You can pay using UPI, cards, or cash after the service is completed.",
        },
        {
          question: "Are there hidden charges?",
          answer:
            "No. Any extra work or parts are quoted and approved by you beforehand.",
        },
      ],
    },
    {
      category: "Service & Support",
      questions: [
        {
          question: "How long does it take for help to arrive?",
          answer:
            "Response time depends on mechanic availability and distance, but requests are sent instantly.",
        },
        {
          question: "What if the issue is bigger than expected?",
          answer:
            "The mechanic will explain the situation and share options before proceeding.",
        },
      ],
    },
  ];

  const contactMethods = [
    {
      icon: <Phone size={28} />,
      title: "Call Support",
      description: "Talk directly to our team",
      details: "+91 xxxxx xxxxx",
      availability: "Available 24/7",
      action: "Call Now",
    },
    {
      icon: <MessageCircleMore size={28} />,
      title: "Live Chat",
      description: "Quick help through chat",
      details: "Replies within minutes",
      availability: "Available 24/7",
      action: "Start Chat",
    },
    {
      icon: <Mail size={28} />,
      title: "Email Us",
      description: "For non-urgent queries",
      details: "onetapservicemail@gmail.com",
      availability: "Reply within a few hours",
      action: "Send Email",
    },
    {
      icon: <Siren size={28} />,
      title: "Emergency Help",
      description: "Immediate roadside assistance",
      details: "+91 xxxxx xxxxx",
      availability: "Emergency only",
      action: "Call Emergency",
    },
  ];

  const supportResources = [
    {
      icon: <BookOpenText size={26} />,
      title: "Service History",
      description: "View your past service requests",
    },
    {
      icon: <TicketPercent size={26} />,
      title: "Manage Requests",
      description: "Cancel or reschedule services",
    },
    {
      icon: <Wrench size={26} />,
      title: "Maintenance Tips",
      description: "Basic care and reminders",
    },
    {
      icon: <CreditCard size={26} />,
      title: "Payments",
      description: "Manage your payment options",
    },
    {
      icon: <MapPin size={26} />,
      title: "Service Coverage",
      description: "Check supported locations",
    },
    {
      icon: <Star size={26} />,
      title: "Reviews",
      description: "Rate your experience",
    },
  ];

  const troubleshootingSteps = [
    {
      problem: "App not working properly",
      solutions: [
        "Check your internet connection",
        "Restart the app",
        "Update to the latest version",
        "Try again after some time",
      ],
    },
    {
      problem: "Unable to place a request",
      solutions: [
        "Make sure location access is enabled",
        "Check if services are available in your area",
        "Try again after refreshing",
      ],
    },
    {
      problem: "Payment failed",
      solutions: [
        "Retry with a different payment method",
        "Check UPI or card details",
        "Contact your bank if the issue continues",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Need Help?
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            We’re here to help you get back on the road quickly.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-center border"
            >
              <div className="flex justify-center mb-4">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-2">
                {method.description}
              </p>
              <p className="text-red-600 font-semibold mb-1">
                {method.details}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {method.availability}
              </p>
              <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 rounded-full font-semibold hover:opacity-90">
                {method.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex justify-center gap-4 mb-12">
          {["faq", "resources", "troubleshooting"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white"
                  : "bg-white border"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* FAQ */}
        {activeTab === "faq" &&
          faqData.map((section, sIdx) => (
            <div key={sIdx} className="mb-8 bg-white rounded-2xl shadow">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold">
                  {section.category}
                </h3>
              </div>
              {section.questions.map((q, qIdx) => {
                const id = `${sIdx}-${qIdx}`;
                return (
                  <div key={id} className="p-6 border-t">
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === id ? null : id)
                      }
                      className="w-full text-left font-semibold"
                    >
                      {q.question}
                    </button>
                    {openFaq === id && (
                      <p className="mt-3 text-gray-600">
                        {q.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        {/* Resources */}
        {activeTab === "resources" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportResources.map((r, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg"
              >
                <div className="mb-4">{r.icon}</div>
                <h3 className="font-bold text-lg">{r.title}</h3>
                <p className="text-gray-600 text-sm">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Troubleshooting */}
        {activeTab === "troubleshooting" &&
          troubleshootingSteps.map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow mb-6"
            >
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <CircleAlert className="text-orange-500" />
                {t.problem}
              </h3>
              <ul className="space-y-2 text-gray-700">
                {t.solutions.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* Emergency CTA */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16 text-center">
        <ShieldAlert size={40} className="mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-4">
          Emergency Support
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Immediate help when you need it most.
        </p>
        <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold">
          Call +91 xxxxx xxxxx
        </button>
      </div>
    </div>
  );
};

export default SupportPage;
