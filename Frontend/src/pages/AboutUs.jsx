import { Car, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Chandrakant Banait",
      role: "CEO & Founder",
      experience: "0+ years",
      image: "👩‍💼",
      bio: "Former automotive engineer turned entrepreneur, passionate about revolutionizing auto service delivery.",
    },
    {
      name: "Er. Piyush Sharma ",
      role: "CEO & Founder",
      experience: "0+ years",
      image: "👨‍🔧",
      bio: "Master mechanic with expertise in all vehicle types, ensuring quality service standards.",
    },
  ];

  const navigate = useNavigate();

  const values = [
    {
      icon: "🎯",
      title: "Excellence",
      description:
        "We strive for perfection in every service we provide, never settling for 'good enough'.",
    },
    {
      icon: "🤝",
      title: "Trust",
      description:
        "Building lasting relationships through transparent communication and reliable service.",
    },
    {
      icon: <Rocket />,
      title: "Innovation",
      description:
        "Continuously improving our technology and processes to better serve our customers.",
    },
    {
      icon: "💚",
      title: "Care",
      description:
        "Treating every vehicle and customer with the attention and respect they deserve.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "500+", label: "Certified Mechanics" },
    { number: "24/7", label: "Support Available" },
    { number: "98%", label: "Success Rate" },
  ];

  return (
    <>
      <div
        id="aboutus"
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <div className="text-8xl mb-6">🔧</div>
              <h1 className="text-5xl font-bold mb-6">About OneTap</h1>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Revolutionizing automotive service with mobile mechanics,
                cutting-edge technology, and unwavering commitment to customer
                satisfaction.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  OneTap was born from a simple frustration: why should car
                  troubles disrupt your entire day? Founded in 2019, we set out
                  to bring professional automotive service directly to our
                  customers, wherever they are.
                </p>
                <p className="text-lg leading-relaxed">
                  What started as a small team of passionate mechanics has grown
                  into a nationwide network of certified professionals, all
                  united by the mission to make car maintenance convenient,
                  transparent, and stress-free.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we're proud to serve over 50,000 customers across the
                  country, backed by cutting-edge technology and a commitment to
                  excellence that drives everything we do.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Car size={66} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 text-lg">
                  To make quality automotive service accessible, convenient, and
                  trustworthy for everyone, while empowering skilled mechanics
                  to build successful careers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind OneTap's success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 ">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">{member.image}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {member.experience}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose OneTap?</h2>
              <p className="text-xl opacity-90">
                Experience the difference that quality and convenience make
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Mobile Service</h3>
                <p className="opacity-90">
                  We come to your home, office, or wherever you are. No more
                  waiting at repair shops.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
                <p className="opacity-90">
                  Know exactly what you're paying for with upfront, competitive
                  pricing.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                <p className="opacity-90">
                  All work backed by our comprehensive warranty and satisfaction
                  guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Experience RoadRescue?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who have made the switch to
              convenient, professional auto service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  navigate("/services");
                }}
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Book Service Now
              </button>
              <button
                onClick={() => {
                  navigate("/support");
                }}
                className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Contact Us
              </button>
            </div>

            <div className="mt-8 p-4 bg-red-50 rounded-xl">
              <p className="text-red-600 font-medium">
                Need emergency service? Call{" "}
                <a
                  href="tel:555-911-AUTO"
                  className="font-bold hover:underline"
                >
                  (555) 911-AUTO
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
