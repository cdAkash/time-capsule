import React from "react";
import { motion } from "framer-motion";
import { Upload, Calendar, Clock } from "lucide-react";

const cards = [
  { icon: Upload, title: "Upload", description: "Add your memories to the capsule" },
  { icon: Calendar, title: "Set Date", description: "Choose when to open your capsule" },
  { icon: Clock, title: "Wait", description: "Let time pass and anticipate the reveal" },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 group">
                <div className="flex justify-center mb-4">
                  <card.icon className="w-12 h-12 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{card.title}</h3>
                <p className="text-center text-gray-600">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}