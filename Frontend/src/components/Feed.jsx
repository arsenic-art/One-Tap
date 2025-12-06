import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Wrench,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Camera,
  Play,
  ThumbsUp
} from "lucide-react";

const FeedPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isUser, setIsUser] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        type: "service_complete",
        author: {
          name: "Rajesh Kumar",
          role: "Master Mechanic",
          avatar: "RK",
          verified: true,
          rating: 4.8,
          location: "Mumbai"
        },
        timestamp: "2 hours ago",
        content: "Just completed a complex engine rebuild on a 2018 BMW X5! The customer was thrilled with the results. Nothing beats the satisfaction of bringing a car back to life.",
        images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        stats: {
          likes: 127,
          comments: 23,
          shares: 8
        },
        serviceDetails: {
          vehicle: "2018 BMW X5",
          service: "Engine Rebuild",
          duration: "4 hours",
          price: "₹45,000"
        }
      },
      {
        id: 2,
        type: "tip",
        author: {
          name: "Priya Sharma",
          role: "Auto Enthusiast",
          avatar: "PS",
          verified: false,
          rating: null,
          location: "Delhi"
        },
        timestamp: "5 hours ago",
        content: "Pro tip for car owners: Check your tire pressure every month! Proper tire pressure can improve fuel efficiency by up to 10% and extend tire life significantly. Here's how to do it properly...",
        images: ["/api/placeholder/400/250"],
        stats: {
          likes: 89,
          comments: 15,
          shares: 34
        },
        tips: [
          "Check pressure when tires are cold",
          "Use a reliable pressure gauge",
          "Don't forget the spare tire",
          "Follow manufacturer recommendations"
        ]
      },
      {
        id: 3,
        type: "achievement",
        author: {
          name: "OneTap Team",
          role: "Official",
          avatar: "OT",
          verified: true,
          rating: null,
          location: "India"
        },
        timestamp: "1 day ago",
        content: "Celebrating a major milestone! OneTap has now completed over 50,000 successful services across India. Thank you to our amazing community of mechanics and customers!",
        images: ["/api/placeholder/600/300"],
        stats: {
          likes: 1247,
          comments: 156,
          shares: 89
        },
        milestone: {
          number: "50,000+",
          description: "Services Completed",
          growth: "+15% this month"
        }
      },
      {
        id: 4,
        type: "before_after",
        author: {
          name: "Amit Singh",
          role: "Senior Mechanic",
          avatar: "AS",
          verified: true,
          rating: 4.9,
          location: "Bangalore"
        },
        timestamp: "1 day ago",
        content: "Amazing transformation! This Honda Civic came in with severe rust damage. After 6 hours of detailed work, it's looking brand new. The owner was speechless!",
        images: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
        stats: {
          likes: 203,
          comments: 45,
          shares: 22
        },
        transformation: {
          before: "Rust damage, dents, faded paint",
          after: "Restored finish, rust removed, polished",
          timeSpent: "6 hours"
        }
      },
      {
        id: 5,
        type: "customer_review",
        author: {
          name: "Sneha Patel",
          role: "Satisfied Customer",
          avatar: "SP",
          verified: false,
          rating: null,
          location: "Ahmedabad"
        },
        timestamp: "2 days ago",
        content: "Absolutely fantastic service from Vikash! My car broke down on the highway and he reached me within 30 minutes. Professional, friendly, and reasonably priced. OneTap is a lifesaver!",
        stats: {
          likes: 156,
          comments: 31,
          shares: 12
        },
        review: {
          mechanicName: "Vikash Kumar",
          rating: 5,
          service: "Emergency Roadside Assistance",
          responseTime: "30 minutes"
        }
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, stats: { ...post.stats, likes: post.stats.likes + 1 } }
        : post
    ));
  };

  const renderPost = (post) => {
    return (
      <div key={post.id} className="bg-white rounded-3xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-all duration-300">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{post.author.avatar}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                {post.author.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{post.author.role}</span>
                {post.author.rating && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{post.author.rating}</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{post.author.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{post.timestamp}</span>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </div>

        {/* Post Type Specific Content */}
        {post.type === "service_complete" && post.serviceDetails && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Vehicle:</span>
                <p className="font-semibold text-gray-900">{post.serviceDetails.vehicle}</p>
              </div>
              <div>
                <span className="text-gray-600">Service:</span>
                <p className="font-semibold text-gray-900">{post.serviceDetails.service}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-semibold text-gray-900">{post.serviceDetails.duration}</p>
              </div>
              <div>
                <span className="text-gray-600">Value:</span>
                <p className="font-semibold text-green-600">{post.serviceDetails.price}</p>
              </div>
            </div>
          </div>
        )}

        {post.type === "tip" && post.tips && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Tips:</h4>
            <ul className="space-y-1">
              {post.tips.map((tip, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {post.type === "achievement" && post.milestone && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{post.milestone.number}</div>
              <div className="text-green-800 font-semibold">{post.milestone.description}</div>
              <div className="text-sm text-green-600 mt-1">{post.milestone.growth}</div>
            </div>
          </div>
        )}

        {post.type === "customer_review" && post.review && (
          <div className="bg-yellow-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Service by: {post.review.mechanicName}</p>
                <p className="text-sm text-gray-600">{post.review.service}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {[...Array(post.review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Response: {post.review.responseTime}</p>
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Post ${post.id} image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                {post.type === "before_after" && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    {index === 0 ? "BEFORE" : "AFTER"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Engagement Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleLike(post.id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <Heart className="w-5 h-5" />
              <span className="font-semibold">{post.stats.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{post.stats.comments}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
              <Share2 className="w-5 h-5" />
              <span className="font-semibold">{post.stats.shares}</span>
            </button>
          </div>
          <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar isUser={isUser} isLoggedIn={isLoggedIn} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                  <span>OneTap Feed</span>
                </h1>
                <p className="text-gray-600">Stay connected with the automotive community</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-4 bg-gray-100 rounded-2xl p-1">
              {[
                { key: "all", label: "All Posts", icon: TrendingUp },
                { key: "services", label: "Services", icon: Wrench },
                { key: "tips", label: "Tips & Tricks", icon: Award },
                { key: "community", label: "Community", icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300
                    ${activeTab === key
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed Content */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-red-600">1,247</div>
              <div className="text-sm text-gray-600">Active Mechanics</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-orange-600">50,000+</div>
              <div className="text-sm text-gray-600">Services Done</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map(post => renderPost(post))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Load More Posts
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedPage;