import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';

interface FooterProps {
    onStartCareerMap: () => void;
}

const Footer: React.FC<FooterProps> = ({ onStartCareerMap }) => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="relative py-32 px-4 overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle Background Shift */}
        <motion.div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          animate={{ 
            background: [
              "radial-gradient(circle at 50% 50%, #ff9a9e 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, #fad0c4 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, #ff9a9e 0%, transparent 70%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-serif font-bold italic mb-10 text-white drop-shadow-md">Your career deserves more than guesswork.</h2>
          
          <motion.button 
            onClick={onStartCareerMap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-rose-900 text-xl font-bold rounded-full shadow-[0_0_50px_-10px_rgba(255,255,255,0.6)] animate-pulse-slow hover:shadow-[0_0_70px_-10px_rgba(255,255,255,0.8)] transition-shadow"
          >
            Start My Career Map
          </motion.button>
          
          <div className="mt-24 flex gap-8 justify-center text-sm text-pink-200/80 font-medium">
            <button 
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-white hover:underline decoration-pink-400 decoration-2 underline-offset-4 transition-all"
            >
                Privacy
            </button>
            <button
                onClick={() => setIsTermsOpen(true)} 
                className="hover:text-white hover:underline decoration-pink-400 decoration-2 underline-offset-4 transition-all"
            >
                Terms
            </button>
          </div>
          
          <div className="mt-8 text-xs text-pink-200/50">
            © {new Date().getFullYear()} CareerGPS. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
};

export default Footer;