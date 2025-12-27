import { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Send,
  Car,
  Bike,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const DEFAULT_LIMIT = 10;

const FindMechanicAndRequest = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);

  const [mechanics, setMechanics] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [vehicleTypeForRequest, setVehicleTypeForRequest] = useState("");
  const [serviceTypeForRequest, setServiceTypeForRequest] = useState("");
  const [message, setMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Address checking state
  const [hasAddress, setHasAddress] = useState(false);
  const [checkingAddress, setCheckingAddress] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const buildMechanicQueryString = () => {
    const params = new URLSearchParams();
    if (city.trim()) params.append("city", city.trim());
    if (vehicle) params.append("vehicle", vehicle);
    if (service) params.append("service", service);
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    return params.toString();
  };

  const fetchMechanics = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const qs = buildMechanicQueryString();
      const res = await fetch(`http://localhost:7777/api/mechanicsList?${qs}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error || json.message || "Failed to load mechanics"
        );
      }

      setMechanics(json.data || []);

      if (json.pagination) {
        const p = json.pagination;
        setPage(p.page || 1);
        setTotalCount(p.total || 0);
        setTotalPages(p.totalPages || 1);
        setHasNextPage(!!p.hasNextPage);
        setHasPrevPage(!!p.hasPrevPage);
      } else {
        setTotalCount((json.data || []).length);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (err) {
      setLoadError(err.message || "Something went wrong");
      setMechanics([]);
      setTotalCount(0);
      setTotalPages(1);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const [hasSearched, setHasSearched] = useState(false);

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

  useEffect(() => {
    if (hasSearched) {
      fetchMechanics();
    }
    // eslint-disable-next-line
  }, [city, vehicle, service, page, limit]);

  const handleSearchMechanics = () => {
    setHasSearched(true);
    setPage(1);
    fetchMechanics();
  };

  const handleClearAll = () => {
    setCity("");
    setVehicle("");
    setService("");
    setProblemDescription("");
    setSearch("");
    setHasSearched(false);
    setPage(1);
    setMechanics([]);
    setTotalCount(0);
    setTotalPages(1);
    setSelectedMechanic(null);
    setRequestError("");
    setRequestSuccess("");
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  const filteredMechanics = useMemo(() => {
    if (!search.trim()) return mechanics;
    const q = search.toLowerCase();
    return mechanics.filter((m) => {
      return (
        (m.fullStoreName && m.fullStoreName.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q)) ||
        (m.bio && m.bio.toLowerCase().includes(q)) ||
        (m.servicesProvided &&
          m.servicesProvided.join(" ").toLowerCase().includes(q))
      );
    });
  }, [mechanics, search]);

  const availableServicesForRequest = useMemo(() => {
    if (selectedMechanic?.servicesProvided?.length) {
      return SERVICE_TYPES.filter((s) =>
        selectedMechanic.servicesProvided.includes(s)
      );
    }
    return SERVICE_TYPES;
  }, [selectedMechanic]);

  const maxLength = 2000;

  const openRequestForm = (mechanic) => {
    setSelectedMechanic(mechanic);
    setRequestError("");
    setRequestSuccess("");
    setVehicleTypeForRequest("");
    setServiceTypeForRequest("");

    const pieces = [];
    if (service) {
      pieces.push(`Requested service: ${service}.`);
    }
    if (vehicle) {
      pieces.push(`Vehicle type: ${vehicle}.`);
    }
    if (problemDescription.trim()) {
      pieces.push(`Details: ${problemDescription.trim()}`);
    }
    setMessage(pieces.join(" "));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestError("");
    setRequestSuccess("");

    if (!selectedMechanic?._id) {
      setRequestError("Please select a mechanic first.");
      return;
    }

    if (!vehicleTypeForRequest || !serviceTypeForRequest) {
      setRequestError("Please select both vehicle type and service type.");
      return;
    }

    // Check address before submission
    if (!hasAddress) {
      setRequestError("Please add a service address before sending request.");
      return;
    }

    const ok = window.confirm(
      "Once you send this request, the message cannot be edited.\n\nAre you sure you want to submit?"
    );
    if (!ok) return;

    setIsSubmittingRequest(true);

    try {
      const res = await fetch(
        "http://localhost:7777/api/service-requests/requests",
        {
          method: "POST",
          credentials: "include",
          headers:{ "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mechanicId: selectedMechanic.mechanicID,
            problemType: vehicleTypeForRequest,
            serviceType: serviceTypeForRequest,
            message,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create request");
      }

      setRequestSuccess("Service request sent to mechanic.");

      // Navigate to bookings after 2 seconds
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      setRequestError(err.message || "Something went wrong");
    } finally {
      setIsSubmittingRequest(false);
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
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Find a Mechanic &amp; Send Request
            </h1>
            <p className="text-sm opacity-90">
              Tell us what you need, browse matching mechanics, then send a
              service request.
            </p>
          </div>
          <Wrench size={40} className="opacity-90" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Address warning banner */}
        {!hasAddress && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">
                Service Address Required
              </p>
              <p className="text-sm text-amber-800 mb-3">
                You need to add a service address before sending any request. This helps mechanics locate you quickly.
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-start gap-3">
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

        {/* Step 1: Problem + search filters */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            1. What do you need help with?
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                City *
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Indore"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Vehicle Type (optional)
              </label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
              >
                <option value="">Any Vehicle</option>
                {VEHICLE_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Service (optional)
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
              >
                <option value="">Any Service</option>
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Search in results
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by name, city, or service..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Briefly describe the issue (optional)
            </label>
            <div className="relative">
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                placeholder="Example: Bike not starting, clicking sound..."
              />
              <div className="pointer-events-none absolute bottom-2 right-3 text-xs font-medium bg-white/80 px-1 rounded">
                <span
                  className={
                    problemDescription.length >= 300
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                >
                  {problemDescription.length}
                </span>
                /300
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              This will be pre-filled when you send the request.
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={handleClearAll}
              className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSearchMechanics}
              disabled={!city.trim()}
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Find Mechanics
            </button>
          </div>
        </div>

        {/* Step 2: Mechanics list */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            2. Choose a mechanic
          </h2>

          {isLoading && (
            <div className="flex items-center justify-center py-8 text-gray-600">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading mechanics...</span>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4">
              <AlertCircle size={18} className="mr-2" />
              <span className="text-sm">{loadError}</span>
            </div>
          )}

          {!isLoading &&
            !loadError &&
            hasSearched &&
            filteredMechanics.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <p className="font-semibold mb-1">No mechanics found</p>
                <p className="text-sm">
                  Try changing the city, vehicle type, or service filters.
                </p>
              </div>
            )}

          {!isLoading && !loadError && filteredMechanics.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <span>
                  Showing{" "}
                  <span className="font-semibold">
                    {filteredMechanics.length}
                  </span>{" "}
                  of <span className="font-semibold">{totalCount}</span>{" "}
                  mechanics
                </span>
                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  Sorted by experience (high → low)
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredMechanics.map((mec) => {
                  const firstImage =
                    mec.storeImages && mec.storeImages.length > 0
                      ? mec.storeImages[0].url
                      : null;

                  const isSelected =
                    selectedMechanic && selectedMechanic._id === mec._id;

                  return (
                    <button
                      key={mec._id}
                      type="button"
                      onClick={() => openRequestForm(mec)}
                      className={`text-left border-2 rounded-2xl p-4 transition-all duration-200 flex flex-col ${
                        isSelected
                          ? "border-red-500 bg-red-50 shadow-md"
                          : "border-gray-100 hover:border-red-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        {firstImage && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={firstImage}
                              alt={mec.fullStoreName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {mec.fullStoreName || "Unnamed Garage"}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            {mec.city}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            {mec.vehicleSpecialization === "Bike" && (
                              <Bike size={14} className="mr-1" />
                            )}
                            {mec.vehicleSpecialization === "Car" && (
                              <Car size={14} className="mr-1" />
                            )}
                            Vehicle:{" "}
                            <span className="font-semibold">
                              {mec.vehicleSpecialization || "Both"}
                            </span>
                          </p>
                          {mec.experienceYears != null && (
                            <p className="text-xs text-gray-500">
                              Experience:{" "}
                              <span className="font-semibold">
                                {mec.experienceYears} years
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {mec.bio && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                          {mec.bio}
                        </p>
                      )}

                      {mec.servicesProvided &&
                        mec.servicesProvided.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Services Provided:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {mec.servicesProvided.slice(0, 5).map((srv) => (
                                <span
                                  key={srv}
                                  className="text-[11px] bg-red-50 text-red-700 px-2 py-1 rounded-full"
                                >
                                  {srv}
                                </span>
                              ))}
                              {mec.servicesProvided.length > 5 && (
                                <span className="text-[11px] text-gray-500">
                                  +{mec.servicesProvided.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">
                          Click to select and send request
                        </span>
                        {isSelected && (
                          <CheckCircle size={18} className="text-green-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-xs text-gray-500">
                  Page <span className="font-semibold">{page}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                    className="flex items-center px-3 py-1.5 rounded-xl border-2 border-gray-200 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="flex items-center px-3 py-1.5 rounded-xl border-2 border-gray-200 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200"
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Step 3: Request form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            3. Send service request
          </h2>

          {!selectedMechanic && (
            <p className="text-sm text-gray-600">
              Select a mechanic above to send a request.
            </p>
          )}

          {selectedMechanic && (
            <>
              <div className="mb-4 flex items-start gap-3">
                {selectedMechanic.storeImages &&
                  selectedMechanic.storeImages.length > 0 && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={selectedMechanic.storeImages[0].url}
                        alt={selectedMechanic.fullStoreName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedMechanic.fullStoreName}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {selectedMechanic.city}
                  </p>
                </div>
              </div>

              {requestError && (
                <div className="mb-3 flex items-center bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  <span>{requestError}</span>
                </div>
              )}

              {requestSuccess && (
                <div className="mb-3 flex items-center bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm">
                  <CheckCircle size={16} className="mr-2" />
                  <span>{requestSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={vehicleTypeForRequest}
                    onChange={(e) => setVehicleTypeForRequest(e.target.value)}
                    disabled={!hasAddress}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Service Type *
                  </label>
                  <select
                    value={serviceTypeForRequest}
                    onChange={(e) => setServiceTypeForRequest(e.target.value)}
                    disabled={!hasAddress}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select service</option>
                    {availableServicesForRequest.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {selectedMechanic?.servicesProvided?.length > 0 && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Only services provided by this mechanic are shown.
                    </p>
                  )}
                </div>

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
                      className="w-full px-3 py-2 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Explain the issue in detail..."
                    />
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
                  <p className="text-[11px] text-gray-500 mt-1">
                    This will be sent to the mechanic as-is and cannot be edited
                    later.
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingRequest || !hasAddress}
                    className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmittingRequest ? (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMechanicAndRequest;
