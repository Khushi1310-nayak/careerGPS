import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const RoadmapPreview: React.FC = () => {
  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-serif font-bold italic mb-4 text-white"
          >
            Your Personal Map
          </motion.h2>
          <p className="text-pink-100/70 text-lg">A live look at what you'll get.</p>
        </div>

        <div className="relative rounded-3xl border border-white/20 bg-black/20 backdrop-blur-xl p-8 md:p-12 overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
            
            {/* Timeline Drawing */}
            <div className="relative pl-8 border-l border-white/10">
              
              {/* Animated Line */}
              <motion.div 
                className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-pink-400 via-rose-500 to-transparent origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              <div className="space-y-12">
                {[1, 2, 3].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (i * 0.4), duration: 0.6 }}
                    className="relative"
                  >
                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-burgundy border-2 border-pink-400 z-10 box-content" />
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-xs font-mono text-pink-300 uppercase tracking-wider font-bold">Phase 0{item}</span>
                      <span className="text-xs text-pink-100/50">Week {item * 2}-{item * 2 + 2}</span>
                    </div>
                    <h4 className="text-xl font-serif italic font-bold text-white mb-2">
                      {item === 1 ? "Foundation & Discovery" : item === 2 ? "Skill Acquisition" : "Network Integration"}
                    </h4>
                    <p className="text-sm text-pink-100/70">
                      {item === 1 ? "Identify core competencies and gap analysis." : item === 2 ? "Complete the 'React Deep Dive' project." : "Outreach to 5 targeted alumni."}
                    </p>
                  </motion.div>
                ))}

                {/* Locked Item */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8 }}
                  className="relative group cursor-not-allowed"
                >
                  <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-burgundy border-2 border-gray-600 z-10 box-content" />
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group-hover:bg-white/10 transition-colors">
                    <div className="blur-[2px] opacity-50 select-none">
                      <h4 className="text-lg font-medium text-white mb-1">Advanced Interview Prep</h4>
                      <p className="text-sm text-gray-400">Mock interviews with Senior Engineers.</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                       <Lock className="w-5 h-5 group-hover:text-pink-400 group-hover:animate-pulse transition-colors" />
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 right-0 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
                    Unlock with Premium
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="hidden md:block space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <h5 className="text-xs uppercase text-pink-200 font-bold mb-4">Milestones</h5>
                <div className="space-y-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "35%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-pink-200">
                    <span>Progress</span>
                    <span>35%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                 <h5 className="text-xs uppercase text-pink-200 font-bold mb-4">Skill Checkpoints</h5>
                 <div className="flex flex-wrap gap-2">
                   {["React", "System Design", "Communication"].map((skill, idx) => (
                     <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-100 font-medium">
                       {skill}
                     </span>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapPreview;