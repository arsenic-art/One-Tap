import { useState, useEffect } from "react";
import Logo from "../../assets/OneTapLogo - Copy.png";
import {
  Car,
  FileQuestionMark,
  Phone,
  Siren,
  Wrench,
  Shield,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    {
      icon: "📍",
      title: "Live Location Detection",
      description: "We pinpoint your location to find nearby mechanics.",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: "🔧",
      title: "Verified Mechanics",
      description: "Browse certified mechanics in your area.",
      color: "from-green-400 to-green-500",
    },
    {
      icon: "⚡",
      title: "Fast Booking",
      description: "Book services instantly with verified pros.",
      color: "from-purple-400 to-purple-500",
    },
  ];

  const navigate = useNavigate();

  const stats = [
    { number: "< 30", label: "Minutes Response", unit: "min" },
    { number: "Many", label: "Happy Customers", unit: "" },
    { number: "24/7", label: "Available", unit: "" },
    { number: "92%", label: "Success Rate", unit: "%" },
  ];

  const quickSections = [
    {
      title: "About OneTap",
      icon: <Car size={36} />,
      description: "Learn about our roadside assistance service",
      link: "/aboutus",
    },
    {
      title: "Book Service",
      icon: <Wrench size={36} />,
      description: "Request mechanic help now",
      link: "/services",
    },
    {
      title: "Browse Mechanics",
      icon: <Users size={36} />,
      description: "Find verified mechanics near you",
      link: "/browse",
    },
    {
      title: "My Bookings",
      icon: <Shield size={36} />,
      description: "Track your service requests",
      link: "/bookings",
    },
  ];

  const faqs = [
    {
      question: "How do I book a mechanic?",
      answer: "Go to Services → Browse Mechanics → Book instantly.",
    },
    {
      question: "Can I see mechanic ratings?",
      answer: "Yes, browse verified mechanics with ratings and reviews.",
    },
    {
      question: "What services are available?",
      answer:
        "Battery replacement, tire repair, AC service, engine diagnostics & more.",
    },
    {
      question: "How do I track my booking?",
      answer: "Check My Bookings page for real-time status updates.",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 text-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-100/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-8">
              <div className="text-8xl mb-6">
                <div className="flex justify-center">
                  <img
                    src={Logo}
                    className="w-48 rounded-full"
                    alt="OneTap Logo"
                  />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                Ek Tap, <span className="text-orange-500">Sab Set!</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Get instant help from verified mechanics. Book services, browse
                mechanics, track bookings - all in one place.
                <span className="block mt-2 text-blue-600 font-semibold">
                  Anytime. Anywhere.
                </span>
              </p>
            </div>

            {/* CTA Buttons - Fixed phone numbers */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button
                onClick={() => navigate("/services")}
                className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <Siren /> Book Service Now
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </button>
              <button
                onClick={() => {
                  window.location.href = "tel:+918889609747";
                }}
                className="flex gap-2 border-2 border-blue-500 text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Phone /> Call: +91 88896 09747
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white transition-all duration-300 shadow-md"
                >
                  <div className="text-3xl font-bold text-orange-500">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`group bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg ${
                  currentBenefit === index
                    ? "ring-2 ring-orange-300 bg-white"
                    : ""
                }`}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{benefit.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      benefit.color
                    } transition-all duration-500 ${
                      currentBenefit === index ? "w-full" : "w-0"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Banner */}
          <div className="mt-16 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-3xl animate-pulse">🚨</span>
              <h2 className="text-2xl font-bold text-gray-800">
                Need Help Right Now?
              </h2>
              <span className="text-3xl animate-pulse">🚨</span>
            </div>
            <p className="text-lg mb-4 text-gray-700">
              Stuck on the road? Book a verified mechanic instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/services"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                📱 Book Emergency Service
              </Link>
              <button
                onClick={() => {
                  window.location.href = "tel:+918889609747";
                }}
                className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                📞 Call Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section - Updated Routes */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {quickSections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className="group no-underline bg-gray-50 rounded-2xl p-6 text-center hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="flex justify-center text-4xl mb-4">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About OneTap
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Connect with verified mechanics instantly. Book services, track
                progress, and get roadside help - all from one platform.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">50K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">500+</div>
                  <div className="text-sm text-gray-600">
                    Verified Mechanics
                  </div>
                </div>
              </div>
              <Link
                to="/aboutus"
                className="inline-block no-underline bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-center">
                <div className="flex justify-center text-6xl mb-4">
                  <Car size={58} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700">
                  Making automotive service simple, fast, and reliable for
                  everyone, everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Simplified */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-orange-50 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">
                    <FileQuestionMark size={20} />
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-700 pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/support"
              className="inline-block border-2 no-underline border-orange-500 text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              Visit Support Center
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Your Car Fixed?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't wait. Book verified mechanics and get back on the road fast.
          </p>
          <div className="flex items-center flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/services")}
              className="flex gap-2 items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              <Siren className="w-5 h-5" />
              Book Service Now
            </button>
            <Link
              to="/browse"
              className="flex gap-2 items-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold bg-transparent hover:border-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              Browse Mechanics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
