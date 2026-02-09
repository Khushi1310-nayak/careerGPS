import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye, Database, FileText, Trash2, Download } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  // ESC key listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-[85vh] bg-[#2c0003] border border-rose-500/30 rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-rose-500/20 flex justify-between items-center bg-gradient-to-r from-rose-900/50 to-burgundy relative z-10">
              <h2 className="text-xl font-serif text-white italic">Privacy & Data Control</h2>
              <motion.button 
                onClick={onClose}
                whileHover={{ scale: 1.1, textShadow: "0 0 8px rgb(255, 100, 150)" }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-rose-500/10 transition-colors text-white/70 hover:text-rose-200"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
              
              {/* Section 1: Intro */}
              <section className="text-center py-4">
                <motion.h3 
                  className="text-3xl md:text-4xl font-serif text-white mb-2"
                  initial={{ filter: "blur(8px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Your data is <span className="relative inline-block">
                    yours
                    <motion.svg 
                        className="absolute -bottom-1 left-0 w-full h-3"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                    >
                        <motion.path 
                            d="M0 5 Q 50 10 100 5" 
                            fill="none" 
                            stroke="#f472b6" 
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        />
                    </motion.svg>
                  </span>.
                </motion.h3>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-rose-200/80"
                >
                    We treat it that way.
                </motion.p>
              </section>

              {/* Section 2: What Data We Collect */}
              <section>
                <SectionHeader title="What We Collect" />
                <div className="grid gap-4">
                    {[
                        { icon: <FileText size={18} />, title: "Account Info", desc: "Email & Name", why: "To verify your identity and save progress." },
                        { icon: <Database size={18} />, title: "Career Inputs", desc: "Skills & Goals", why: "To generate your personalized roadmap." },
                        { icon: <Eye size={18} />, title: "Usage Data", desc: "Anonymous Analytics", why: "To improve our AI models (anonymized)." },
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                            className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-pink-500/30 transition-all cursor-default"
                        >
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-300 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <div>
                                <div className="text-white font-medium">{item.title}</div>
                                <div className="text-sm text-white/50">{item.desc}</div>
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-w-[150px] text-right pointer-events-none">
                                <span className="text-xs text-rose-200 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-rose-500/20">
                                    {item.why}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </section>

              {/* Section 3: Protection */}
              <section>
                <SectionHeader title="Protection Standards" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 flex flex-col items-center text-center gap-3 hover:bg-white/5 transition-colors">
                        <motion.div
                            animate={{ rotate: [0, 3, 0, -3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </motion.div>
                        <span className="text-sm text-white font-medium">Encrypted Storage</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 flex flex-col items-center text-center gap-3 hover:bg-white/5 transition-colors">
                         <motion.div
                            whileHover={{ scale: 1.1 }}
                         >
                            <Lock className="w-8 h-8 text-rose-400" />
                        </motion.div>
                        <span className="text-sm text-white font-medium">No Ads</span>
                    </div>
                </div>
              </section>

              {/* Section 4: What We DON'T Do */}
              <section>
                <SectionHeader title="Our Promise" />
                <div className="space-y-4">
                    {["No selling personal data", "No scraping private accounts", "No dark patterns"].map((text, i) => (
                        <div key={i} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 24 24">
                                    <motion.path 
                                        d="M18 6L6 18M6 6l12 12" 
                                        stroke="#ef4444" 
                                        strokeWidth="2" 
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.2 }}
                                    />
                                </svg>
                            </div>
                            <motion.span 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.3 + (i * 0.2) }}
                                className="text-white/80"
                            >
                                {text}
                            </motion.span>
                        </div>
                    ))}
                </div>
              </section>

              {/* Section 5: Your Control */}
              <section className="bg-rose-900/20 p-6 rounded-2xl border border-rose-500/20">
                <SectionHeader title="Your Controls (Demo)" />
                
                <div className="space-y-4">
                    <ToggleItem label="Edit profile anytime" />
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 text-white">
                            <Download className="w-4 h-4 text-rose-300" />
                            <span>Export basic data</span>
                        </div>
                        <span className="text-xs text-white/40 group-hover:text-white transition-colors">Download JSON</span>
                    </div>
                    <div className="flex items-center justify-between group cursor-pointer hover:bg-red-900/20 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 text-red-400">
                            <Trash2 className="w-4 h-4" />
                            <span>Delete account</span>
                        </div>
                        <span className="text-xs text-red-400/40 group-hover:text-red-400 transition-colors">Permanent</span>
                    </div>
                </div>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="relative inline-block mb-6 group cursor-default">
        <h4 className="text-xs uppercase tracking-widest text-rose-300 font-semibold">{title}</h4>
        <motion.div 
            className="absolute -bottom-1 left-0 h-[1px] bg-rose-400/50" 
            initial={{ width: 0 }} 
            whileInView={{ width: "40%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
        />
    </div>
);

const ToggleItem: React.FC<{ label: string }> = ({ label }) => {
    const [isOn, setIsOn] = useState(true);
    return (
        <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors" onClick={() => setIsOn(!isOn)}>
            <span className="text-white">{label}</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-rose-500' : 'bg-white/10'}`}>
                <motion.div 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    animate={{ x: isOn ? 24 : 0 }}
                />
            </div>
        </div>
    )
}

export default PrivacyModal;
