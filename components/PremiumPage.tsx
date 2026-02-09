import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, X, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { UserData } from '../App';
import emailjs from '@emailjs/browser';

interface PremiumPageProps {
    userData: UserData;
    onUpdateUser: (data: Partial<UserData>) => void;
}

type PlanType = 'monthly' | 'yearly';

// --- CONFIGURATION ---
// Replace these with your actual EmailJS IDs
const EMAILJS_SERVICE_ID = "service_placeholder"; 
const EMAILJS_TEMPLATE_ID = "template_placeholder";
const EMAILJS_PUBLIC_KEY = "user_placeholder"; 

const PremiumPage: React.FC<PremiumPageProps> = ({ userData, onUpdateUser }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto min-h-screen flex flex-col items-center">
       <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif italic font-bold text-white mb-4">Unlock Your Full Potential</h1>
        <p className="text-pink-100/60 text-lg">Join the top 1% of students who map their future with precision.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
         {/* Monthly */}
         <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col"
         >
            <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
            <div className="text-4xl font-serif text-white mb-6">₹299<span className="text-sm font-sans text-white/50">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
                {["Full Roadmap Access", "Weekly Breakdown", "Basic Project Ideas"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-pink-100/70">
                        <Check size={18} className="text-white" /> {feat}
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => setSelectedPlan('monthly')}
                className="w-full py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
            >
                Select Monthly
            </button>
         </motion.div>

         {/* Yearly */}
         <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative p-8 rounded-3xl border border-rose-500/50 bg-gradient-to-b from-rose-900/80 to-[#2c0003] flex flex-col shadow-2xl overflow-hidden"
         >
            <div className="absolute top-0 right-0 px-4 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-widest rounded-bl-xl animate-pulse">
                Best Value
            </div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Yearly <Star size={20} className="fill-rose-400 text-rose-400" />
            </h3>
            <div className="text-4xl font-serif text-white mb-6">₹1,999<span className="text-sm font-sans text-white/50">/yr</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
                {["Everything in Monthly", "Resume Gap Analysis", "Mock Interview Prep", "Priority AI Insights", "Alumni Network Access"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                        <div className="p-1 rounded-full bg-rose-500"><Check size={12} className="text-white" /></div> {feat}
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => setSelectedPlan('yearly')}
                className="w-full py-4 rounded-xl bg-white text-rose-900 font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
            >
                Go Premium
            </button>
         </motion.div>
      </div>

      {/* Activation Modal */}
      <AnimatePresence>
          {selectedPlan && (
              <PremiumActivationModal 
                plan={selectedPlan} 
                onClose={() => setSelectedPlan(null)} 
                userData={userData}
                onSuccess={(plan) => onUpdateUser({ isPremium: true, plan: plan })}
              />
          )}
      </AnimatePresence>
    </div>
  );
};

const PremiumActivationModal = ({ plan, onClose, userData, onSuccess }: { plan: PlanType, onClose: () => void, userData: UserData, onSuccess: (p: PlanType) => void }) => {
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [role, setRole] = useState(userData.role);
    const [purpose, setPurpose] = useState('All of the above');
    const [longTermGoal, setLongTermGoal] = useState('Placement');
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isYearly = plan === 'yearly';

    const handleActivate = async () => {
        if (!agree) return;
        setLoading(true);

        const templateParams = {
            name: name,
            email: email,
            plan: plan,
            role: role,
            purpose: purpose,
            longTermGoal: isYearly ? longTermGoal : 'N/A'
        };

        try {
            // Attempt to send email
            // Note: In a real environment, replace placeholders with actual keys from EmailJS Dashboard
            if (EMAILJS_SERVICE_ID !== "service_placeholder") {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                );
            } else {
                console.log("Mock Email Sent:", templateParams);
                // Simulate network delay if no keys provided
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            setLoading(false);
            setSuccess(true);
            
            // Trigger parent state update
            onSuccess(plan);

            // Close after showing success
            setTimeout(() => {
                onClose();
            }, 2500);

        } catch (error) {
            console.error("EmailJS Error:", error);
            setLoading(false);
            alert("Activation processed, but email failed to send (check console/keys). Premium unlocked.");
            setSuccess(true);
            onSuccess(plan);
            setTimeout(() => onClose(), 2500);
        }
    };

    return (
        <>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" 
                onClick={onClose}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.96 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-[#2c0003] rounded-3xl z-[110] overflow-y-auto custom-scrollbar border-2 shadow-2xl flex flex-col
                    ${isYearly ? 'border-amber-500/30' : 'border-pink-300/30'}`} // Conditional Border
            >
                {success ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                            >
                                <Check size={40} className="text-emerald-400" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-serif italic font-bold text-white mb-2">Activated!</h2>
                        <p className="text-white/60 mb-6">Welcome to CareerGPS Premium. Check your email for details.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className={`p-6 border-b flex justify-between items-center ${isYearly ? 'bg-gradient-to-r from-amber-900/20 to-[#2c0003] border-amber-500/20' : 'bg-gradient-to-r from-rose-900/20 to-[#2c0003] border-white/10'}`}>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Activate {plan === 'monthly' ? 'Monthly' : 'Yearly'} Premium
                                    {isYearly && <Star size={16} className="text-amber-400 fill-amber-400" />}
                                </h2>
                                <p className="text-xs text-white/50">No payment required. Demo access.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18} className="text-white/50" /></button>
                        </div>

                        {/* Form */}
                        <div className="p-8 space-y-5">
                            <InputField label="Full Name" value={name} onChange={setName} delay={0.1} />
                            <InputField label="Email Address" value={email} onChange={setEmail} delay={0.2} />
                            
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                <label className="text-xs uppercase font-bold text-rose-300 tracking-widest mb-1 block">Current Role / Goal</label>
                                <select 
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none appearance-none"
                                >
                                    <option className="bg-[#2c0003] text-white">Software Engineer</option>
                                    <option className="bg-[#2c0003] text-white">Frontend</option>
                                    <option className="bg-[#2c0003] text-white">Backend</option>
                                    <option className="bg-[#2c0003] text-white">Data</option>
                                    <option className="bg-[#2c0003] text-white">Other</option>
                                </select>
                            </motion.div>

                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                <label className="text-xs uppercase font-bold text-rose-300 tracking-widest mb-1 block">Primary Purpose</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Resume improvement", "Projects", "Roadmaps", "All of the above"].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => setPurpose(opt)}
                                            className={`text-xs p-2 rounded-lg border transition-all ${purpose === opt ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-white/50'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Yearly Exclusive */}
                            {isYearly && (
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <label className="text-xs uppercase font-bold text-amber-300 tracking-widest mb-1 block">Long-term Goal (6-12 mo)</label>
                                    <select 
                                        value={longTermGoal}
                                        onChange={(e) => setLongTermGoal(e.target.value)}
                                        className="w-full bg-black/20 border border-amber-500/30 rounded-xl p-3 text-white focus:border-amber-500 outline-none appearance-none"
                                    >
                                        <option className="bg-[#2c0003] text-white">Internship</option>
                                        <option className="bg-[#2c0003] text-white">Placement</option>
                                        <option className="bg-[#2c0003] text-white">Higher Studies</option>
                                        <option className="bg-[#2c0003] text-white">Startup</option>
                                    </select>
                                </motion.div>
                            )}

                            {/* Disclaimer */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 cursor-pointer"
                                onClick={() => setAgree(!agree)}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${agree ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}>
                                    {agree && <Check size={14} className="text-white" />}
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed select-none">
                                    I understand this is a <strong className="text-white">demo premium experience</strong> with no real charges. No payment gateway is connected.
                                </p>
                            </motion.div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5">Cancel</button>
                                <button 
                                    onClick={handleActivate}
                                    disabled={!agree || loading}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                        ${!agree ? 'bg-white/10 text-white/30 cursor-not-allowed' : 
                                          isYearly ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/40' : 
                                          'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-900/40'}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Activate Now'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </>
    )
}

const InputField = ({ label, value, onChange, delay }: any) => (
    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay }}>
        <label className="text-xs uppercase font-bold text-rose-300 tracking-widest mb-1 block">{label}</label>
        <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none" 
        />
    </motion.div>
)

export default PremiumPage;