import { useState, useEffect } from "react";
import { Clock, ArrowRight, CalendarIcon } from "lucide-react";

export default function AllCapsules({ email }) {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock fetching capsules - in a real app, this would be an API call
    const fetchCapsules = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app, you would fetch this from your backend
        const mockCapsules = [
          {
            id: 1,
            title: "My 30th Birthday",
            recipientEmail: email,
            deliveryDate: "2026-03-15",
            createdAt: "2025-03-10"
          },
          {
            id: 2,
            title: "Wedding Anniversary",
            recipientEmail: "partner@example.com",
            deliveryDate: "2026-06-20",
            createdAt: "2025-02-14"
          },
          {
            id: 3,
            title: "Time Capsule 2030",
            recipientEmail: email,
            deliveryDate: "2030-01-01",
            createdAt: "2025-01-02"
          }
        ];
        
        setCapsules(mockCapsules);
        setLoading(false);
      } catch (err) {
        setError("Failed to load capsules");
        setLoading(false);
      }
    };

    if (email) {
      fetchCapsules();
    }
  }, [email]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateTimeRemaining = (deliveryDateStr) => {
    const now = new Date();
    const deliveryDate = new Date(deliveryDateStr);
    const diffTime = Math.abs(deliveryDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} remaining`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your capsules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button className="mt-2 text-purple-600 hover:underline">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Your Time Capsules</h2>
      
      {capsules.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4 text-gray-400">
            <Clock className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-gray-600">You haven't created any capsules yet.</p>
          <p className="text-purple-600 mt-2">Create your first capsule to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {capsules.map((capsule) => (
            <div 
              key={capsule.id} 
              className="border-b border-gray-100 last:border-0 pb-4 mb-4 last:mb-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-800">{capsule.title}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 py-1 px-2 rounded-full">
                  {calculateTimeRemaining(capsule.deliveryDate)}
                </span>
              </div>
              
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <div className="flex items-center mr-4">
                  <ArrowRight className="h-3 w-3 mr-1 text-purple-500" />
                  <span>{capsule.recipientEmail}</span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>Delivery: {formatDate(capsule.deliveryDate)}</span>
                <span className="mx-2">•</span>
                <span>Created: {formatDate(capsule.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}