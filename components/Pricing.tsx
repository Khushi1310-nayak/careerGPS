import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section className="py-32 px-4 relative z-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Free Plan */}
        <motion.div 
          className="p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 group"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl font-serif italic font-bold mb-2">Free</h3>
          <p className="text-pink-100/70 mb-8 h-10">Essential tools to get started.</p>
          <div className="text-5xl font-bold mb-8">$0</div>
          
          <ul className="space-y-4 mb-8 text-pink-100/80">
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Basic career direction</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-400" /> Short-term roadmap (1 month)</li>
            <li className="flex items-center gap-3 opacity-50"><X className="w-5 h-5" /> Limited insights</li>
            <li className="flex items-center gap-3 opacity-50"><X className="w-5 h-5" /> No gap analysis</li>
          </ul>
          
          <button className="w-full py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-colors font-bold text-lg tracking-wide">
            Start Free
          </button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div 
          className="relative p-8 rounded-3xl bg-gradient-to-br from-rose-900/80 to-burgundy border border-rose-500/50 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -10 }}
        >
          {/* Ambient Glow */}
          <motion.div 
            className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-rose-500/30 rounded-full blur-[80px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <h3 className="text-3xl font-serif italic font-bold mb-2 text-white relative z-10">Premium</h3>
          <p className="text-rose-200 mb-8 h-10 relative z-10">Complete toolkit for ambitious students.</p>
          <div className="text-5xl font-bold mb-8 text-white relative z-10">$12<span className="text-xl font-normal text-rose-200/60">/mo</span></div>
          
          <ul className="space-y-4 mb-8 text-rose-100 relative z-10">
            <li className="flex items-center gap-3"><div className="p-1 rounded-full bg-rose-500"><Check className="w-3 h-3 text-white" /></div> Full 12-month career map</li>
            <li className="flex items-center gap-3"><div className="p-1 rounded-full bg-rose-500"><Check className="w-3 h-3 text-white" /></div> Resume gap analysis</li>
            <li className="flex items-center gap-3"><div className="p-1 rounded-full bg-rose-500"><Check className="w-3 h-3 text-white" /></div> AI project suggestions</li>
            <li className="flex items-center gap-3"><div className="p-1 rounded-full bg-rose-500"><Check className="w-3 h-3 text-white" /></div> Mock Interview Prep</li>
          </ul>
          
          <button className="relative w-full py-4 rounded-xl bg-white text-rose-900 font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all z-10 transform hover:-translate-y-1">
            Get Premium
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;