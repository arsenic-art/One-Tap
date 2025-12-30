import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const API_BASE = import.meta.env.VITE_API_BASE_LINK + "/api";

const AddressManagement = () => {
  const navigate = useNavigate();
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!user && !isCheckingAuth) {
      checkAuth();
    }
  }, [user, isCheckingAuth, checkAuth]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/address`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAddresses();
    }
  }, [user?._id]);

  const resetForm = () => {
    setFormData({
      fullName: user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`
        : "",
      phone: user?.phoneNumber || "",
      email: user?.email || "",
      serviceLine: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: addresses.length === 0,
    });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
  };

  const handleEdit = (addr) => {
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email,
      serviceLine: addr.serviceLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setEditingId(addr._id);
    setShowForm(true);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validatePincode = (pincode) => /^[1-9][0-9]{5}$/.test(pincode);

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone))
      errors.phone = "Enter valid 10-digit Indian mobile number";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Enter valid email address";

    if (!formData.serviceLine.trim())
      errors.serviceLine = "Address line is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";

    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!validatePincode(formData.pincode))
      errors.pincode = "Enter valid 6-digit pincode";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormErrors({});

    if (!validateForm()) {
      setError("Please fix the highlighted errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true); 
      const url = editingId
        ? `${API_BASE}/address/${editingId}`
        : `${API_BASE}/address`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFormErrors(data.errors);
          setError("Please fix the errors highlighted below");
        } else {
          throw new Error(data.message || "Failed to save address");
        }
        return;
      }

      await fetchAddresses();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`${API_BASE}/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/address/${id}/set-default`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to set default");
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) setFormErrors({ ...formErrors, [field]: "" });
    setError("");
  };

  if (isCheckingAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="animate-spin text-gray-600" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Saved Addresses</h1>
              <p className="text-sm opacity-90">
                Manage your service locations
              </p>
            </div>
          </div>
          <MapPin size={32} className="opacity-90" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center animate-shake">
            <AlertCircle size={16} className="mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mb-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-red-600 text-sm font-bold border-2 border-red-100 hover:border-red-500 hover:bg-red-50 transition-all shadow-sm"
          >
            <Plus size={18} />
            Add New Address
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              {editingId ? (
                <Edit2 size={18} className="text-blue-500" />
              ) : (
                <Plus size={18} className="text-green-500" />
              )}
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Kumar"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.fullName
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) handleInputChange("phone", value);
                    }}
                    maxLength={10}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.phone
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Address Line */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formErrors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="House No, Building, Street Area"
                  value={formData.serviceLine}
                  onChange={(e) =>
                    handleInputChange("serviceLine", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formErrors.serviceLine
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                  }`}
                />
                {formErrors.serviceLine && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.serviceLine}
                  </p>
                )}
              </div>

              {/* City, State, Pincode */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.city
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.state
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {formErrors.state && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit Pincode"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6)
                        handleInputChange("pincode", value);
                    }}
                    maxLength={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      formErrors.pincode
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  />
                  {formErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer w-fit border border-gray-200 hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 font-medium text-sm">
                  Set as default address
                </span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingId ? "Update" : "Save"} Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Loader2 className="animate-spin mb-3 text-red-500" size={32} />
            <p>Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No addresses found
            </h3>
            <p className="text-gray-500 text-sm">
              Add a new address to manage your service locations better.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-white rounded-3xl p-6 transition-all hover:shadow-lg group relative overflow-hidden ${
                  addr.isDefault
                    ? "border-2 border-emerald-400 shadow-md"
                    : "border border-gray-100 shadow-sm"
                }`}
              >
                {addr.isDefault && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                    DEFAULT
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-lg text-gray-900">
                      {addr.fullName}
                    </h4>
                    <p className="text-gray-600 font-medium">
                      {addr.serviceLine}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {addr.city}, {addr.state} -{" "}
                      <span className="text-gray-900 font-semibold">
                        {addr.pincode}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        📞 {addr.phone}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                        ✉️ {addr.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 self-start mt-4 md:mt-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Set as default"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManagement;
