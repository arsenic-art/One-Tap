import { useEffect, useState } from "react";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
  IndianRupee,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMechanicAuthStore } from "../../store/useAuthStore";

const API_BASE = "http://localhost:7777/api";

const MechanicDashboard = () => {
  const navigate = useNavigate();
  const { mechanic, isCheckingAuth, checkAuth } = useMechanicAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState({
    today: 0,
    active: 0,
    completed: 0,
  });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!mechanic && !isCheckingAuth) {
      checkAuth();
    }
  }, [mechanic, isCheckingAuth, checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && mechanic && mechanic.role !== "mechanic") {
      navigate("/profile");
    }
  }, [mechanic, isCheckingAuth, navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/mechanicdash/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await res.json();

      setRequests(data.requests || []);
      setSummary(data.summary || { today: 0, active: 0, completed: 0 });
      setLastRefresh(new Date());
    } catch (err) {
      console.error("fetchRequests error:", err);
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mechanic && mechanic.role === "mechanic") {
      fetchRequests();
    }
  }, [mechanic]);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/mechanicdash/requests/${id}/accept`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to accept request");
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
      );

      fetchRequests();
    } catch (err) {
      console.error("Accept error:", err);
      alert(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/mechanicdash/requests/${id}/complete`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to complete request");
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r))
      );

      fetchRequests();
    } catch (err) {
      console.error("Complete error:", err);
      alert(err.message);
    }
  };

  const handleCardClick = (reqId, e) => {
    // if (e.target.closest("button")) return;
    // navigate(`/service-request/${encodeURIComponent(reqId)}`);
  };

  const getRefreshTime = () => {
    const now = new Date();
    const diff = Math.floor((now - lastRefresh) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastRefresh.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isCheckingAuth || !mechanic) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center text-gray-600">
          <Clock className="animate-spin mr-2" size={18} />
          <span>Loading mechanic dashboard...</span>
        </div>
      </div>
    );
  }

  const fullName =
    `${mechanic.firstName || ""} ${mechanic.lastName || ""}`.trim() ||
    "Mechanic";

  const newRequests = requests.filter((r) => r.status === "new");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Top section: title + refresh button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="text-red-600" size={22} />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Mechanic Dashboard
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              View new service requests and manage active jobs.
            </p>
          </div>

          {/* Refresh button */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Updated {getRefreshTime()}
            </span>
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Summary cards - 3 cards only*/}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl shadow-md p-4 border-2 border-amber-200">
            <p className="text-xs text-gray-500 mb-1">Today&apos;s requests</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-gray-900">
                {summary.today}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full font-semibold">
                <Bell size={14} />
                {newRequests.length} New
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-4 border-2 border-sky-200">
            <p className="text-xs text-gray-500 mb-1">Active jobs</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-gray-900">
                {summary.active}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded-full font-semibold">
                <Briefcase size={14} />
                Working
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-4">
            <p className="text-xs text-gray-500 mb-1">Completed jobs</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-gray-900">
                {summary.completed}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-semibold">
                <CheckCircle2 size={14} />
                Done
              </span>
            </div>
          </div>
        </div>

        {/* Requests list */}
        <div className="bg-white rounded-3xl shadow-md p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900">
              Service requests
            </p>
            <p className="text-xs text-gray-500">
              Click refresh to check for new requests
            </p>
          </div>

          {requests.length === 0 && !loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              <Wrench className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-semibold mb-1">No requests yet</p>
              <p className="text-xs">New service requests will appear here</p>
            </div>
          ) : loading && requests.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              <Clock className="animate-spin mx-auto mb-2" size={24} />
              <p>Loading requests...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={(e) => handleCardClick(req.id, e)}
                  className="border-2 border-gray-100 rounded-2xl p-4 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* Customer name + vehicle */}
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {req.customerName} • {req.vehicle}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">{req.issue}</p>

                      {/* Critical info: Location + Amount */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <MapPin size={13} className="text-red-500" />
                          {req.location}
                        </span>
                        {req.amount > 0 && (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                            <IndianRupee size={13} />
                            {req.amount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Single action button based on status - 48x48px minimum */}
                    <div className="flex flex-col items-end">
                      {req.status === "new" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(req.id);
                          }}
                          className="min-h-[48px] min-w-[100px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 shadow-md active:scale-95 transition-transform"
                        >
                          Accept
                        </button>
                      )}
                      {req.status === "accepted" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComplete(req.id);
                          }}
                          className="min-h-[48px] min-w-[100px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-semibold hover:from-sky-600 hover:to-sky-700 shadow-md active:scale-95 transition-transform"
                        >
                          Complete
                        </button>
                      )}
                      {req.status === "completed" && (
                        <span className="min-h-[48px] flex items-center text-sm text-emerald-700 font-semibold gap-1.5 px-3">
                          <CheckCircle2 size={16} />
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-gray-500 text-center">
          Logged in as <span className="font-semibold">{fullName}</span> (
          {mechanic.email})
        </p>
      </div>
    </div>
  );
};

export default MechanicDashboard;
