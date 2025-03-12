import React from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Infinity } from "lucide-react";

const features = [
  { icon: Lock, title: "Blockchain Security", description: "Your memories are safe and immutable" },
  { icon: Heart, title: "Rediscover Memories", description: "Relive your past moments with joy" },
  { icon: Infinity, title: "Forever Accessible", description: "Your capsules are always available" },
];

export default function Features() {
  return (
    <section className="py-16 bg-purple-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Time Capsule?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <feature.icon className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2 group">
                <span className="bg-left-bottom bg-gradient-to-r from-purple-600 to-purple-600 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  {feature.title}
                </span>
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}