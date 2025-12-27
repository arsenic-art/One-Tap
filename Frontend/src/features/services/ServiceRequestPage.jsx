import { useState, useMemo, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Car,
  Bike,
  Wrench,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const VEHICLE_TYPES = ["Bike", "Car", "Both"];

const SERVICE_TYPES = [
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

const ServiceRequestPage = () => {
  const maxLength = 2000;
  const { mechanicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const mechanic = location.state?.mechanic || null;

  const [problemType, setProblemType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Address checking state
  const [hasAddress, setHasAddress] = useState(false);
  const [checkingAddress, setCheckingAddress] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const availableServices = useMemo(() => {
    if (mechanic?.servicesProvided?.length) {
      return SERVICE_TYPES.filter((s) => mechanic.servicesProvided.includes(s));
    }
    return SERVICE_TYPES;
  }, [mechanic]);

  // Check for saved address on mount
  useEffect(() => {
    const checkAddress = async () => {
      try {
        const res = await fetch("http://localhost:7777/api/address/default", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setDefaultAddress(data.address);
          setHasAddress(true);
        } else {
          setHasAddress(false);
        }
      } catch (err) {
        console.error("Address check error:", err);
        setHasAddress(false);
      } finally {
        setCheckingAddress(false);
      }
    };

    checkAddress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!problemType || !serviceType) {
      setError("Please select both vehicle type and service type.");
      return;
    }

    // Check address again before submit
    if (!hasAddress) {
      setError("Please add a service address before sending request.");
      return;
    }

    // Extra confirmation
    const ok = window.confirm(
      "Once you send this request, the message cannot be edited.\n\nAre you sure you want to submit?"
    );
    if (!ok) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        "http://localhost:7777/api/service-requests/requests",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mechanicId,
            problemType,
            serviceType,
            message,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create request");
      }

      setSuccess("Service request sent to mechanic.");
      setMessage("");
      
      // Navigate to bookings after 2 seconds
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Send Service Request</h1>
              <p className="opacity-90 text-sm">
                Describe your problem and send a request directly to this
                mechanic.
              </p>
            </div>
          </div>
          <Wrench size={40} className="opacity-90" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Address warning banner */}
        {!hasAddress && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">
                Service Address Required
              </p>
              <p className="text-sm text-amber-800 mb-3">
                You need to add a service address before sending a request. This helps the mechanic locate you quickly.
              </p>
              <button
                onClick={() => navigate("/addresses")}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-md"
              >
                Add Service Address
              </button>
            </div>
          </div>
        )}

        {/* Current address display (if exists) */}
        {hasAddress && defaultAddress && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-start gap-3">
            <MapPin className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-emerald-900 mb-1">
                Service Location
              </p>
              <p className="text-sm text-emerald-800">
                {defaultAddress.serviceLine}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
              </p>
              <button
                onClick={() => navigate("/addresses")}
                className="text-xs text-emerald-700 hover:text-emerald-900 underline mt-1"
              >
                Change address
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-6">
          {/* Mechanic summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Mechanic Details
              </h2>
              {mechanic ? (
                <>
                  <div className="flex items-start gap-3 mb-3">
                    {mechanic.storeImages &&
                      mechanic.storeImages.length > 0 && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={mechanic.storeImages[0].url}
                            alt={mechanic.fullStoreName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {mechanic.fullStoreName}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        {mechanic.city}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="flex items-center">
                          {mechanic.vehicleSpecialization === "Bike" && (
                            <Bike size={14} className="mr-1" />
                          )}
                          {mechanic.vehicleSpecialization === "Car" && (
                            <Car size={14} className="mr-1" />
                          )}
                          Vehicle:{" "}
                          <span className="font-semibold ml-1">
                            {mechanic.vehicleSpecialization || "Both"}
                          </span>
                        </span>
                      </p>
                      {mechanic.experienceYears != null && (
                        <p className="text-xs text-gray-500">
                          Experience:{" "}
                          <span className="font-semibold">
                            {mechanic.experienceYears} years
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {mechanic.bio && (
                    <p className="text-xs text-gray-600 mb-3">{mechanic.bio}</p>
                  )}

                  {mechanic.servicesProvided &&
                    mechanic.servicesProvided.length > 0 && (
                      <div>
                        <p className="text-[11px] text-gray-500 mb-1">
                          Key Services:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {mechanic.servicesProvided.slice(0, 6).map((srv) => (
                            <span
                              key={srv}
                              className="text-[11px] bg-red-50 text-red-700 px-2 py-1 rounded-full"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <p className="text-xs text-gray-600">
                  Mechanic details not loaded from previous page, but you can
                  still send a request using the URL id.
                </p>
              )}
            </div>
          </div>

          {/* Request form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Describe Your Problem
              </h2>

              {error && (
                <div className="mb-4 flex items-center bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 flex items-center bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm">
                  <CheckCircle size={16} className="mr-2" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                    required
                    disabled={!hasAddress}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select vehicle type</option>
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Service Type *
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    disabled={!hasAddress}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select service</option>
                    {availableServices.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {mechanic?.servicesProvided?.length && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Only services provided by this mechanic are shown.
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Describe the Issue
                  </label>

                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      maxLength={maxLength}
                      disabled={!hasAddress}
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Example: Bike not starting, makes clicking sound when I press the starter..."
                    />

                    {/* character counter */}
                    <div className="pointer-events-none absolute bottom-2 right-3 text-xs font-medium bg-white/80 px-1 rounded">
                      <span
                        className={
                          message.length >= maxLength
                            ? "text-red-500"
                            : "text-gray-400"
                        }
                      >
                        {message.length}
                      </span>
                      /{maxLength}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2">
                    This message will be sent to the mechanic exactly as
                    written. It cannot be edited after you submit the request.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !hasAddress}
                    className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;
