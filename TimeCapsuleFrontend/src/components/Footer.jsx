import React from "react";

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        
        <p className="text-center mt-4 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Time Capsule. All rights reserved.
        </p>
      </div>
    </footer>
  );
}