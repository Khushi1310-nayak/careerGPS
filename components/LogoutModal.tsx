import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, CheckCircle2, XCircle } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#2c0003]/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#2c0003] border border-rose-500/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <LogOut className="w-8 h-8 text-rose-300" />
            </div>

            <h3 className="text-2xl font-serif italic text-white mb-2">Leaving so soon?</h3>
            <p className="text-pink-100/60 text-sm mb-8">Did you complete today's focus task?</p>

            <div className="grid grid-cols-2 gap-3 w-full mb-8">
                 <button 
                    onClick={onConfirm}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
                 >
                    <CheckCircle2 className="w-5 h-5 text-white/30 group-hover:text-emerald-400" />
                    <span className="text-xs font-medium text-white/50 group-hover:text-emerald-200">Yes, I did</span>
                 </button>
                 <button 
                    onClick={onClose}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all group"
                 >
                    <XCircle className="w-5 h-5 text-white/30 group-hover:text-orange-400" />
                    <span className="text-xs font-medium text-white/50 group-hover:text-orange-200">Not yet</span>
                 </button>
            </div>

            <div className="flex gap-4 w-full">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 font-medium hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                {/* Fallback traditional logout if they skip the big buttons */}
                <button 
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-colors"
                >
                    Log Out
                </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;