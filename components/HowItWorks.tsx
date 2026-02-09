import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Target, Route } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const cards = [
    {
      id: 1,
      title: "Answer 7 Smart Questions",
      desc: "We analyze your interests, strengths, and anti-goals to create a profile that actually sounds like you.",
      icon: <ClipboardList className="w-7 h-7 text-white" />,
      color: "from-rose-500 to-pink-500",
      delay: 0
    },
    {
      id: 2,
      title: "Get Your Alignment Score",
      desc: "See how well your current path matches your true potential with our proprietary matching engine.",
      icon: <Target className="w-7 h-7 text-white" />,
      color: "from-purple-500 to-indigo-500",
      delay: 0.1
    },
    {
      id: 3,
      title: "Follow a Structured Roadmap",
      desc: "A step-by-step execution plan broken down into weeks, not vague 'someday' advice.",
      icon: <Route className="w-7 h-7 text-white" />,
      color: "from-amber-500 to-orange-500",
      delay: 0.2
    }
  ];

  return (
    <section className="py-32 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold italic text-white mb-6">
            Clarify your path in <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white">three steps</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -15, scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: card.delay
              }}
              className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-md shadow-xl flex flex-col items-start relative overflow-hidden group"
            >
              {/* Card Gradient Blob */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${card.color} rounded-full blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-8 shadow-lg z-10 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold font-serif italic text-white mb-4 z-10">{card.title}</h3>
              <p className="text-pink-100/80 leading-relaxed text-base z-10">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;