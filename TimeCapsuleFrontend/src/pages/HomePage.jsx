"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import StarryBackground from "@/components/starry-background"
import LoginModal from "@/components/login-modal"
import { Button } from "@/components/ui/button"
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null)
  
  useEffect(() => {
    if (userInfo) {
      console.log("User info updated:", userInfo);

      navigate("/create-capsule");
    }
  }, [userInfo, navigate]);

  const handleLoginSuccess = (userData) => {
    sessionStorage.setItem("primaryEmail", userData.email);
    setUserInfo(userData);
    setIsLoginModalOpen(false);
  };
  
  

  return (
    <div>
      <main className="relative min-h-screen w-full overflow-hidden">
        <StarryBackground />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 backdrop-blur-sm bg-black/20 p-8 rounded-xl max-w-3xl mx-auto">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Time Capsule</h1>
              <p className="mb-8 max-w-[700px] mx-auto text-lg text-gray-200">
                Preserve your memories and send them to your future self or loved ones. Create a digital time capsule
                today.
              </p>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Create Capsule
              </Button>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>
      <HowItWorks/>
      <Features/>
      <Footer/>
    </div>
  )
}