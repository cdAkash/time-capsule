import { useState, useEffect } from "react";
import { Clock, ArrowRight, CalendarIcon } from "lucide-react";
const API_BASE_URL = "http://localhost:8000/api/v1";
export default function AllCapsules({ email, refreshTrigger }) {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function fetchCapsules() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/capsule/getAll-Capsule`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(data.message || "Failed to load capsules");
      }

      const data = await response.json();
      // Ensure your backend returns `data.data.capsules`
      setCapsules(data.data?.capsules || []);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error occurred during fetching capsules: ", err);
    setError(err.message || "Failed to load capsules");
    setLoading(false);
    }
  };
  useEffect(() => {


    if (email) {
      fetchCapsules();
    }
  }, [email, refreshTrigger]);

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
          <button className="mt-2 text-purple-600 hover:underline" onClick={fetchCapsules}>Try again</button>
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
                <h3 className="font-semibold text-lg text-gray-800">{capsule.id}</h3>
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