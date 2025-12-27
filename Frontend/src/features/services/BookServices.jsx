import { useState, useEffect } from "react";
import {
  Car,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Star,
} from "lucide-react";

const BookServicePage = ({ selectedService = null, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [bookingData, setBookingData] = useState({
    // User Details
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",

    // Vehicle Details
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    licensePlate: "",
    mileage: "",

    // Service Details
    serviceType: selectedService?.title || "",
    serviceCategory: selectedService?.category || "",
    urgency: "normal",
    preferredDate: "",
    preferredTime: "",
    alternateDate: "",
    alternateTime: "",

    // Additional Information
    problemDescription: "",
    additionalServices: [],
    specialInstructions: "",

    // Pricing
    estimatedPrice: selectedService?.price || "",

    // Contact Preferences
    contactPreference: "phone",
    marketingConsent: false,
  });

  // Available services for general booking
  const allServices = [
    {
      id: 1,
      title: "Emergency Roadside Assistance",
      category: "emergency",
      price: "From $49",
      icon: "🚨",
    },
    {
      id: 2,
      title: "Mobile Oil Change",
      category: "maintenance",
      price: "From $79",
      icon: "🛢️",
    },
    {
      id: 3,
      title: "Brake Inspection & Repair",
      category: "repair",
      price: "From $129",
      icon: "🛑",
    },
    {
      id: 4,
      title: "Battery Replacement",
      category: "maintenance",
      price: "From $89",
      icon: "🔋",
    },
    {
      id: 5,
      title: "Tire Services",
      category: "maintenance",
      price: "From $39",
      icon: "🛞",
    },
    {
      id: 6,
      title: "Engine Diagnostics",
      category: "repair",
      price: "From $99",
      icon: "🔧",
    },
    {
      id: 7,
      title: "AC System Service",
      category: "repair",
      price: "From $149",
      icon: "❄️",
    },
    {
      id: 8,
      title: "Pre-Purchase Inspection",
      category: "inspection",
      price: "From $199",
      icon: "🔍",
    },
    {
      id: 9,
      title: "Preventive Maintenance",
      category: "maintenance",
      price: "From $159",
      icon: "🛡️",
    },
  ];

  const additionalServicesOptions = [
    { id: "oil-check", name: "Oil Level Check", price: "+$15" },
    { id: "fluid-topoff", name: "Fluid Top-off", price: "+$25" },
    { id: "battery-test", name: "Battery Test", price: "+$20" },
    { id: "tire-pressure", name: "Tire Pressure Check", price: "+$10" },
    { id: "visual-inspection", name: "Visual Inspection", price: "+$30" },
  ];

  const urgencyOptions = [
    {
      value: "emergency",
      label: "Emergency (ASAP)",
      icon: "🚨",
      color: "text-red-600",
    },
    {
      value: "urgent",
      label: "Urgent (Same Day)",
      icon: "⚡",
      color: "text-orange-600",
    },
    {
      value: "normal",
      label: "Normal (1-3 Days)",
      icon: "📅",
      color: "text-green-600",
    },
    {
      value: "flexible",
      label: "Flexible (This Week)",
      icon: "⏰",
      color: "text-blue-600",
    },
  ];

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  // Get current date for date input minimum
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle additional services
  const handleAdditionalServiceChange = (serviceId) => {
    setBookingData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter((s) => s !== serviceId)
        : [...prev.additionalServices, serviceId],
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!bookingData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!bookingData.email.trim()) newErrors.email = "Email is required";
      if (!bookingData.phone.trim())
        newErrors.phone = "Phone number is required";
      if (!bookingData.address.trim())
        newErrors.address = "Address is required";
      if (!bookingData.city.trim()) newErrors.city = "City is required";
      if (!bookingData.zipCode.trim())
        newErrors.zipCode = "ZIP code is required";
    } else if (step === 2) {
      if (!bookingData.vehicleMake.trim())
        newErrors.vehicleMake = "Vehicle make is required";
      if (!bookingData.vehicleModel.trim())
        newErrors.vehicleModel = "Vehicle model is required";
      if (!bookingData.vehicleYear.trim())
        newErrors.vehicleYear = "Vehicle year is required";
    } else if (step === 3) {
      if (!selectedService && !bookingData.serviceType)
        newErrors.serviceType = "Service type is required";
      if (!bookingData.preferredDate)
        newErrors.preferredDate = "Preferred date is required";
      if (!bookingData.preferredTime)
        newErrors.preferredTime = "Preferred time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  // Success page
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your service request has been submitted successfully. We'll contact
            you shortly to confirm the details.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📧 Confirmation email sent
              <br />
              📞 We'll call you within 30 minutes
              <br />
              🔧 Mechanic will arrive on scheduled time
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
            >
              Book Another Service
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="w-full border-2 border-red-600 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Back to Services
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold">Book Your Service</h1>
                <p className="opacity-90">
                  {selectedService
                    ? `${selectedService.title} - ${selectedService.price}`
                    : "Choose your service and schedule appointment"}
                </p>
              </div>
            </div>
            <Car size={48} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? "✓" : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-red-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Contact Info</span>
            <span>Vehicle Details</span>
            <span>Service & Schedule</span>
            <span>Review & Book</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <User size={48} className="mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Contact Information
                </h2>
                <p className="text-gray-600">Let us know how to reach you</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.fullName ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.phone ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={bookingData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.address ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Street address where service is needed"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={bookingData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.city ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={bookingData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.zipCode ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Information */}
          {currentStep === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <Car size={48} className="mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vehicle Information
                </h2>
                <p className="text-gray-600">Tell us about your vehicle</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Make *
                  </label>
                  <input
                    type="text"
                    name="vehicleMake"
                    value={bookingData.vehicleMake}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.vehicleMake ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="e.g., Toyota, Honda, Ford"
                  />
                  {errors.vehicleMake && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vehicleMake}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={bookingData.vehicleModel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.vehicleModel ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="e.g., Camry, Civic, F-150"
                  />
                  {errors.vehicleModel && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vehicleModel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="vehicleYear"
                    value={bookingData.vehicleYear}
                    onChange={handleInputChange}
                    min="1990"
                    max="2025"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.vehicleYear ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="2020"
                  />
                  {errors.vehicleYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vehicleYear}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={bookingData.vehicleColor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="e.g., White, Black, Red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={bookingData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="ABC-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Mileage
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={bookingData.mileage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="50000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Service & Scheduling */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <Calendar size={48} className="mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Service & Schedule
                </h2>
                <p className="text-gray-600">
                  Choose your service and preferred time
                </p>
              </div>

              <div className="space-y-8">
                {/* Service Selection (only if not pre-selected) */}
                {!selectedService && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Select Service Type *
                    </label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() =>
                            setBookingData((prev) => ({
                              ...prev,
                              serviceType: service.title,
                              serviceCategory: service.category,
                              estimatedPrice: service.price,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            bookingData.serviceType === service.title
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-red-300"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{service.icon}</div>
                            <h3 className="font-semibold text-sm mb-1">
                              {service.title}
                            </h3>
                            <p className="text-red-600 font-bold text-sm">
                              {service.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.serviceType && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.serviceType}
                      </p>
                    )}
                  </div>
                )}

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Service Urgency
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {urgencyOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            urgency: option.value,
                          }))
                        }
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          bookingData.urgency === option.value
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <h3 className="font-semibold">{option.label}</h3>
                            <p className={`text-sm ${option.color}`}>
                              {option.value === "emergency" &&
                                "Additional rush fees may apply"}
                              {option.value === "urgent" &&
                                "Same day service available"}
                              {option.value === "normal" &&
                                "Standard scheduling"}
                              {option.value === "flexible" &&
                                "Best rates available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={bookingData.preferredDate}
                      onChange={handleInputChange}
                      min={getCurrentDate()}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.preferredDate
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.preferredDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.preferredDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      name="preferredTime"
                      value={bookingData.preferredTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.preferredTime
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.preferredTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.preferredTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alternate Date
                    </label>
                    <input
                      type="date"
                      name="alternateDate"
                      value={bookingData.alternateDate}
                      onChange={handleInputChange}
                      min={getCurrentDate()}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alternate Time
                    </label>
                    <select
                      name="alternateTime"
                      value={bookingData.alternateTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Problem Description
                  </label>
                  <textarea
                    name="problemDescription"
                    value={bookingData.problemDescription}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Describe the issue you're experiencing with your vehicle..."
                  />
                </div>

                {/* Additional Services */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Add Optional Services
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {additionalServicesOptions.map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          bookingData.additionalServices.includes(service.id)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                        onClick={() =>
                          handleAdditionalServiceChange(service.id)
                        }
                      >
                        <span className="font-semibold text-gray-800">
                          {service.name}
                        </span>
                        <span className="text-red-600 font-bold">
                          {service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review and Book */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <Star size={48} className="mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review Your Booking
                </h2>
                <p className="text-gray-600">
                  Please confirm all details before booking
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                {/* User Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <User className="mr-2 text-red-500" size={20} /> Your
                    Details
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Name:</strong> {bookingData.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {bookingData.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {bookingData.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {bookingData.address},{" "}
                      {bookingData.city}, {bookingData.zipCode}
                    </p>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <Car className="mr-2 text-red-500" size={20} /> Vehicle
                    Details
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Make:</strong> {bookingData.vehicleMake}
                    </p>
                    <p>
                      <strong>Model:</strong> {bookingData.vehicleModel}
                    </p>
                    <p>
                      <strong>Year:</strong> {bookingData.vehicleYear}
                    </p>
                    {bookingData.vehicleColor && (
                      <p>
                        <strong>Color:</strong> {bookingData.vehicleColor}
                      </p>
                    )}
                    {bookingData.licensePlate && (
                      <p>
                        <strong>License Plate:</strong>{" "}
                        {bookingData.licensePlate}
                      </p>
                    )}
                    {bookingData.mileage && (
                      <p>
                        <strong>Mileage:</strong> {bookingData.mileage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <Calendar className="mr-2 text-red-500" size={20} /> Service
                    & Schedule
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Service Type:</strong>{" "}
                      <span className="font-semibold text-red-600">
                        {bookingData.serviceType}
                      </span>
                    </p>
                    <p>
                      <strong>Urgency:</strong>{" "}
                      {
                        urgencyOptions.find(
                          (opt) => opt.value === bookingData.urgency
                        )?.label
                      }
                    </p>
                    <p>
                      <strong>Preferred Slot:</strong>{" "}
                      {bookingData.preferredDate} at {bookingData.preferredTime}
                    </p>
                    {bookingData.alternateDate && bookingData.alternateTime && (
                      <p>
                        <strong>Alternate Slot:</strong>{" "}
                        {bookingData.alternateDate} at{" "}
                        {bookingData.alternateTime}
                      </p>
                    )}
                    {bookingData.problemDescription && (
                      <p>
                        <strong>Problem Description:</strong>{" "}
                        {bookingData.problemDescription}
                      </p>
                    )}
                    {bookingData.additionalServices.length > 0 && (
                      <div>
                        <strong>Additional Services:</strong>
                        <ul className="list-disc list-inside ml-2">
                          {bookingData.additionalServices.map((id) => {
                            const service = additionalServicesOptions.find(
                              (s) => s.id === id
                            );
                            return service ? (
                              <li key={id}>
                                {service.name} ({service.price})
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                    {bookingData.specialInstructions && (
                      <p>
                        <strong>Special Instructions:</strong>{" "}
                        {bookingData.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Preferences */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <Phone className="mr-2 text-red-500" size={20} /> Contact
                    Preferences
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Preferred Contact:</strong>{" "}
                      {bookingData.contactPreference === "phone"
                        ? "Phone Call"
                        : "Email"}
                    </p>
                    <p>
                      <strong>Marketing Consent:</strong>{" "}
                      {bookingData.marketingConsent ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="text-right mt-6">
                  <p className="text-2xl font-bold text-gray-900">
                    Estimated Price:{" "}
                    <span className="text-red-600">
                      {bookingData.estimatedPrice || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Final price may vary based on inspection.
                  </p>
                </div>
              </div>

              {/* Legal/Consent */}
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded">
                <div className="flex items-center mb-2">
                  <AlertCircle size={20} className="mr-2" />
                  <p className="font-semibold">Important Information</p>
                </div>
                <p className="text-sm">
                  By clicking "Confirm & Book", you agree to our{" "}
                  <a
                    href="#"
                    className="underline text-yellow-900 hover:text-yellow-700"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="underline text-yellow-900 hover:text-yellow-700"
                  >
                    Privacy Policy
                  </a>
                  . Estimated prices are subject to change after a full
                  diagnosis by our mechanic.
                </p>
              </div>

              {/* Contact Preference Checkboxes */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How would you prefer us to contact you for confirmation?
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="phone"
                      checked={bookingData.contactPreference === "phone"}
                      onChange={handleInputChange}
                      className="form-radio text-red-600 h-5 w-5"
                    />
                    <span className="ml-2 text-gray-700 flex items-center">
                      <Phone size={16} className="mr-1" /> Phone Call
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="email"
                      checked={bookingData.contactPreference === "email"}
                      onChange={handleInputChange}
                      className="form-radio text-red-600 h-5 w-5"
                    />
                    <span className="ml-2 text-gray-700 flex items-center">
                      <Mail size={16} className="mr-1" /> Email
                    </span>
                  </label>
                </div>
              </div>

              {/* Marketing Consent Checkbox */}
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={bookingData.marketingConsent}
                    onChange={handleInputChange}
                    className="form-checkbox text-red-600 h-5 w-5 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    I agree to receive marketing communications and offers.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="flex items-center px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                <ArrowLeft size={20} className="mr-2" /> Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="ml-auto flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
              >
                Next Step <ArrowLeft size={20} className="ml-2 rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm & Book <CheckCircle size={20} className="ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
