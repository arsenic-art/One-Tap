import React, { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  User,
  Wrench,
  RefreshCw,
} from "lucide-react";

const STATUS_STYLES = {
  pending: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    pill: "bg-amber-100 text-amber-800",
    label: "Pending",
  },
  accepted: {
    text: "text-green-700",
    bg: "bg-green-50",
    pill: "bg-green-100 text-green-800",
    label: "Accepted",
  },
  rejected: {
    text: "text-red-700",
    bg: "bg-red-50",
    pill: "bg-red-100 text-red-800",
    label: "Rejected",
  },
};

const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const UserServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:7777/api/service-requests/requests/user",
        {
          credentials: "include",
        }
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to load service requests");
      }

      setRequests(json.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              My Service Requests
            </h1>
            <p className="text-sm opacity-90">
              Track all requests sent to mechanics and see their status.
            </p>
          </div>
          <Wrench size={40} className="opacity-90" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Total requests:{" "}
            <span className="font-semibold">{requests.length}</span>
          </p>
          <button
            type="button"
            onClick={fetchRequests}
            disabled={isLoading}
            className="flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <RefreshCw
              size={14}
              className={isLoading ? "mr-1 animate-spin" : "mr-1"}
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-10 text-gray-600">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span>Loading your requests...</span>
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
        {!isLoading && !error && requests.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <p className="text-lg font-semibold text-gray-800 mb-1">
              No service requests yet
            </p>
            <p className="text-sm text-gray-600">
              Once you send a request to a mechanic, it will appear here.
            </p>
          </div>
        )}

        {/* List */}
        {!isLoading && !error && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((req) => {
              const mechanic = req.mechanicId || {};
              const statusKey = req.status || "pending";
              const statusStyle =
                STATUS_STYLES[statusKey] || STATUS_STYLES.pending;

              return (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5"
                >
                  {/* Top row: status + created time */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${statusStyle.pill}`}
                      >
                        {statusKey === "pending" && (
                          <Clock size={12} className="mr-1" />
                        )}
                        {statusKey === "accepted" && (
                          <CheckCircle size={12} className="mr-1" />
                        )}
                        {statusKey === "rejected" && (
                          <AlertCircle size={12} className="mr-1" />
                        )}
                        {statusStyle.label}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Created: {formatDateTime(req.createdAt)}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Updated: {formatDateTime(req.updatedAt)}
                    </span>
                  </div>

                  {/* Mechanic info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      {mechanic.profileImage ? (
                        <img
                          src={mechanic.profileImage}
                          alt={`${mechanic.firstName} ${mechanic.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {mechanic.firstName || mechanic.lastName
                          ? `${mechanic.firstName || ""} ${
                              mechanic.lastName || ""
                            }`.trim()
                          : "Mechanic"}
                      </p>
                      {mechanic.email && (
                        <p className="text-xs text-gray-600 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {mechanic.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Request details */}
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Vehicle Type</p>
                      <p className="font-semibold text-gray-800">
                        {req.problemType || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Service Type</p>
                      <p className="font-semibold text-gray-800">
                        {req.serviceType || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className={`font-semibold ${statusStyle.text}`}>
                        {statusStyle.label}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Your Message</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">
                        {req.message}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserServiceRequests;
