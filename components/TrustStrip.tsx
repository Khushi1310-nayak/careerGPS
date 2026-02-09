import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Cpu, Zap } from 'lucide-react';

const TrustStrip: React.FC = () => {
  const items = [
    { text: "Built for students", icon: <UserCheck className="w-5 h-5" /> },
    { text: "Privacy-first", icon: <ShieldCheck className="w-5 h-5" /> },
    { text: "AI-assisted, not AI-dependent", icon: <Cpu className="w-5 h-5" /> },
    { text: "No false promises", icon: <Zap className="w-5 h-5" /> },
  ];

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <section className="relative py-8 border-y border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden z-20">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2c0003]/80 via-transparent to-[#2c0003]/80 z-10 pointer-events-none w-full" />
      
      <div className="flex">
        <motion.div
          className="flex gap-16 px-8 whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-pink-100/60 text-sm font-medium uppercase tracking-widest">
              <span className="opacity-70 text-pink-300">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStrip;