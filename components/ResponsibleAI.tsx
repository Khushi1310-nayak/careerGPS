import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const ResponsibleAI: React.FC = () => {
  return (
    <section className="py-40 px-4 relative z-10 flex flex-col items-center justify-center text-center">
      <motion.div 
        className="mb-8 p-4 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-[0_0_30px_-5px_rgba(255,100,150,0.3)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <Shield className="w-10 h-10 text-rose-200" />
      </motion.div>

      <div className="max-w-4xl relative">
        <motion.h2 
          className="text-4xl md:text-6xl font-serif italic md:leading-tight text-white drop-shadow-md"
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-20%" }}
        >
          CareerGPS doesn’t promise outcomes.<br />
          It gives <span className="text-pink-200 font-semibold relative inline-block">
            clarity
            <motion.svg 
              className="absolute -bottom-2 left-0 w-full h-3" 
              viewBox="0 0 100 10" 
              preserveAspectRatio="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <path d="M0 5 Q 50 10 100 5" fill="none" stroke="#fbc2eb" strokeWidth="2" />
            </motion.svg>
          </span>, <span className="text-pink-200 font-semibold">structure</span>, and <span className="text-pink-200 font-semibold">direction</span>.
        </motion.h2>
        
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 text-rose-100/70 text-sm tracking-[0.2em] uppercase font-medium"
        >
            Recruiter Approved Philosophy
        </motion.p>
      </div>
    </section>
  );
};

export default ResponsibleAI;