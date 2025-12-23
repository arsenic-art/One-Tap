import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Car,
  Bike,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const VEHICLE_OPTIONS = [
  { value: "", label: "Any Vehicle" },
  { value: "Car", label: "Car" },
  { value: "Bike", label: "Bike" },
  { value: "Both", label: "Both" },
];

const SERVICE_OPTIONS = [
  "",
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

const BrowseMechanics = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);

  const [mechanics, setMechanics] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const buildQueryString = () => {
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
    setError("");

    try {
      const qs = buildQueryString();
      const res = await fetch(`http://localhost:7777/api/mechanicsList?${qs}`, {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load mechanics");
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
      setError(err.message || "Something went wrong");
      setMechanics([]);
      setTotalCount(0);
      setTotalPages(1);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when filters/page change
  useEffect(() => {
    fetchMechanics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, vehicle, service, page, limit]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchMechanics();
  };

  const handleClearFilters = () => {
    setCity("");
    setVehicle("");
    setService("");
    setSearch("");
    setPage(1);
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

  const filteredMechanics = mechanics.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.fullStoreName && m.fullStoreName.toLowerCase().includes(q)) ||
      (m.city && m.city.toLowerCase().includes(q)) ||
      (m.bio && m.bio.toLowerCase().includes(q)) ||
      (m.servicesProvided &&
        m.servicesProvided.join(" ").toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Browse Mechanics</h1>
              <p className="opacity-90">
                Find approved mechanics by city, vehicle type, and services.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Wrench size={40} className="opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          {/* Search + Filters label */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Search (frontend only) */}
            <div className="flex-1">
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
                  placeholder="Search by store name, city, or service..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SlidersHorizontal size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600 font-semibold">
                Filters
              </span>
            </div>
          </div>

          {/* Filter controls */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* City */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                City
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

            {/* Vehicle specialization */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Vehicle Type
              </label>
              <div className="relative">
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                >
                  {VEHICLE_OPTIONS.map((opt) => (
                    <option key={opt.value || "any"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {vehicle === "Bike" ? <Bike size={16} /> : <Car size={16} />}
                </div>
              </div>
            </div>

            {/* Service */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
              >
                <option value="">Any Service</option>
                {SERVICE_OPTIONS.filter(Boolean).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-1 flex md:flex-col gap-2 items-stretch justify-end">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-gray-600">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading mechanics...</span>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4">
              <AlertCircle size={18} className="mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && mechanics.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              <p className="font-semibold mb-1">No mechanics found</p>
              <p className="text-sm">
                Try changing the city, vehicle type, or service filters.
              </p>
            </div>
          )}

          {/* List */}
          {!isLoading && !error && mechanics.length > 0 && (
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
                    console.log(mec);
                  const firstImage =
                    mec.storeImages && mec.storeImages.length > 0
                      ? mec.storeImages[0].url
                      : null;

                  return (
                    <div
                      key={mec._id}
                      className="border-2 border-gray-100 rounded-2xl p-4 hover:border-red-300 hover:shadow-md transition-all duration-200 flex flex-col"
                    >
                      {/* Top: image + basic info */}
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
                          <p className="text-xs text-gray-500 mt-1">
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
                          <div className="mb-3">
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

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <span className="text-[11px] text-gray-500">
                          Approved mechanic • Experience-based listing
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/service-request/${mec.mechanicID}`, {
                              state: { mechanic: mec },
                            })
                          }
                          className="text-xs bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1.5 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
                        >
                          View &amp; Request
                        </button>
                      </div>
                    </div>
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
      </div>
    </div>
  );
};

export default BrowseMechanics;
