import { useState, useEffect } from "react";
import {
  Car,
  User,
  FileText,
  CheckCircle,
  Wrench,
  Clock,
  Loader2,
  AlertCircle,
  Edit2,
  Calendar,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { MechanicApplicationTerms } from "./MechanicTerns";
import { useMechanicAuthStore } from "../../store/useAuthStore";

const SERVICE_OPTIONS = [
  "Emergency Roadside Assistance",
  "Mobile Oil Change",
  "Brake Inspection & Repair",
  "Battery Replacement",
  "Tire Services",
  "Engine Diagnostics",
  "AC System Service",
  "Pre-Purchase Inspection",
  "Preventive Maintenance",
];

const VEHICLE_OPTIONS = ["Car", "Bike", "Both"];

const AddMechanicPage = () => {
  const { mechanic } = useMechanicAuthStore();

  // Application state management
  const [existingApplication, setExistingApplication] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);

  const [formData, setFormData] = useState({
    fullStoreName: "",
    email: "",
    phone: "",
    city: "",
    experienceYears: "",
    vehicleSpecialization: "",
    servicesProvided: [],
    certifications: "",
    availability: {
      monday: { available: false, hours: "" },
      tuesday: { available: false, hours: "" },
      wednesday: { available: false, hours: "" },
      thursday: { available: false, hours: "" },
      friday: { available: false, hours: "" },
      saturday: { available: false, hours: "" },
      sunday: { available: false, hours: "" },
    },
    bio: "",
  });

  const [storeImages, setStoreImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const location = useLocation();

  // Fetch existing application on mount
  useEffect(() => {
    const fetchApplication = async () => {
      if (!mechanic) {
        setIsLoadingApplication(false);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:7777/api/mechanic-application/me",
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setExistingApplication(data);
          setIsEditMode(true);

          // Prefill form data
          setFormData({
            fullStoreName: data.fullStoreName || "",
            email: data.email || "",
            phone: data.phone || "",
            city: data.city || "",
            experienceYears: data.experienceYears?.toString() || "",
            vehicleSpecialization: data.vehicleSpecialization || "",
            servicesProvided: data.servicesProvided || [],
            certifications: data.certifications || "",
            availability: data.availability || {
              monday: { available: false, hours: "" },
              tuesday: { available: false, hours: "" },
              wednesday: { available: false, hours: "" },
              thursday: { available: false, hours: "" },
              friday: { available: false, hours: "" },
              saturday: { available: false, hours: "" },
              sunday: { available: false, hours: "" },
            },
            bio: data.bio || "",
          });

          setExistingImages(data.storeImages || []);
        } else if (res.status === 404) {
          // No application found - stay in create mode
          setIsEditMode(false);
        }
      } catch (err) {
        console.error("Error fetching application:", err);
      } finally {
        setIsLoadingApplication(false);
      }
    };

    fetchApplication();
  }, [mechanic]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      servicesProvided: prev.servicesProvided.includes(service)
        ? prev.servicesProvided.filter((s) => s !== service)
        : [...prev.servicesProvided, service],
    }));
    setErrors((prev) => ({ ...prev, servicesProvided: "" }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value,
        },
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (existingImages.length > 0) {
      setErrors((prev) => ({
        ...prev,
        storeImages:
          "Please remove the existing image before uploading a new one.",
      }));
      return;
    }

    setStoreImages([file]);
    setErrors((prev) => ({ ...prev, storeImages: "" }));
  };

  const removeExistingImage = () => {
    setExistingImages([]);
  };

  const removeNewImage = () => {
    setStoreImages([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullStoreName.trim())
      newErrors.fullStoreName = "Store name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.experienceYears)
      newErrors.experienceYears = "Experience is required";
    if (!formData.vehicleSpecialization)
      newErrors.vehicleSpecialization = "Vehicle specialization is required";
    if (formData.servicesProvided.length === 0)
      newErrors.servicesProvided = "At least one service is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("fullStoreName", formData.fullStoreName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("experienceYears", formData.experienceYears);
      formDataToSend.append(
        "vehicleSpecialization",
        formData.vehicleSpecialization
      );
      formDataToSend.append(
        "servicesProvided",
        JSON.stringify(formData.servicesProvided)
      );
      formDataToSend.append("certifications", formData.certifications);
      formDataToSend.append(
        "availability",
        JSON.stringify(formData.availability)
      );
      formDataToSend.append("bio", formData.bio);

      if (storeImages.length > 0) {
        formDataToSend.append("storeImages", storeImages[0]);
      }

      if (isEditMode) {
        if (existingImages.length === 0) {
          formDataToSend.append("deleteStoreImage", "true");
        }
      }

      const endpoint = "http://localhost:7777/api/mechanic-application";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      setIsSubmitted(true);
    } catch (err) {
      setApiError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoadingApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span>Loading application...</span>
        </div>
      </div>
    );
  }

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isEditMode ? "Application Updated!" : "Application Submitted!"}
          </h2>
          <p className="text-gray-600 mb-6">
            {isEditMode
              ? "Your application has been successfully updated."
              : "Thank you for applying to join OneTap. Your application has been sent to our admin team for review."}
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              {isEditMode ? (
                <>
                  Changes saved successfully
                  <br />
                </>
              ) : (
                <>
                  <br />
                  Review process takes 2-3 business days
                  <br />
                  We'll contact you with updates
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              if (!isEditMode) {
                window.location.reload();
              }
            }}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
          >
            {isEditMode ? "View Application" : "Return to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  const renderStatusBanner = () => {
    if (!isEditMode || !existingApplication) return null;

    const statusColors = {
      pending: "bg-yellow-50 border-yellow-300 text-yellow-800",
      approved: "bg-green-50 border-green-300 text-green-800",
      rejected: "bg-red-50 border-red-300 text-red-800",
    };

    const statusIcons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: AlertCircle,
    };

    const StatusIcon = statusIcons[existingApplication.status] || AlertCircle;
    const colorClass =
      statusColors[existingApplication.status] || statusColors.pending;

    return (
      <div
        className={`${colorClass} border-2 rounded-3xl p-5 mb-6 flex items-start gap-3`}
      >
        <StatusIcon className="flex-shrink-0 mt-0.5" size={24} />
        <div className="flex-1">
          <p className="font-semibold mb-1">
            Application Status: {existingApplication.status?.toUpperCase()}
          </p>
          <p className="text-sm">
            {existingApplication.status === "pending" &&
              "Your application is under review. You can edit your details below."}
            {existingApplication.status === "approved" &&
              "Your application has been approved! You can update your details anytime."}
            {existingApplication.status === "rejected" &&
              "Your application was rejected. Please update your information and resubmit."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
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
                {isEditMode ? <Edit2 size={40} /> : <Wrench size={40} />}
              </div>
              <h1 className="text-5xl font-bold mb-6">
                {isEditMode ? "Edit Your Application" : "Join Our Team"}
              </h1>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                {isEditMode
                  ? "Update your mechanic profile and service details"
                  : "Become a certified OneTap mechanic and help revolutionize automotive service. Apply today to join our network of skilled professionals."}
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto px-4 pb-16 pt-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Car size={48} className="mx-auto mb-4 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditMode ? "Edit Application" : "Mechanic Application"}
              </h2>
              <p className="text-gray-600">
                {isEditMode
                  ? "Update your details below"
                  : "Fill out the form below to join our team"}
              </p>
            </div>

            {renderStatusBanner()}

            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-red-700 text-sm font-medium">{apiError}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User size={20} className="mr-2" />
                  Store Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      name="fullStoreName"
                      value={formData.fullStoreName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.fullStoreName
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter your store/garage name"
                    />
                    {errors.fullStoreName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullStoreName}
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
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
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
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.city ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="e.g., Indore"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                          errors.experienceYears
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="e.g., 5"
                        min="0"
                      />
                      {errors.experienceYears && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.experienceYears}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vehicle Specialization *
                      </label>
                      <select
                        name="vehicleSpecialization"
                        value={formData.vehicleSpecialization}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-colors ${
                          errors.vehicleSpecialization
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select vehicle type</option>
                        {VEHICLE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.vehicleSpecialization && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.vehicleSpecialization}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Services Provided * (Select all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {SERVICE_OPTIONS.map((service) => (
                        <label
                          key={service}
                          className="flex items-center p-2 rounded-lg hover:bg-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.servicesProvided.includes(
                              service
                            )}
                            onChange={() => handleServiceChange(service)}
                            className="mr-2 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-sm">{service}</span>
                        </label>
                      ))}
                    </div>
                    {errors.servicesProvided && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.servicesProvided}
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

                  {/* -------------------- UPDATED IMAGE UPLOAD SECTION (SINGLE) -------------------- */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Store Image
                      </label>
                    </div>

                    {/* Show Upload Box ONLY if no image exists and no new image is selected */}
                    {existingImages.length === 0 &&
                      storeImages.length === 0 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <ImageIcon
                              className="text-gray-400 mb-2"
                              size={32}
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              Click to upload store image
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG up to 10MB
                            </span>
                          </label>
                        </div>
                      )}

                    {/* Image Preview Area */}
                    <div className="mt-4">
                      {/* Render Existing Image from DB */}
                      {existingImages.length > 0 && (
                        <div className="relative group w-full max-w-sm mx-auto">
                          <img
                            src={existingImages[0].url}
                            alt="Store Front"
                            className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-bold">
                            Current Image
                          </div>
                          <button
                            onClick={removeExistingImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                            type="button"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}

                      {/* Render Newly Selected Image */}
                      {storeImages.length > 0 && (
                        <div className="relative group w-full max-w-sm mx-auto">
                          <img
                            src={URL.createObjectURL(storeImages[0])}
                            alt="New Upload"
                            className="w-full h-48 object-cover rounded-lg border border-green-200 ring-2 ring-green-100 shadow-sm"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            New Upload
                          </div>
                          <button
                            onClick={removeNewImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                            type="button"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {errors.storeImages && (
                      <p className="text-red-500 text-sm mt-2 text-center">
                        {errors.storeImages}
                      </p>
                    )}
                  </div>
                  {/* ----------------------------------------------------------- */}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar size={20} className="mr-2" />
                  Weekly Availability
                </h3>

                <div className="space-y-3">
                  {Object.keys(formData.availability).map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <label className="flex items-center min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={formData.availability[day].available}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              day,
                              "available",
                              e.target.checked
                            )
                          }
                          className="mr-2 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-semibold capitalize">
                          {day}
                        </span>
                      </label>
                      {formData.availability[day].available && (
                        <input
                          type="text"
                          value={formData.availability[day].hours}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              day,
                              "hours",
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                          placeholder="e.g., 9 AM - 6 PM"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText size={20} className="mr-2" />
                  About You
                </h3>

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
                      <Loader2 className="animate-spin mr-2" size={20} />
                      {isEditMode ? "Updating..." : "Submitting..."}
                    </span>
                  ) : isEditMode ? (
                    "Update Application"
                  ) : (
                    "Submit Application"
                  )}
                </button>

                {!isEditMode && (
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
                )}
              </div>
            </div>
          </div>
        </div>
        <MechanicApplicationTerms
          showMechanicTerms={showTerms}
          setShowMechanicTerms={setShowTerms}
        />
      </div>
    </>
  );
};

export default AddMechanicPage;
