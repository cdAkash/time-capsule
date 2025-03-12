import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CapsuleForm from "@/components/capsule-form";
import ThankYouModal from "@/components/thank-you-modal";
import AllCapsules from "@/components/AllCapsules";
import { Button } from "@/components/ui/button";

export default function CreateCapsulePage() {
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the primary email from sessionStorage
    const email = sessionStorage.getItem("primaryEmail");
    if (!email) {
      // Redirect to home if no email is found
      navigate("/");
      return;
    }
    setPrimaryEmail(email);
  }, [navigate]);

  const handleFormSubmit = (formData) => {
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    
    // In a real app, you would add the new capsule after successful API response
    // For now, we'll simulate a successful response
    const newCapsule = {
      id: Date.now(), // temporary ID
      title: formData.title,
      recipientEmail: formData.recipientEmail,
      deliveryDate: formData.deliveryDate,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Update the capsules list
    setCapsules(prev => [newCapsule, ...prev]);

    // Show thank you modal
    setIsThankYouModalOpen(true);
  };

  const handleThankYouClose = () => {
    setIsThankYouModalOpen(false);
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

        {primaryEmail && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <CapsuleForm primaryEmail={primaryEmail} onSubmit={handleFormSubmit} />
            </div>
            <div className="lg:col-span-1">
              <AllCapsules email={primaryEmail} capsules={capsules} />
            </div>
          </div>
        )}

        <ThankYouModal isOpen={isThankYouModalOpen} onClose={handleThankYouClose} />
      </div>
    </main>
  );
}