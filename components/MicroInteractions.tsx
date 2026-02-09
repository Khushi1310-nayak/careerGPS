import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useMotionTemplate } from 'framer-motion';

const MicroInteractions: React.FC = () => {
  return (
    <section className="py-24 px-4 relative flex flex-col items-center">
      <div className="text-center mb-20 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold italic mb-6">Data that breathes.</h2>
        <p className="text-pink-100/70 text-lg">Every interaction gives you feedback. It feels alive because it is.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <CounterCard />
        <SkillRingCard />
        <GlowCard />
      </div>
    </section>
  );
};

const cardBaseClass = "h-72 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-lg flex flex-col items-center justify-center relative overflow-hidden group shadow-lg";

const CounterCard = () => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animate(count, 87, { duration: 2, ease: "easeOut" });
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [count]);

  return (
    <motion.div 
      ref={ref} 
      className={cardBaseClass}
      whileHover={{ scale: 1.05, rotate: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <motion.h3 className="text-7xl font-bold text-white mb-2 font-serif italic drop-shadow-md">
        <motion.span>{rounded}</motion.span>%
      </motion.h3>
      <p className="text-sm text-pink-200 uppercase tracking-widest font-semibold">Career Alignment</p>
    </motion.div>
  );
};

const SkillRingCard = () => {
  // Radius calculation: 
  // Viewbox 128x128. Center 64, 64. 
  // Radius 54 to leave room for stroke width (10px).
  // Circumference = 2 * pi * 54 ≈ 339
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <motion.div 
      className={cardBaseClass}
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Background Circle */}
          <circle 
            cx="64" cy="64" r={radius} 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="10" 
            fill="none" 
          />
          {/* Progress Circle */}
          <motion.circle 
            cx="64" cy="64" r={radius} 
            stroke="url(#gradient)" 
            strokeWidth="10" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={circumference}
            whileInView={{ strokeDashoffset: circumference - (circumference * 0.85) }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-3xl font-bold font-serif italic text-white">A+</div>
      </div>
      <p className="text-sm text-pink-200 uppercase tracking-widest font-semibold mt-4">Profile Strength</p>
    </motion.div>
  );
};

const GlowCard = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      className={cardBaseClass}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-2 rounded-full bg-white/10 mb-6 overflow-hidden">
             <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500" 
              animate={{ x: [-96, 96] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
             />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 font-serif italic">Live Analysis</h3>
          <p className="text-sm text-pink-200 uppercase tracking-widest font-semibold mt-2">Real-time</p>
      </div>
    </motion.div>
  );
};

export default MicroInteractions;