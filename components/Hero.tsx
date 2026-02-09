import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Map } from 'lucide-react';

interface HeroProps {
  onOpenRoadmap: () => void;
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenRoadmap, onGetStarted }) => {
  const letterContainer: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 * i },
    }),
  };

  const letterAnimation: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.5,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const headline = "Stop guessing your future. Map it with precision.";

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20">
      {/* Ambient Glows */}
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center gap-8">
        {/* Floating Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="px-6 py-2 rounded-full border border-pink-300/30 bg-white/10 backdrop-blur-md shadow-[0_0_30px_-5px_rgba(255,100,150,0.3)] flex items-center gap-3"
           >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
              <span className="text-sm font-semibold text-pink-100 tracking-wide uppercase text-[11px]">
                Beta Access Open
              </span>
           </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold italic tracking-tight leading-tight max-w-5xl"
          variants={letterContainer}
          initial="hidden"
          animate="visible"
        >
          {headline.split("").map((char, index) => (
            <motion.span 
                variants={letterAnimation} 
                key={index}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-rose-300 drop-shadow-sm"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg md:text-2xl text-pink-100/80 max-w-2xl leading-relaxed font-light mt-4"
        >
          Personalized career roadmaps for students who refuse to <span className="text-white font-medium border-b border-pink-400/50">drift</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
          className="flex flex-col sm:flex-row gap-6 mt-10 w-full sm:w-auto"
        >
          <motion.button 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 40px rgba(225, 29, 72, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="relative px-10 py-5 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-lg overflow-hidden group shadow-xl shadow-rose-900/40"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get My Career Map <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-0" />
          </motion.button>

          <motion.button 
            onClick={onOpenRoadmap}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-2xl border border-pink-200/30 bg-white/5 text-pink-100 font-semibold text-lg backdrop-blur-sm shadow-lg shadow-black/10 flex items-center justify-center gap-2"
          >
            <Map className="w-5 h-5" />
            View Sample Roadmap
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;