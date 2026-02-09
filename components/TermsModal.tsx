import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Compass, Brain, User, ShieldAlert, RotateCw } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
              <h2 className="text-xl font-serif text-white italic">Terms of Service</h2>
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
              
              {/* Section 1: Calm Authority Intro */}
              <section className="text-center py-4">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    CareerGPS offers guidance, <br/>
                    not <span className="text-rose-300 italic">guarantees</span>.
                    </h3>
                </motion.div>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "20%" }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="h-1 bg-rose-500/50 mx-auto rounded-full"
                />
              </section>

              {/* Section 2: Responsible Usage */}
              <section>
                <SectionHeader title="Responsible Usage" />
                <div className="flex items-start gap-6">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }} 
                        className="p-3 bg-white/5 rounded-full"
                    >
                        <AlertCircle className="w-6 h-6 text-rose-300" />
                    </motion.div>
                    <div className="space-y-3 flex-1">
                        {[
                            "For guidance and educational purposes only.",
                            "Do not misuse AI insights for critical life decisions without verification.",
                            "Zero tolerance for harmful or abusive behavior on the platform."
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="flex items-center gap-2 text-white/80 hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span className="text-sm">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
              </section>

              {/* Section 3: AI Transparency */}
              <section>
                <SectionHeader title="AI Transparency" />
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                    {/* Pulsing Pink Glow */}
                    <motion.div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-500/20 rounded-full blur-xl"
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                        <div className="relative w-12 h-12">
                             {/* Morphing Icons (Simulated via fade overlap) */}
                             <motion.div
                                animate={{ opacity: [1, 0, 0, 1] }}
                                transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.55, 1] }}
                                className="absolute inset-0 flex items-center justify-center"
                             >
                                <Brain className="w-10 h-10 text-rose-300" />
                             </motion.div>
                             <motion.div
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.55, 1] }}
                                className="absolute inset-0 flex items-center justify-center"
                             >
                                <Compass className="w-10 h-10 text-emerald-300" />
                             </motion.div>
                        </div>
                        <div>
                            <h4 className="text-white font-medium text-lg mb-1">AI Assists, You Decide</h4>
                            <p className="text-sm text-white/60 max-w-sm">
                                Outputs are suggestions based on data patterns. Human judgment is always required for final decisions.
                            </p>
                        </div>
                    </div>
                </div>
              </section>

              {/* Section 4: Account Rules */}
              <section>
                <SectionHeader title="Account Rules" />
                <div className="space-y-3">
                    <RuleCard 
                        icon={<User className="w-4 h-4" />} 
                        title="One User, One Account" 
                        desc="Identity verification ensures fair usage."
                    />
                     <RuleCard 
                        icon={<ShieldAlert className="w-4 h-4" />} 
                        title="No Account Sharing" 
                        desc="Security protocols may lock shared sessions."
                    />
                     <RuleCard 
                        icon={<X className="w-4 h-4" />} 
                        title="Suspension Policy" 
                        desc="Violation of terms leads to immediate suspension."
                        isLocked
                    />
                </div>
              </section>

              {/* Section 5: Changes & Updates */}
              <section>
                 <SectionHeader title="Changes & Updates" />
                 <div className="flex gap-4 items-center pl-2">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <motion.div 
                            className="w-0.5 bg-rose-500/30"
                            initial={{ height: 0 }}
                            whileInView={{ height: 40 }}
                            transition={{ duration: 1 }}
                        />
                        <motion.div 
                            className="w-2 h-2 rounded-full bg-rose-500/50" 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 1 }}
                        />
                    </div>
                    <div className="py-2">
                        <div className="flex items-center gap-2 text-white font-medium mb-1">
                            <RotateCw className="w-4 h-4 text-rose-300" />
                            <span>Terms Evolve</span>
                        </div>
                        <p className="text-sm text-white/60">We will notify you of any major changes to these terms.</p>
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

const RuleCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, isLocked?: boolean }> = ({ icon, title, desc, isLocked }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.08)" }}
        className={`flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 transition-all ${isLocked ? 'opacity-70 blur-[0.5px]' : ''}`}
    >
        <div className={`p-2 rounded-lg ${isLocked ? 'bg-red-500/20 text-red-300' : 'bg-rose-500/10 text-rose-300'}`}>
            {icon}
        </div>
        <div>
            <div className="text-white font-medium text-sm">{title}</div>
            <div className="text-xs text-white/50">{desc}</div>
        </div>
    </motion.div>
)

export default TermsModal;
