import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CapsuleForm from "@/components/capsule-form";
import ThankYouModal from "@/components/thank-you-modal";
import AllCapsules from "@/components/AllCapsules";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; 
export default function CreateCapsulePage() {
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [capsules, setCapsules] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8000/api/v1";
  useEffect(() => {
    const email = sessionStorage.getItem("primaryEmail");
    if (!email) {

      navigate("/");
      return;
    }
    setPrimaryEmail(email);
  }, [navigate]);

  const handleFormSubmit = (formData) => {
    console.log("Form submitted:", formData);
    const newCapsule = {
      id: Date.now(), // temporary ID
      title: formData.title,
      recipientEmail: formData.recipientEmail,
      deliveryDate: formData.deliveryDate,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCapsules(prev => [newCapsule, ...prev]);

    setRefreshKey(old => old + 1);
    setIsThankYouModalOpen(true);
  };

  const handleThankYouClose = () => {
    setIsThankYouModalOpen(false);
  };
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Clear session storage
        sessionStorage.removeItem("primaryEmail");
        // Navigate back to home
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold">Create Your Time Capsule</h1>
        </div>
        <Button 
          variant="destructive"
          onClick={handleLogout} 
          className="flex items-center gap-2 ml-auto"
        >
          <LogOut size={16} />
          Logout
        </Button>

        {primaryEmail && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <CapsuleForm primaryEmail={primaryEmail} onSubmit={handleFormSubmit} />
            </div>
            <div className="lg:col-span-1">
              <AllCapsules email={primaryEmail} refreshTrigger={refreshKey} />
            </div>
          </div>
        )}

        <ThankYouModal isOpen={isThankYouModalOpen} onClose={handleThankYouClose} />
      </div>
    </main>
  );
}