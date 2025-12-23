import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  BadgeQuestionMark,
  CircleAlert,
  FolderOpen,
  Mail,
  MapPin,
  ShieldAlert,
  Star,
} from "lucide-react";
import { Phone } from "lucide-react";
import { MessageCircleMore } from "lucide-react";
import { Siren } from "lucide-react";
import { BookOpenText } from "lucide-react";
import { TicketPercent } from "lucide-react";
import { Wrench } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Outlet } from "react-router-dom";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [openFaq, setOpenFaq] = useState(null);
  const [animatedElements, setAnimatedElements] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "How do I book a service?",
          answer:
            "You can book a service through our mobile app, website, or by calling (555) 123-4567. Simply select your service, choose your location and preferred time, and we'll send a certified mechanic to you.",
        },
        {
          question: "What areas do you service?",
          answer:
            "We currently service the greater metropolitan area within a 50-mile radius of downtown. You can check if we service your area by entering your zip code during booking.",
        },
        {
          question: "Are your mechanics certified?",
          answer:
            "Yes, all our mechanics are ASE certified and undergo rigorous background checks. They carry professional liability insurance and are equipped with the latest diagnostic tools.",
        },
        {
          question: "What if I need to cancel or reschedule?",
          answer:
            "You can cancel or reschedule up to 2 hours before your appointment without any fees. Cancellations within 2 hours may incur a $25 fee.",
        },
      ],
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          question: "How much do your services cost?",
          answer:
            "Our pricing varies by service. We offer transparent, upfront pricing with no hidden fees. You'll see the exact cost before booking, and we provide detailed estimates for any additional work needed.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, debit cards, PayPal, and cash. Payment is collected after service completion through our secure payment system.",
        },
        {
          question: "Do you offer warranties?",
          answer:
            "Yes! We offer a 12-month/12,000-mile warranty on parts and a 90-day warranty on labor. This covers any defects in workmanship or parts failure.",
        },
        {
          question: "Are there any additional fees?",
          answer:
            "Our prices include all labor and basic supplies. The only additional costs might be parts (quoted upfront) or emergency service fees for calls between 10 PM and 6 AM.",
        },
      ],
    },
    {
      category: "Service Details",
      questions: [
        {
          question: "How long does a typical service take?",
          answer:
            "Most services take 30 minutes to 2 hours depending on complexity. We provide estimated timeframes for each service during booking, and our mechanic will update you on progress.",
        },
        {
          question: "Do I need to be present during service?",
          answer:
            "For most services, you don't need to be present. However, we recommend being available for diagnostics and to approve any additional work that may be needed.",
        },
        {
          question: "What if additional repairs are needed?",
          answer:
            "Our mechanic will diagnose the issue and provide a detailed estimate for any additional work. We never perform unauthorized repairs - we always get your approval first.",
        },
        {
          question: "Do you provide parts or do I need to buy them?",
          answer:
            "We provide all necessary parts and fluids. We use OEM or equivalent quality parts and can source specific brands upon request for an additional fee.",
        },
      ],
    },
  ];

  const contactMethods = [
    {
      icon: <Phone />,
      title: "Phone Support",
      description: "Talk to our support team",
      details: "6232706378",
      availability: "24/7 Available",
      action: "Call Now",
    },
    {
      icon: <MessageCircleMore />,
      title: "Live Chat",
      description: "Get instant help online",
      details: "Average response: 2 min",
      availability: "24/7 Available",
      action: "Start Chat",
    },
    {
      icon: <Mail />,
      title: "Email Support",
      description: "Send us your questions",
      details: "OneTap@gmail.com",
      // details: "support@mechanicapp.com",
      availability: "Response within 4 hours",
      action: "Send Email",
    },
    {
      icon: <Siren />,
      title: "Emergency Line",
      description: "For roadside emergencies",
      details: "6267031616",
      availability: "24/7 Emergency",
      action: "Emergency Call",
    },
  ];

  const supportResources = [
    {
      icon: <BookOpenText />,
      title: "Service History",
      description: "View your past services and receipts",
      link: "#",
    },
    {
      icon: <TicketPercent />,
      title: "Appointment Manager",
      description: "Reschedule or cancel appointments",
      link: "#",
    },
    {
      icon: <Wrench />,
      title: "Maintenance Reminders",
      description: "Set up automatic service reminders",
      link: "#",
    },
    {
      icon: <CreditCard />,
      title: "Payment Methods",
      description: "Manage your payment options",
      link: "#",
    },
    {
      icon: <MapPin />,
      title: "Service Areas",
      description: "Check if we service your location",
      link: "#",
    },
    {
      icon: <Star />,
      title: "Leave Review",
      description: "Share your experience with us",
      link: "#",
    },
  ];

  const troubleshootingSteps = [
    {
      problem: "App Won't Load",
      solutions: [
        "Check your internet connection",
        "Clear app cache and data",
        "Update to the latest version",
        "Restart your device",
      ],
    },
    {
      problem: "Booking Issues",
      solutions: [
        "Ensure your location is within service area",
        "Check available time slots",
        "Verify payment method is valid",
        "Try booking through website",
      ],
    },
    {
      problem: "Payment Problems",
      solutions: [
        "Check card expiration date",
        "Verify billing address",
        "Try a different payment method",
        "Contact your bank",
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              How Can We Help?
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Get the support you need, when you need it. We're here 24/7 to
              help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                Get Help Now
              </button>
              <button className="border-2 border-white red px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300 hover:scale-105">
                Emergency: 6264154947
              </button>
            </div>
          </div>
        </div>

        {/* Quick Contact Methods */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-xl text-gray-600">
                Multiple ways to reach our support team
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex justify-center mb-4">{method.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <div className="text-lg font-semibold text-red-600 mb-2">
                    {method.details}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {method.availability}
                  </div>
                  <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 rounded-full font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Tabs */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {["faq", "resources", "troubleshooting"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                >
                  {tab === "faq" && (
                    <div className="flex gap-3 items-center">
                      <BadgeQuestionMark
                        color={activeTab === "faq" ? "white" : "red"}
                      />
                      FAQ
                    </div>
                  )}
                  {tab === "resources" && (
                    <div className="flex gap-3 items-center">
                      <FolderOpen
                        color={activeTab === "resources" ? "white" : "red"}
                      />
                      RESOURCES
                    </div>
                  )}
                  {tab === "troubleshooting" && (
                    <div className="flex gap-3 items-center">
                      <Wrench
                        color={activeTab === "troubleshooting" ? "white" : "red"}
                      />
                      TROUBLESHOOTING
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* FAQ Tab */}
            
            {activeTab === "faq" && (
              <div className="space-y-8">
                {faqData.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6">
                      <h3 className="text-2xl font-bold">
                        {category.category} Questions
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {category.questions.map((faq, index) => (
                        <div key={index} className="p-6">
                          <button
                            onClick={() =>
                              setOpenFaq(
                                openFaq === `${categoryIndex}-${index}`
                                  ? null
                                  : `${categoryIndex}-${index}`
                              )
                            }
                            className="w-full flex justify-between items-center text-left hover:text-red-600 transition-colors duration-300"
                          >
                            <span className="text-lg font-semibold">
                              {faq.question}
                            </span>
                            <span
                              className={`text-2xl transition-transform duration-300 ${
                                openFaq === `${categoryIndex}-${index}`
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              ▼
                            </span>
                          </button>
                          {openFaq === `${categoryIndex}-${index}` && (
                            <div className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === "resources" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportResources.map((resource, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-2"
                  >
                    <div className="flex justify-center mb-4">
                      {resource.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <button className="text-red-600 font-semibold hover:text-red-700 transition-colors duration-300">
                      Access →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Troubleshooting Tab */}
            {activeTab === "troubleshooting" && (
              <div className="space-y-6">
                {troubleshootingSteps.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-8"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-orange-500 mr-3">
                        {" "}
                        <CircleAlert size={28} />
                      </span>
                      {issue.problem}
                    </h3>
                    <div className="space-y-3">
                      {issue.solutions.map((solution, solutionIndex) => (
                        <div
                          key={solutionIndex}
                          className="flex items-start space-x-3"
                        >
                          <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mt-1">
                            {solutionIndex + 1}
                          </div>
                          <div className="text-gray-700 text-lg">
                            {solution}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center  mb-6  ">
              <ShieldAlert size={40} />
            </div>
            <h2 className="text-4xl font-bold mb-4">Emergency Support</h2>
            <p className="text-xl mb-8 opacity-90">
              Stranded? Need immediate help? Our emergency team is standing by
              24/7.
            </p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg text-lg">
              Call Emergency Line: 6264154947
            </button>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-gray-300 mb-6">
              Our support team is available 24/7 to assist you with any
              questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Live Chat Support
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105">
                Submit Support Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
