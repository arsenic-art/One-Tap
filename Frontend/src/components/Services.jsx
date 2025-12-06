import React, { useState, useEffect } from 'react';
import { Car, User, MapPin, Phone, Mail, Calendar, Clock, CheckCircle, AlertCircle, ArrowLeft, Star } from 'lucide-react';
import Navbar from './Navbar';

// BookServicePage Component (embedded)
const Services = ({ selectedService = null, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [announceMessage, setAnnounceMessage] = useState('');

  // Form data state
  const [bookingData, setBookingData] = useState({
    // User Details
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    
    // Vehicle Details
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    licensePlate: '',
    mileage: '',
    
    // Service Details
    serviceType: selectedService?.title || '',
    serviceCategory: selectedService?.category || '',
    urgency: 'normal',
    preferredDate: '',
    preferredTime: '',
    alternateDate: '',
    alternateTime: '',
    
    // Additional Information
    problemDescription: '',
    additionalServices: [],
    specialInstructions: '',
    
    // Pricing
    estimatedPrice: selectedService?.price || '',
    
    // Contact Preferences
    contactPreference: 'phone',
    marketingConsent: false
  });

  // Available services for general booking (if no service is pre-selected)
  const allServices = [
    {
      id: 1,
      title: "Emergency Roadside Assistance",
      category: "emergency",
      price: "From $49",
      icon: "🚨"
    },
    {
      id: 2,
      title: "Mobile Oil Change",
      category: "maintenance",
      price: "From $79",
      icon: "🛢️"
    },
    {
      id: 3,
      title: "Brake Inspection & Repair",
      category: "repair",
      price: "From $129",
      icon: "🛑"
    },
    {
      id: 4,
      title: "Battery Replacement",
      category: "maintenance",
      price: "From $89",
      icon: "🔋"
    },
    {
      id: 5,
      title: "Tire Services",
      category: "maintenance",
      price: "From $39",
      icon: "🛞"
    },
    {
      id: 6,
      title: "Engine Diagnostics",
      category: "repair",
      price: "From $99",
      icon: "🔧"
    },
    {
      id: 7,
      title: "AC System Service",
      category: "repair",
      price: "From $149",
      icon: "❄️"
    },
    {
      id: 8,
      title: "Pre-Purchase Inspection",
      category: "inspection",
      price: "From $199",
      icon: "🔍"
    },
    {
      id: 9,
      title: "Preventive Maintenance",
      category: "maintenance",
      price: "From $159",
      icon: "🛡️"
    }
  ];

  // Additional services that can be added
  const additionalServicesOptions = [ // Renamed to avoid conflict with state variable
    { id: 'oil-check', name: 'Oil Level Check', price: '+$15' },
    { id: 'fluid-topoff', name: 'Fluid Top-off', price: '+$25' },
    { id: 'battery-test', name: 'Battery Test', price: '+$20' },
    { id: 'tire-pressure', name: 'Tire Pressure Check', price: '+$10' },
    { id: 'visual-inspection', name: 'Visual Inspection', price: '+$30' }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  const urgencyOptions = [
    { value: 'emergency', label: 'Emergency (ASAP)', icon: '🚨', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent (Same Day)', icon: '⚡', color: 'text-orange-600' },
    { value: 'normal', label: 'Normal (1-3 Days)', icon: '📅', color: 'text-green-600' },
    { value: 'flexible', label: 'Flexible (This Week)', icon: '⏰', color: 'text-blue-600' }
  ];

  // Get current date for date input minimum
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle additional services
  const handleAdditionalServiceChange = (serviceId) => {
    setBookingData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(s => s !== serviceId)
        : [...prev.additionalServices, serviceId]
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!bookingData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!bookingData.email.trim()) newErrors.email = 'Email is required';
      if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!bookingData.address.trim()) newErrors.address = 'Address is required';
      if (!bookingData.city.trim()) newErrors.city = 'City is required';
      if (!bookingData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (step === 2) {
      if (!bookingData.vehicleMake.trim()) newErrors.vehicleMake = 'Vehicle make is required';
      if (!bookingData.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
      if (!bookingData.vehicleYear.trim()) newErrors.vehicleYear = 'Vehicle year is required';
    } else if (step === 3) {
      if (!selectedService && !bookingData.serviceType) newErrors.serviceType = 'Service type is required';
      if (!bookingData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
      if (!bookingData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setAnnounceMessage(`Moved to step ${currentStep + 1}`);
    } else {
      setAnnounceMessage('Please correct the errors before proceeding.');
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setAnnounceMessage(`Moved back to step ${currentStep - 1}`);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setAnnounceMessage('Please correct the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setAnnounceMessage('Submitting your booking...');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setAnnounceMessage('Booking confirmed!');
    }, 2000);
  };

  // Announce messages for accessibility
  useEffect(() => {
    if (announceMessage) {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = announceMessage;
      }
      // Clear message after a short delay
      const timer = setTimeout(() => setAnnounceMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [announceMessage]);


  // Success page
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your service request has been submitted successfully. We'll contact you shortly to confirm the details.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📧 Confirmation email sent<br/>
              📞 We'll call you within 30 minutes<br/>
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
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Live region for accessibility announcements */}
      <div id="live-region" aria-live="polite" className="sr-only">
        {announceMessage}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                  aria-label="Back to Services"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold">Book Your Service</h1>
                <p className="opacity-90">
                  {selectedService ? `${selectedService.title} - ${selectedService.price}` : 'Choose your service and schedule appointment'}
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
          <div className="flex items-center justify-between" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax="4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`} aria-current={currentStep === step ? "step" : false}>
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                  }`}></div>
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
            <div className="p-8" role="tabpanel" aria-labelledby="step1-tab">
              <div className="text-center mb-8">
                <User size={48} className="mx-auto mb-4 text-red-600" />
                <h2 id="step1-tab" className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                <p className="text-gray-600">Let us know how to reach you</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.fullName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter your full name"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={errors.fullName ? "fullName-error" : null}
                  />
                  {errors.fullName && <p id="fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="your.email@example.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : null}
                  />
                  {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.phone ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="(555) 123-4567"
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : null}
                  />
                  {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={bookingData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.address ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Street address where service is needed"
                    aria-invalid={errors.address ? "true" : "false"}
                    aria-describedby={errors.address ? "address-error" : null}
                  />
                  {errors.address && <p id="address-error" className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={bookingData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.city ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="City"
                    aria-invalid={errors.city ? "true" : "false"}
                    aria-describedby={errors.city ? "city-error" : null}
                  />
                  {errors.city && <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={bookingData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.zipCode ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="12345"
                    aria-invalid={errors.zipCode ? "true" : "false"}
                    aria-describedby={errors.zipCode ? "zipCode-error" : null}
                  />
                  {errors.zipCode && <p id="zipCode-error" className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Information */}
          {currentStep === 2 && (
            <div className="p-8" role="tabpanel" aria-labelledby="step2-tab">
              <div className="text-center mb-8">
                <Car size={48} className="mx-auto mb-4 text-red-600" />
                <h2 id="step2-tab" className="text-2xl font-bold text-gray-900 mb-2">Vehicle Information</h2>
                <p className="text-gray-600">Tell us about your vehicle</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vehicleMake" className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Make *
                  </label>
                  <input
                    type="text"
                    id="vehicleMake"
                    name="vehicleMake"
                    value={bookingData.vehicleMake}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.vehicleMake ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Toyota, Honda, Ford"
                    aria-invalid={errors.vehicleMake ? "true" : "false"}
                    aria-describedby={errors.vehicleMake ? "vehicleMake-error" : null}
                  />
                  {errors.vehicleMake && <p id="vehicleMake-error" className="text-red-500 text-sm mt-1">{errors.vehicleMake}</p>}
                </div>

                <div>
                  <label htmlFor="vehicleModel" className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    id="vehicleModel"
                    name="vehicleModel"
                    value={bookingData.vehicleModel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.vehicleModel ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Camry, Civic, F-150"
                    aria-invalid={errors.vehicleModel ? "true" : "false"}
                    aria-describedby={errors.vehicleModel ? "vehicleModel-error" : null}
                  />
                  {errors.vehicleModel && <p id="vehicleModel-error" className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>}
                </div>

                <div>
                  <label htmlFor="vehicleYear" className="block text-sm font-semibold text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    id="vehicleYear"
                    name="vehicleYear"
                    value={bookingData.vehicleYear}
                    onChange={handleInputChange}
                    min="1990"
                    max="2025"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                      errors.vehicleYear ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="2020"
                    aria-invalid={errors.vehicleYear ? "true" : "false"}
                    aria-describedby={errors.vehicleYear ? "vehicleYear-error" : null}
                  />
                  {errors.vehicleYear && <p id="vehicleYear-error" className="text-red-500 text-sm mt-1">{errors.vehicleYear}</p>}
                </div>

                <div>
                  <label htmlFor="vehicleColor" className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    id="vehicleColor"
                    name="vehicleColor"
                    value={bookingData.vehicleColor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="e.g., White, Black, Red"
                  />
                </div>

                <div>
                  <label htmlFor="licensePlate" className="block text-sm font-semibold text-gray-700 mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={bookingData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="ABC-1234"
                  />
                </div>

                <div>
                  <label htmlFor="mileage" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Mileage
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={bookingData.mileage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Service & Scheduling */}
          {currentStep === 3 && (
            <div className="p-8" role="tabpanel" aria-labelledby="step3-tab">
              <div className="text-center mb-8">
                <Calendar size={48} className="mx-auto mb-4 text-red-600" />
                <h2 id="step3-tab" className="text-2xl font-bold text-gray-900 mb-2">Service & Schedule</h2>
                <p className="text-gray-600">Choose your preferred time</p>
              </div>

              <div className="space-y-8">
                {/* Selected Service Display */}
                {selectedService && (
                  <div className="bg-red-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Selected Service</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{selectedService.icon}</span>
                      <div>
                        <h4 className="font-semibold">{selectedService.title}</h4>
                        <p className="text-red-600 font-bold">{selectedService.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Selection (only if no service is pre-selected) */}
                {!selectedService && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Select Service Type *
                    </label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" role="radiogroup" aria-required="true" aria-labelledby="service-type-label">
                      {allServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => {
                            setBookingData(prev => ({
                              ...prev,
                              serviceType: service.title,
                              serviceCategory: service.category,
                              estimatedPrice: service.price
                            }));
                            setErrors(prev => ({ ...prev, serviceType: '' })); // Clear error on selection
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            bookingData.serviceType === service.title
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                          role="radio"
                          aria-checked={bookingData.serviceType === service.title}
                          tabIndex={bookingData.serviceType === service.title ? 0 : -1}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{service.icon}</div>
                            <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                            <p className="text-red-600 font-bold text-sm">{service.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.serviceType && <p className="text-red-500 text-sm mt-2" id="serviceType-error">{errors.serviceType}</p>}
                  </div>
                )}

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Service Urgency
                  </label>
                  <div className="grid md:grid-cols-2 gap-4" role="radiogroup" aria-labelledby="urgency-label">
                    {urgencyOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setBookingData(prev => ({ ...prev, urgency: option.value }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          bookingData.urgency === option.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                        role="radio"
                        aria-checked={bookingData.urgency === option.value}
                        tabIndex={bookingData.urgency === option.value ? 0 : -1}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <h3 className="font-semibold">{option.label}</h3>
                            <p className={`text-sm ${option.color}`}>
                              {option.value === 'emergency' && 'Additional rush fees may apply'}
                              {option.value === 'urgent' && 'Same day service available'}
                              {option.value === 'normal' && 'Standard scheduling'}
                              {option.value === 'flexible' && 'Best rates available'}
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
                    <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={bookingData.preferredDate}
                      onChange={handleInputChange}
                      min={getCurrentDate()}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.preferredDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                      aria-invalid={errors.preferredDate ? "true" : "false"}
                      aria-describedby={errors.preferredDate ? "preferredDate-error" : null}
                    />
                    {errors.preferredDate && <p id="preferredDate-error" className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={bookingData.preferredTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.preferredTime ? 'border-red-300' : 'border-gray-200'
                      }`}
                      aria-invalid={errors.preferredTime ? "true" : "false"}
                      aria-describedby={errors.preferredTime ? "preferredTime-error" : null}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {errors.preferredTime && <p id="preferredTime-error" className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
                  </div>

                  <div>
                    <label htmlFor="alternateDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Alternate Date
                    </label>
                    <input
                      type="date"
                      id="alternateDate"
                      name="alternateDate"
                      value={bookingData.alternateDate}
                      onChange={handleInputChange}
                      min={getCurrentDate()}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="alternateTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      Alternate Time
                    </label>
                    <select
                      id="alternateTime"
                      name="alternateTime"
                      value={bookingData.alternateTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label htmlFor="problemDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                    Problem Description
                  </label>
                  <textarea
                    id="problemDescription"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="group" aria-labelledby="additional-services-label">
                    {additionalServicesOptions.map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          bookingData.additionalServices.includes(service.id)
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                        onClick={() => handleAdditionalServiceChange(service.id)}
                        role="checkbox"
                        aria-checked={bookingData.additionalServices.includes(service.id)}
                        tabIndex={0} // Make it focusable
                      >
                        <span className="font-semibold text-gray-800">{service.name}</span>
                        <span className="text-red-600 font-bold">{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Book */}
          {currentStep === 4 && (
            <div className="p-8" role="tabpanel" aria-labelledby="step4-tab">
              <div className="text-center mb-8">
                <CheckCircle size={48} className="mx-auto mb-4 text-red-600" />
                <h2 id="step4-tab" className="text-2xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
                <p className="text-gray-600">Please review your booking details</p>
              </div>

              <div className="space-y-6">
                {/* Service Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Service Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-semibold">{bookingData.serviceType || selectedService?.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Price</p>
                      <p className="font-semibold text-red-600">{bookingData.estimatedPrice || selectedService?.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold">{bookingData.preferredDate} at {bookingData.preferredTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Urgency</p>
                      <p className="font-semibold capitalize">{bookingData.urgency}</p>
                    </div>
                    {bookingData.problemDescription && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Problem Description</p>
                        <p className="font-semibold">{bookingData.problemDescription}</p>
                      </div>
                    )}
                    {bookingData.additionalServices.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Additional Services</p>
                        <ul className="list-disc list-inside ml-2 text-gray-700">
                          {bookingData.additionalServices.map(id => {
                            const service = additionalServicesOptions.find(s => s.id === id);
                            return service ? <li key={id}>{service.name} (<span className="font-bold">{service.price}</span>)</li> : null;
                          })}
                        </ul>
                      </div>
                    )}
                    {bookingData.specialInstructions && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Special Instructions</p>
                        <p className="font-semibold">{bookingData.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{bookingData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{bookingData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{bookingData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Service Address</p>
                      <p className="font-semibold">{bookingData.address}, {bookingData.city} {bookingData.zipCode}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Vehicle Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Make</p>
                      <p className="font-semibold">{bookingData.vehicleMake}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Model</p>
                      <p className="font-semibold">{bookingData.vehicleModel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-semibold">{bookingData.vehicleYear}</p>
                    </div>
                    {bookingData.vehicleColor && (
                      <div>
                        <p className="text-sm text-gray-600">Color</p>
                        <p className="font-semibold">{bookingData.vehicleColor}</p>
                      </div>
                    )}
                    {bookingData.licensePlate && (
                      <div>
                        <p className="text-sm text-gray-600">License Plate</p>
                        <p className="font-semibold">{bookingData.licensePlate}</p>
                      </div>
                    )}
                    {bookingData.mileage && (
                      <div>
                        <p className="text-sm text-gray-600">Mileage</p>
                        <p className="font-semibold">{bookingData.mileage}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Contact Preferences & Consent */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Final Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        How would you prefer us to contact you for confirmation?
                      </label>
                      <div className="flex items-center space-x-4" role="radiogroup" aria-labelledby="contact-preference-label">
                        <label htmlFor="contactPhone" className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            id="contactPhone"
                            name="contactPreference"
                            value="phone"
                            checked={bookingData.contactPreference === 'phone'}
                            onChange={handleInputChange}
                            className="form-radio text-red-600 h-5 w-5"
                          />
                          <span className="ml-2 text-gray-700 flex items-center"><Phone size={16} className="mr-1" /> Phone Call</span>
                        </label>
                        <label htmlFor="contactEmail" className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            id="contactEmail"
                            name="contactPreference"
                            value="email"
                            checked={bookingData.contactPreference === 'email'}
                            onChange={handleInputChange}
                            className="form-radio text-red-600 h-5 w-5"
                          />
                          <span className="ml-2 text-gray-700 flex items-center"><Mail size={16} className="mr-1" /> Email</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="marketingConsent" className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="marketingConsent"
                          name="marketingConsent"
                          checked={bookingData.marketingConsent}
                          onChange={handleInputChange}
                          className="form-checkbox text-red-600 h-5 w-5 rounded"
                        />
                        <span className="ml-2 text-gray-700">I agree to receive marketing communications and offers.</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Important Information / Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded">
                  <div className="flex items-center mb-2">
                    <AlertCircle size={20} className="mr-2" />
                    <p className="font-semibold">Important Information</p>
                  </div>
                  <p className="text-sm">
                    By clicking "Confirm & Book", you agree to our <a href="#" className="underline text-yellow-900 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="#" className="underline text-yellow-900 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    Estimated prices are subject to change after a full diagnosis by our mechanic.
                  </p>
                </div>
              </div>

              {/* Navigation Buttons for Step 4 */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <CheckCircle size={20} className="mr-2" />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Confirm & Book'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Services;