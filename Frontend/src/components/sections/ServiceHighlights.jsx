import { Check, Clock, IndianRupee, MapPin, Siren } from "lucide-react";

const ServiceHighlights = () => {
  const highlights = [
    {
      title: "24/7 Availability",
      icon: <Clock color="white" />,
      description: "Round-the-clock emergency service",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Verified Mechanics",
      icon: <Check color="white" />,
      description: "Certified and background-checked",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Live Tracking",
      icon: <MapPin color="white" />,
      description: "Real-time mechanic location updates",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Affordable Pricing",
      icon: <IndianRupee color="white" />,
      description: "Transparent, competitive rates",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose OneTap?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our professional automotive service
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border-0"
            >
              <div className="text-center">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="text-3xl filter drop-shadow-sm">
                    {item.icon}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div
                className={`mt-6 h-1 bg-gradient-to-r ${item.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className=" flex justify-center text-center mt-12">
          <button className="flex justify-center align-middle gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Siren /> Get Help Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
