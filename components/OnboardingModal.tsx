import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, GraduationCap, Target, Code, Cpu, Palette, Terminal, Check, Star, Clock, Briefcase, Zap, BookOpen, Video, Layout } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

// Types for form data
type FormData = {
  academicStage: string;
  primaryGoal: string;
  roles: string[];
  confidence: number;
  strengths: string[];
  timeCommitment: string;
  preferences: {
    companies: string;
    learningStyle: string;
  };
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for back
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    academicStage: '',
    primaryGoal: '',
    roles: [],
    confidence: 1, // 0: Beginner, 1: Intermediate, 2: Advanced
    strengths: [],
    timeCommitment: '',
    preferences: { companies: '', learningStyle: '' }
  });

  // Validation to enable Next button
  const isStepValid = () => {
    switch(step) {
      case 1: return !!formData.academicStage;
      case 2: return !!formData.primaryGoal;
      case 3: return formData.roles.length > 0;
      case 4: return true; // Slider always has value
      case 5: return formData.strengths.length > 0;
      case 6: return !!formData.timeCommitment;
      case 7: return !!formData.preferences.learningStyle;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 7) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    // Sequence for "Magical" generation
    const stages = ["Analyzing your inputs...", "Mapping skill paths...", "Aligning goals...", "Finalizing Roadmap"];
    
    stages.forEach((_, index) => {
        setTimeout(() => {
            setProcessingStage(index);
        }, index * 1200);
    });

    setTimeout(() => {
        onComplete();
    }, stages.length * 1200 + 500);
  };

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  // Animation Variants
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0, filter: "blur(4px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0, filter: "blur(4px)" })
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#2c0003] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-900/20 via-transparent to-black pointer-events-none" 
      />

      {isProcessing ? (
        <ProcessingView stage={processingStage} />
      ) : (
        <div className="relative w-full max-w-2xl px-6 flex flex-col h-screen md:h-auto md:min-h-[600px] justify-center">
            
            {/* Header: Progress */}
            <div className="absolute top-10 left-0 w-full px-6 md:px-0 flex justify-center mb-12">
                <div className="flex gap-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                        <motion.div 
                            key={s}
                            className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-rose-500' : 'bg-white/10'}`}
                            animate={{ width: s === step ? 32 : 8 }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center min-h-[400px]">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        {/* Step 1: Academic Stage */}
                        {step === 1 && (
                            <StepLayout 
                                question="Where are you right now?" 
                                subtext="We tailor the roadmap intensity based on your timeline."
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {["1st Year", "2nd Year", "3rd Year", "Final Year"].map((year, idx) => (
                                        <SelectionCard 
                                            key={year} 
                                            selected={formData.academicStage === year}
                                            onClick={() => setFormData({...formData, academicStage: year})}
                                            delay={idx * 0.1}
                                            icon={<GraduationCap className="w-5 h-5" />}
                                            label={year}
                                        />
                                    ))}
                                </div>
                            </StepLayout>
                        )}

                        {/* Step 2: Goal */}
                        {step === 2 && (
                             <StepLayout 
                                question="What is your primary goal?" 
                                subtext="This defines the outcome of your roadmap."
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { l: "Placement", i: <Briefcase /> }, 
                                        { l: "Higher Studies", i: <BookOpen /> }, 
                                        { l: "Internship", i: <Zap /> }, 
                                        { l: "Startup / Freelance", i: <Star /> }
                                    ].map((opt, idx) => (
                                        <SelectionCard 
                                            key={opt.l} 
                                            selected={formData.primaryGoal === opt.l}
                                            onClick={() => setFormData({...formData, primaryGoal: opt.l})}
                                            delay={idx * 0.1}
                                            icon={React.cloneElement(opt.i as React.ReactElement<any>, { className: "w-5 h-5" })}
                                            label={opt.l}
                                        />
                                    ))}
                                </div>
                            </StepLayout>
                        )}

                        {/* Step 3: Roles (Multi) */}
                        {step === 3 && (
                            <StepLayout 
                                question="Which roles interest you?" 
                                subtext="Select up to 3. We'll find the intersections."
                            >
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {[
                                        { l: "Software Engineer", i: <Terminal /> },
                                        { l: "Web Developer", i: <Code /> },
                                        { l: "Data / AI", i: <Cpu /> },
                                        { l: "UI/UX Designer", i: <Palette /> },
                                        { l: "Product Manager", i: <Layout /> },
                                    ].map((role, idx) => {
                                        const isSelected = formData.roles.includes(role.l);
                                        return (
                                            <motion.button
                                                key={role.l}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => {
                                                    const newRoles = isSelected 
                                                        ? formData.roles.filter(r => r !== role.l)
                                                        : formData.roles.length < 3 ? [...formData.roles, role.l] : formData.roles;
                                                    setFormData({...formData, roles: newRoles});
                                                }}
                                                className={`px-6 py-3 rounded-full border flex items-center gap-3 transition-all duration-300 group
                                                    ${isSelected 
                                                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                                                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'}`
                                                }
                                            >
                                                <span className={isSelected ? 'text-rose-300' : 'text-white/40 group-hover:text-white/70'}>
                                                    {React.cloneElement(role.i as React.ReactElement<any>, { size: 18 })}
                                                </span>
                                                <span className="font-medium">{role.l}</span>
                                                {isSelected && <motion.div layoutId="check"><Check size={14} className="text-rose-400" /></motion.div>}
                                            </motion.button>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 text-center text-xs text-white/30">
                                    {formData.roles.length}/3 selected
                                </div>
                            </StepLayout>
                        )}

                        {/* Step 4: Confidence */}
                        {step === 4 && (
                            <StepLayout 
                                question="How confident are you currently?" 
                                subtext="Be honest. This sets the starting difficulty."
                            >
                                <div className="px-4 py-8">
                                    <div className="relative h-2 bg-white/10 rounded-full mb-12">
                                        <motion.div 
                                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
                                            animate={{ width: `${formData.confidence * 50}%` }}
                                        />
                                        {/* Thumbs */}
                                        {[0, 1, 2].map((val) => (
                                            <button 
                                                key={val}
                                                onClick={() => setFormData({...formData, confidence: val})}
                                                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                                                    ${formData.confidence === val 
                                                        ? 'bg-rose-500 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-125 z-10' 
                                                        : 'bg-[#2c0003] border-white/20 hover:border-white/50'}`}
                                                style={{ left: `${val * 50}%`, marginLeft: val === 0 ? 0 : val === 2 ? -32 : -16 }}
                                            >
                                                {formData.confidence === val && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="flex justify-between text-center">
                                        <div onClick={() => setFormData({...formData, confidence: 0})} className={`cursor-pointer transition-colors ${formData.confidence === 0 ? 'text-white' : 'text-white/30'}`}>
                                            <div className="font-serif italic text-xl mb-1">Beginner</div>
                                            <div className="text-xs">Needs fundamentals</div>
                                        </div>
                                        <div onClick={() => setFormData({...formData, confidence: 1})} className={`cursor-pointer transition-colors ${formData.confidence === 1 ? 'text-white' : 'text-white/30'}`}>
                                            <div className="font-serif italic text-xl mb-1">Intermediate</div>
                                            <div className="text-xs">Can build basics</div>
                                        </div>
                                        <div onClick={() => setFormData({...formData, confidence: 2})} className={`cursor-pointer transition-colors ${formData.confidence === 2 ? 'text-white' : 'text-white/30'}`}>
                                            <div className="font-serif italic text-xl mb-1">Advanced</div>
                                            <div className="text-xs">Job ready</div>
                                        </div>
                                    </div>
                                </div>
                            </StepLayout>
                        )}

                        {/* Step 5: Strengths */}
                        {step === 5 && (
                             <StepLayout 
                                question="What feels most natural to you?" 
                                subtext="We'll leverage these strengths."
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {["Logical Thinking", "Visual Creativity", "Consistency", "Communication"].map((str, idx) => {
                                        const isSelected = formData.strengths.includes(str);
                                        return (
                                            <SelectionCard 
                                                key={str} 
                                                selected={isSelected}
                                                onClick={() => {
                                                     const newStrengths = isSelected 
                                                        ? formData.strengths.filter(s => s !== str)
                                                        : [...formData.strengths, str];
                                                    setFormData({...formData, strengths: newStrengths});
                                                }}
                                                delay={idx * 0.1}
                                                icon={<Star className="w-4 h-4" />} // Simplified icon for all
                                                label={str}
                                            />
                                        )
                                    })}
                                </div>
                            </StepLayout>
                        )}

                         {/* Step 6: Time */}
                         {step === 6 && (
                             <StepLayout 
                                question="How much time can you give daily?" 
                                subtext="Consistency > Intensity."
                            >
                                <div className="flex flex-col gap-3">
                                    {["< 1 hour", "1–2 hours", "2–3 hours", "3+ hours"].map((t, idx) => (
                                        <SelectionCard 
                                            key={t} 
                                            selected={formData.timeCommitment === t}
                                            onClick={() => setFormData({...formData, timeCommitment: t})}
                                            delay={idx * 0.1}
                                            icon={<Clock className="w-5 h-5" />}
                                            label={t}
                                            isList
                                        />
                                    ))}
                                </div>
                            </StepLayout>
                        )}

                        {/* Step 7: Preferences */}
                        {step === 7 && (
                             <StepLayout 
                                question="Final touches..." 
                                subtext="Customize your learning experience."
                            >
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-rose-200/70 mb-2">Preferred Learning Style</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                {l: "Video", i: <Video />}, 
                                                {l: "Text", i: <BookOpen />}, 
                                                {l: "Hands-on", i: <Code />}
                                            ].map(s => (
                                                <button
                                                    key={s.l}
                                                    onClick={() => setFormData({...formData, preferences: {...formData.preferences, learningStyle: s.l}})}
                                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all
                                                        ${formData.preferences.learningStyle === s.l 
                                                            ? 'bg-rose-500/20 border-rose-500 text-white' 
                                                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                                                >
                                                    {React.cloneElement(s.i as React.ReactElement<any>, { size: 20 })}
                                                    <span className="text-xs">{s.l}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm text-rose-200/70 mb-2">Dream Company (Optional)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.preferences.companies}
                                                onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, companies: e.target.value}})}
                                                placeholder="e.g. Google, Airbnb, or 'Any Startups'"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </StepLayout>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between h-16">
                <button 
                    onClick={handleBack}
                    className={`flex items-center gap-2 text-white/50 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <motion.button 
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    whileHover={isStepValid() ? { scale: 1.05 } : {}}
                    whileTap={isStepValid() ? { scale: 0.95 } : {}}
                    className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-xl
                        ${isStepValid() 
                            ? 'bg-white text-rose-900 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]' 
                            : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                >
                    {step === 7 ? 'Generate Roadmap' : 'Next Step'}
                    {step !== 7 && <ArrowRight className="w-4 h-4" />}
                </motion.button>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const StepLayout: React.FC<{ question: string; subtext: string; children: React.ReactNode }> = ({ question, subtext, children }) => (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
        <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-serif italic font-bold text-white text-center mb-4 leading-tight"
        >
            {question}
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-rose-200/60 text-center mb-10 text-sm md:text-base"
        >
            {subtext}
        </motion.p>
        <div className="w-full">
            {children}
        </div>
    </div>
);

const SelectionCard: React.FC<{ selected: boolean; onClick: () => void; delay: number; icon: React.ReactNode; label: string; isList?: boolean }> = ({ selected, onClick, delay, icon, label, isList }) => (
    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`relative overflow-hidden rounded-xl border text-left transition-all duration-300 group
            ${isList ? 'px-6 py-4 flex items-center gap-4 w-full' : 'p-6 flex flex-col items-center justify-center gap-3 h-32 w-full'}
            ${selected 
                ? 'bg-rose-900/40 border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)]' 
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`
        }
    >
        <div className={`p-2 rounded-full transition-colors ${selected ? 'bg-rose-500 text-white' : 'bg-white/10 text-white/50 group-hover:text-white'}`}>
            {icon}
        </div>
        <span className={`font-medium text-lg ${selected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
            {label}
        </span>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </motion.button>
);

const ProcessingView: React.FC<{ stage: number }> = ({ stage }) => (
    <div className="flex flex-col items-center justify-center h-full max-w-md text-center px-6">
        <div className="relative w-24 h-24 mb-10">
            {/* Spinning Rings */}
            <motion.div 
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-rose-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-pink-300"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white fill-white animate-pulse" />
            </div>
        </div>

        <div className="h-20 flex flex-col items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.h3
                    key={stage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-serif italic text-white mb-2"
                >
                    {stage === 0 ? "Analyzing inputs..." : 
                     stage === 1 ? "Mapping skill paths..." :
                     stage === 2 ? "Aligning goals..." : "Finalizing Roadmap..."}
                </motion.h3>
            </AnimatePresence>
        </div>

        {/* Thin Loading Line */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
            <motion.div 
                className="h-full bg-rose-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "easeInOut" }}
            />
        </div>
    </div>
);

export default OnboardingModal;