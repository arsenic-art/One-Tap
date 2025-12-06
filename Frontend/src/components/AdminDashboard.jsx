import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Eye, Check, X, User, Phone, Mail, MapPin, Wrench, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const AdminDashboard = () => {
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isUser, setIsUser] = useState(false);

  // Mock data matching AddMechanicPage form structure
  useEffect(() => {
    const mockMechanics = [
      {
        id: 1,
        fullName: "Rajesh Kumar Singh",
        email: "rajesh.kumar@email.com",
        phone: "9876543210",
        location: "Mumbai, Maharashtra",
        experience: "3-5",
        specialization: ["Engine Repair", "Brake Systems", "Diagnostic Services"],
        certifications: "ASE Certified Master Technician, Honda Service Certification",
        workingHours: "flexible",
        emergencyAvailable: true,
        bio: "Experienced automotive technician with over 5 years in the industry. Specialized in engine diagnostics and repair with extensive experience in both domestic and imported vehicles.",
        previousWork: "Senior Mechanic at AutoMax Service Center (2019-2024), Junior Technician at City Motors (2018-2019)",
        references: "Manager John Doe - AutoMax Service Center: +91-9876543211, Supervisor Sarah Smith - City Motors: +91-9876543212",
        status: "pending",
        appliedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        fullName: "Amit Sharma",
        email: "amit.sharma@email.com",
        phone: "8765432109",
        location: "Delhi, India",
        experience: "1-2",
        specialization: ["Electrical Systems", "Air Conditioning", "Oil Changes"],
        certifications: "NATEF Certification, AC System Specialist Certificate",
        workingHours: "morning",
        emergencyAvailable: false,
        bio: "Detail-oriented mechanic with passion for automotive electrical systems and climate control. Quick learner with strong problem-solving skills.",
        previousWork: "Apprentice at Delhi Auto Works (2022-2024), Trainee at Quick Service Auto (2021-2022)",
        references: "Lead Technician Raj Patel - Delhi Auto Works: +91-8765432110",
        status: "approved",
        appliedAt: "2024-01-10T14:20:00Z"
      },
      {
        id: 3,
        fullName: "Suresh Patel",
        email: "suresh.patel@email.com",
        phone: "7654321098",
        location: "Ahmedabad, Gujarat",
        experience: "10+",
        specialization: ["Transmission", "Suspension", "Body Work"],
        certifications: "Master Automotive Technician, Transmission Specialist Certification, Welding Certificate",
        workingHours: "afternoon",
        emergencyAvailable: true,
        bio: "Veteran mechanic with over 12 years of experience in heavy-duty automotive repair. Expert in transmission systems and structural repairs.",
        previousWork: "Workshop Owner - Patel Auto Repair (2015-2024), Senior Mechanic at Gujarat Motors (2012-2015)",
        references: "Business Partner Kiran Modi: +91-7654321099, Former Manager Deepak Shah - Gujarat Motors: +91-7654321100",
        status: "rejected",
        appliedAt: "2024-01-05T09:15:00Z"
      }
    ];
    setMechanics(mockMechanics);
  }, []);

  const filteredMechanics = mechanics.filter(mechanic => {
    if (filter === "all") return true;
    return mechanic.status === filter;
  });

  const handleViewDetails = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (mechanicId, newStatus) => {
    setMechanics(prev => 
      prev.map(mechanic => 
        mechanic.id === mechanicId 
          ? { ...mechanic, status: newStatus }
          : mechanic
      )
    );
    if (selectedMechanic && selectedMechanic.id === mechanicId) {
      setSelectedMechanic(prev => ({ ...prev, status: newStatus }));
    }
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedMechanic(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <Navbar isUser={isUser} isLoggedIn={isLoggedIn} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚙️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage and verify mechanic applications
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-full shadow-lg flex p-2 space-x-2 border border-gray-200">
                {[
                  { key: "pending", label: "Pending", count: mechanics.filter(m => m.status === "pending").length },
                  { key: "approved", label: "Approved", count: mechanics.filter(m => m.status === "approved").length },
                  { key: "rejected", label: "Rejected", count: mechanics.filter(m => m.status === "rejected").length },
                  { key: "all", label: "All", count: mechanics.length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`
                      px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out flex items-center space-x-2
                      ${
                        filter === key
                          ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                          : "bg-transparent text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span>{label}</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold
                      ${filter === key ? "bg-white bg-opacity-20 text-white" : "bg-gray-200 text-gray-600"}
                    `}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mechanics List */}
          <div className="grid gap-6">
            {filteredMechanics.map((mechanic) => (
              <div key={mechanic.id} className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {mechanic.fullName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{mechanic.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{mechanic.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Wrench className="w-4 h-4" />
                          <span>{mechanic.specialization.slice(0, 2).join(", ")}{mechanic.specialization.length > 2 ? `... (+${mechanic.specialization.length - 2})` : ""}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{mechanic.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-semibold border flex items-center space-x-1
                      ${getStatusColor(mechanic.status)}
                    `}>
                      {getStatusIcon(mechanic.status)}
                      <span className="capitalize">{mechanic.status}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(mechanic)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {mechanic.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(mechanic.id, "approved")}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(mechanic.id, "rejected")}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredMechanics.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No mechanics found
                </h3>
                <p className="text-gray-600">
                  No mechanic applications match the current filter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedMechanic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mechanic Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">{selectedMechanic.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedMechanic.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{selectedMechanic.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{selectedMechanic.location}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Professional Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <p className="font-medium">{selectedMechanic.experience} years</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Working Hours:</span>
                      <p className="font-medium capitalize">{selectedMechanic.workingHours}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Emergency Available:</span>
                      <p className="font-medium">{selectedMechanic.emergencyAvailable ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600">Specializations:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedMechanic.specialization.map((spec, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600">Bio:</span>
                    <p className="font-medium mt-1">{selectedMechanic.bio}</p>
                  </div>
                </div>

                {/* Certifications & Experience */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Certifications & Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Certifications:</span>
                      <p className="font-medium mt-1">{selectedMechanic.certifications || "No certifications provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Previous Work:</span>
                      <p className="font-medium mt-1">{selectedMechanic.previousWork || "No previous work details provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">References:</span>
                      <p className="font-medium mt-1">{selectedMechanic.references || "No references provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Application Details</h3>
                  <div className="text-sm">
                    <span className="text-gray-600">Applied on:</span>
                    <p className="font-medium">{new Date(selectedMechanic.appliedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className={`
                    px-4 py-2 rounded-full text-sm font-semibold border flex items-center space-x-2
                    ${getStatusColor(selectedMechanic.status)}
                  `}>
                    {getStatusIcon(selectedMechanic.status)}
                    <span className="capitalize">{selectedMechanic.status}</span>
                  </div>

                  {selectedMechanic.status === "pending" && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          handleStatusChange(selectedMechanic.id, "approved");
                          closeModal();
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedMechanic.id, "rejected");
                          closeModal();
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;



// Current Flow:

// User registers via your AuthPage (first form) - creates basic account
// If they selected "Join as Mechanic" - they get redirected to AddMechanicPage
// Mechanic fills detailed application (AddMechanicPage form) - all professional details
// Form submission sends complete mechanic profile to your backend
// Admin Dashboard receives and displays these detailed applications for review

// Data Flow:
// AddMechanicPage collects:

// Personal info (fullName, email, phone, location)
// Professional details (experience, specializations, certifications)
// Work preferences (hours, emergency availability)
// Descriptive content (bio, previous work, references)

// Admin Dashboard displays:

// All submitted applications with status (pending/approved/rejected)
// Quick overview cards showing key info
// Detailed modal with complete application data
// Approve/reject functionality

// Integration Points:
// You'll need to connect:

// AddMechanicPage handleSubmit() to your backend API endpoint
// Admin Dashboard useEffect() to fetch applications from your backend
// Admin Dashboard handleStatusChange() to update application status via API

// The data structure is now perfectly aligned between both components, so the mechanic's detailed application from AddMechanicPage will display seamlessly in the Admin Dashboard for review and approval.RetryClaude can make mistakes. Please double-check responses.