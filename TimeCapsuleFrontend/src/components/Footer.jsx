import React from "react";

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
            Privacy
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
            Contact
          </a>
        </div>
        <p className="text-center mt-4 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Time Capsule. All rights reserved.
        </p>
      </div>
    </footer>
  );
}