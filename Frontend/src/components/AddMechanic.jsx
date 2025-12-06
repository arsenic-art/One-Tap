import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  Car,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Wrench,
  Star,
  Clock,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { MechanicApplicationTerms } from "../pages/MechanicTerns";

const AddMechanicPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    specialization: [],
    certifications: "",
    workingHours: "",
    emergencyAvailable: false,
    bio: "",
    previousWork: "",
    references: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);

  const specializations = [
    "Engine Repair",
    "Brake Systems",
    "Transmission",
    "Electrical Systems",
    "Air Conditioning",
    "Tire Services",
    "Oil Changes",
    "Diagnostic Services",
    "Body Work",
    "Suspension",
  ];

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecializationChange = (specialization) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter((s) => s !== specialization)
        : [...prev.specialization, specialization],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (formData.specialization.length === 0)
      newErrors.specialization = "At least one specialization is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to join OneTap. Your application has been
            sent to our admin team for review.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📧 You'll receive an email confirmation shortly
              <br />
              ⏱️ Review process takes 2-3 business days
              <br />
              📞 We'll contact you with updates
            </p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                location: "",
                experience: "",
                specialization: [],
                certifications: "",
                workingHours: "",
                emergencyAvailable: false,
                bio: "",
                previousWork: "",
                references: "",
              });
            }}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench size={40} />
              </div>
              <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Become a certified OneTap mechanic and help revolutionize
                automotive service. Apply today to join our network of skilled
                professionals.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">$75+</div>
                  <div className="text-sm opacity-80">Per Hour</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Active Mechanics</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm opacity-80">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">Flexible</div>
                  <div className="text-sm opacity-80">Schedule</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Work With OneTap?
            </h2>
            <p className="text-xl text-gray-600">
              Join a team that values your skills and supports your growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Competitive Pay
              </h3>
              <p className="text-gray-600">
                Earn $75+ per hour with performance bonuses and tips
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Flexible Schedule
              </h3>
              <p className="text-gray-600">
                Choose your own hours and work when it suits you
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Career Growth
              </h3>
              <p className="text-gray-600">
                Continuous training and advancement opportunities
              </p>
              <div id="Mechanic-Form"></div>
            </div>
          </div>
        </div>
        {/* Application Form */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Car size={48} className="mx-auto mb-4 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Mechanic Application
              </h2>
              <p className="text-gray-600">
                Fill out the form below to join our team
              </p>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User size={20} className="mr-2" />
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.email ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="1234567890 (wihtout country code)"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location/City *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.location ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="City, State"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Wrench size={20} className="mr-2" />
                  Professional Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.experience ? "border-red-300" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specializations * (Select all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {specializations.map((spec) => (
                        <label
                          key={spec}
                          className="flex items-center p-2 rounded-lg hover:bg-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.specialization.includes(spec)}
                            onChange={() => handleSpecializationChange(spec)}
                            className="mr-2 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-sm">{spec}</span>
                        </label>
                      ))}
                    </div>
                    {errors.specialization && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.specialization}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Certifications & Licenses
                    </label>
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="List your relevant certifications, licenses, and qualifications..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Working Hours
                      </label>
                      <select
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                      >
                        <option value="">Select preferred hours</option>
                        <option value="morning">Morning (8 AM - 12 PM)</option>
                        <option value="afternoon">
                          Afternoon (12 PM - 6 PM)
                        </option>
                        <option value="evening">Evening (6 PM - 10 PM)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-8">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emergencyAvailable"
                          checked={formData.emergencyAvailable}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Available for emergency calls
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText size={20} className="mr-2" />
                  Additional Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Bio *
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.bio ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="Tell us about yourself, your experience, and why you want to join OneTap..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous Work Experience
                    </label>
                    <textarea
                      name="previousWork"
                      value={formData.previousWork}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Describe your previous automotive work experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      References
                    </label>
                    <textarea
                      name="references"
                      value={formData.references}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Provide contact information for professional references..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-12 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>

                <p className="text-sm text-gray-500 mt-4">
                  By submitting this application, you agree to our{" "}
                  <span
                    onClick={() => setShowTerms(true)}
                    className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    *terms and conditions
                  </span>
                  . All information will be kept confidential.
                </p>

                <div className="text-sm text-gray-500 mt-2">
                  After submitting, you will receive an email confirmation and our team will review your application within 2-3 business days. If selected, we will contact you for the next steps.
                </div>
              </div>
            </div>
          </div>
        </div>
        <MechanicApplicationTerms showMechanicTerms={showTerms} setShowMechanicTerms={setShowTerms} />
      </div>
    </>
  );
};

export default AddMechanicPage;
