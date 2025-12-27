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

const AddressManagement = () => {
  const navigate = useNavigate();
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const res = await fetch("http://localhost:7777/api/address", {
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
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      fullName: user?.firstName + " " + user?.lastName || "",
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
  };

  // Validation functions
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone);
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/; // 6-digit Indian pincode
    return pincodeRegex.test(pincode);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Enter valid 10-digit Indian mobile number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter valid email address";
    }

    if (!formData.serviceLine.trim()) {
      errors.serviceLine = "Address line is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.state) {
      errors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!validatePincode(formData.pincode)) {
      errors.pincode = "Enter valid 6-digit pincode";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fix the errors before submitting");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:7777/api/address/${editingId}`
        : "http://localhost:7777/api/address";

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save address");

      await fetchAddresses();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;

    try {
      const res = await fetch(`http://localhost:7777/api/address/${id}`, {
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
      const res = await fetch(
        `http://localhost:7777/api/address/${id}/set-default`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to set default");

      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
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
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6">
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
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all shadow-md"
          >
            <Plus size={16} />
            Add New Address
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                      formErrors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone (10 digits) *"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only digits
                      if (value.length <= 10) {
                        handleInputChange("phone", value);
                      }
                    }}
                    maxLength={10}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                      formErrors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                    formErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="House No, Building Name, Street *"
                  value={formData.serviceLine}
                  onChange={(e) =>
                    handleInputChange("serviceLine", e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                    formErrors.serviceLine
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                />
                {formErrors.serviceLine && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.serviceLine}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                      formErrors.city
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                      formErrors.state
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    } ${!formData.state ? "text-gray-400" : "text-gray-900"}`}
                  >
                    <option value="">Select State *</option>
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
                  <input
                    type="text"
                    placeholder="Pincode (6 digits) *"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only digits
                      if (value.length <= 6) {
                        handleInputChange("pincode", value);
                      }
                    }}
                    maxLength={6}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none text-sm ${
                      formErrors.pincode
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                  />
                  {formErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Set as default address</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all shadow-md"
                >
                  {editingId ? "Update" : "Save"} Address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address list */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <Loader2 className="animate-spin mx-auto mb-2" size={24} />
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-8 text-center">
            <MapPin className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-gray-600 text-sm">
              No saved addresses yet. Add one to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-white rounded-3xl shadow-md p-5 ${
                  addr.isDefault ? "border-2 border-emerald-400" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-gray-900">{addr.fullName}</p>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold">
                          <CheckCircle size={12} />
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{addr.serviceLine}</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {addr.phone} • {addr.email}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Set as default"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
