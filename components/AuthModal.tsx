import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Check, AlertCircle, Eye, EyeOff, Loader2, ShieldCheck, History } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSignupSuccess?: () => void;
  onLoginSuccess?: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'email-sent';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, onSignupSuccess, onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
        setView(initialMode);
        setError(null);
        setLoading(false);
    }
  }, [isOpen, initialMode]);

  // Handle ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const variants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2c0003]/90 backdrop-blur-md"
          />
          
          {/* Background Gradient Animation */}
          <motion.div 
            className="absolute inset-0 pointer-events-none opacity-30"
            animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            style={{
                background: 'radial-gradient(circle at center, #5e0a0a 0%, #2c0003 80%)',
                backgroundSize: '150% 150%'
            }}
          />

          {/* Modal Card */}
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-[#2c0003]/60 border border-pink-500/20 backdrop-blur-2xl shadow-2xl shadow-rose-900/50 rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 z-20 p-2 rounded-full text-pink-200/50 hover:text-white hover:bg-white/10 transition-all"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Content Scroll Wrapper */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">
                <AnimatePresence mode="wait">
                    {view === 'login' && <LoginForm key="login" onChangeView={setView} setLoading={setLoading} setError={setError} error={error} loading={loading} onLoginSuccess={onLoginSuccess} />}
                    {view === 'signup' && <SignupForm key="signup" onChangeView={setView} setLoading={setLoading} setError={setError} error={error} loading={loading} onSignupSuccess={onSignupSuccess} />}
                    {view === 'forgot-password' && <ForgotPasswordForm key="forgot" onChangeView={setView} setLoading={setLoading} loading={loading} />}
                    {view === 'email-sent' && <EmailSentView key="sent" onChangeView={setView} />}
                    {view === 'reset-password' && <ResetPasswordForm key="reset" onChangeView={setView} setLoading={setLoading} setError={setError} error={error} loading={loading} />}
                </AnimatePresence>
            </div>

            {/* Bottom Strip (Terms) */}
            <div className="relative z-10 py-4 px-6 border-t border-white/5 bg-black/20 text-center shrink-0">
                <p className="text-[10px] text-pink-200/40 uppercase tracking-widest font-medium">
                    Secure CareerGPS Access
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Sub-Components ---

const FloatingInput = ({ label, type = "text", error, value, onChange, icon: Icon }: any) => {
    const [focused, setFocused] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

    return (
        <div className="relative mb-5">
            <motion.div 
                className={`absolute left-0 top-0 h-full w-10 flex items-center justify-center transition-colors duration-300 ${focused ? 'text-rose-400' : 'text-white/30'}`}
            >
                <Icon className="w-4 h-4" />
            </motion.div>
            
            <input
                type={inputType}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full bg-white/5 border rounded-xl py-3.5 pl-10 pr-10 text-pink-50 placeholder-transparent focus:outline-none transition-all duration-500
                    ${error ? 'border-red-500/50 focus:border-red-500 bg-red-500/5' : 
                      focused ? 'border-rose-500/50 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)] bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                placeholder={label}
            />
            
            <label 
                className={`absolute left-10 transition-all duration-300 pointer-events-none font-medium
                    ${(focused || value) ? '-top-2.5 text-[10px] bg-[#2c0003] px-2 text-rose-300 rounded-full border border-rose-500/20' : 'top-3.5 text-sm text-pink-200/40'}`}
            >
                {label}
            </label>

            {isPassword && (
                <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3.5 text-pink-200/30 hover:text-white transition-colors"
                >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
};

const LoginForm = ({ onChangeView, setLoading, setError, error, loading, onLoginSuccess }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        setTimeout(() => {
            setLoading(false);
            if (email.includes('error')) {
                setError("Invalid credentials.");
            } else {
                if(onLoginSuccess) onLoginSuccess();
            }
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-2">
            <h2 className="text-3xl font-serif italic font-bold text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-pink-200/60 text-sm mb-8 text-center">Access your personalized roadmap.</p>
            
            <form onSubmit={handleSubmit}>
                <FloatingInput label="Email Address" icon={Mail} value={email} onChange={setEmail} error={!!error} />
                <FloatingInput label="Password" type="password" icon={Lock} value={password} onChange={setPassword} error={!!error} />
                
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-xs mb-4 flex items-center justify-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-3 h-3" /> {error}
                    </motion.div>
                )}

                <div className="flex justify-end mb-6">
                    <button type="button" onClick={() => onChangeView('forgot-password')} className="text-xs text-pink-200/60 hover:text-rose-300 transition-colors font-medium">
                        Forgot Password?
                    </button>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold shadow-lg shadow-rose-900/40 hover:shadow-rose-900/60 transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-white/10"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </motion.button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-pink-200/40 mb-3">Don't have an account?</p>
                <button onClick={() => onChangeView('signup')} className="text-sm text-rose-300 font-semibold hover:text-white transition-colors border-b border-rose-500/30 hover:border-white pb-0.5">
                    Create Premium Account
                </button>
            </div>
        </motion.div>
    );
};

const SignupForm = ({ onChangeView, setLoading, setError, error, loading, onSignupSuccess }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [rules, setRules] = useState(false);
    
    // Password Strength Logic
    const hasMin = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const strength = [hasMin, hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (strength < 5) {
            setError("Please meet all password requirements.");
            return;
        }
        if (!rules) {
            setError("You must agree to the Responsible Usage rules.");
            return;
        }

        setLoading(true);
        setError(null);

        // Simulate Checks
        setTimeout(() => {
            setLoading(false);
            if (password === "Password123!") {
                setError("Cannot reuse previous passwords."); // Mock history check
            } else if (email === "test@example.com") {
                setError("This email is already registered."); // Mock unique check
            } else {
                console.log("Registered");
                if (onSignupSuccess) onSignupSuccess();
            }
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-2">
            <h2 className="text-3xl font-serif italic font-bold text-white mb-2 text-center">Start Your Journey</h2>
            <p className="text-pink-200/60 text-sm mb-6 text-center">Built for students who refuse to drift.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput label="Full Name" icon={User} value={name} onChange={setName} />
                <FloatingInput label="Email Address" icon={Mail} value={email} onChange={setEmail} error={error?.includes("email")} />
                
                <div className="space-y-2">
                    <FloatingInput label="Password" type="password" icon={Lock} value={password} onChange={setPassword} />
                    
                    {/* Visual Strength Meter */}
                    <div className="flex gap-1 h-1 mb-2 bg-white/5 rounded-full overflow-hidden">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`flex-1 transition-all duration-500 ${strength >= s ? (strength === 5 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500') : 'opacity-0'}`} />
                        ))}
                    </div>
                    {/* Rules Checklist */}
                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 mb-4">
                         {[
                             { lbl: "8+ Chars", met: hasMin },
                             { lbl: "Uppercase", met: hasUpper },
                             { lbl: "Lowercase", met: hasLower },
                             { lbl: "Number", met: hasNum },
                             { lbl: "Special Char", met: hasSpecial },
                         ].map((r, i) => (
                             <div key={i} className={`text-[10px] flex items-center gap-1.5 transition-colors ${r.met ? 'text-emerald-400 font-medium' : 'text-white/30'}`}>
                                 <div className={`w-1 h-1 rounded-full ${r.met ? 'bg-emerald-400' : 'bg-white/30'}`} /> {r.lbl}
                             </div>
                         ))}
                    </div>
                </div>

                <FloatingInput label="Confirm Password" type="password" icon={Lock} value={confirm} onChange={setConfirm} error={error?.includes("match")} />

                <div className="flex items-start gap-3 mt-4 group cursor-pointer bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors" onClick={() => setRules(!rules)}>
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${rules ? 'bg-rose-500 border-rose-500' : 'border-white/30 group-hover:border-white'}`}>
                        {rules && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p className="text-xs text-pink-100/70 leading-relaxed select-none">
                        I agree to the <span className="text-rose-300 font-medium">Rules & Responsible Usage</span>. One account per user. No misuse of AI.
                    </p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs flex items-center justify-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                        <AlertCircle className="w-3 h-3" /> {error}
                    </motion.div>
                )}

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full mt-4 py-3.5 rounded-xl bg-white text-rose-900 font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-rose-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </motion.button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={() => onChangeView('login')} className="text-xs text-pink-200/50 hover:text-white transition-colors font-medium">
                    Already have an account? <span className="text-rose-300">Login</span>
                </button>
            </div>
        </motion.div>
    );
};

const ForgotPasswordForm = ({ onChangeView, setLoading, loading }: any) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onChangeView('email-sent');
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4">
            <h2 className="text-2xl font-serif italic text-white mb-2 text-center">Reset Password</h2>
            <p className="text-pink-200/60 text-sm mb-8 text-center">Enter your email to receive a secure link.</p>
            
            <form onSubmit={handleSubmit}>
                <FloatingInput label="Email Address" icon={Mail} value={email} onChange={setEmail} />
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-bold shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2 hover:bg-rose-500"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                </motion.button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={() => onChangeView('login')} className="text-xs text-pink-200/50 hover:text-white transition-colors">
                    Back to Login
                </button>
            </div>
        </motion.div>
    );
};

const EmailSentView = ({ onChangeView }: any) => {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold font-serif italic text-white mb-2">Check your inbox</h3>
            <p className="text-pink-100/60 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                If an account exists, we've sent a secure reset link. It expires in 15 minutes.
            </p>
            
            <button onClick={() => onChangeView('login')} className="text-sm text-white font-medium hover:text-rose-300 transition-colors border-b border-white/20 hover:border-rose-300 pb-0.5">
                Back to Login
            </button>
            
            {/* Demo Only Button */}
            <div className="mt-12 pt-6 border-t border-white/5">
                <button onClick={() => onChangeView('reset-password')} className="text-[10px] text-white/10 hover:text-white/30 uppercase tracking-widest font-semibold transition-colors">
                    [Demo: Simulate Click Link]
                </button>
            </div>
        </motion.div>
    );
};

const ResetPasswordForm = ({ onChangeView, setLoading, setError, error, loading }: any) => {
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(pass !== confirm) {
            setError("Passwords do not match");
            return;
        }
        if(pass === "OldPassword1!") {
             setError("Cannot reuse previous passwords."); // Mock history check
             return;
        }
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setLoading(false);
            onChangeView('login');
        }, 1500);
    };

    return (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
             <div className="flex justify-center mb-6">
                 <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20">
                    <ShieldCheck className="w-10 h-10 text-rose-400" />
                 </div>
             </div>
            <h2 className="text-2xl font-serif italic text-center text-white mb-2">Secure Reset</h2>
            <p className="text-pink-200/60 text-center text-sm mb-8">Choose a strong, new password.</p>
            
            <form onSubmit={handleSubmit}>
                <FloatingInput label="New Password" type="password" icon={Lock} value={pass} onChange={setPass} />
                <FloatingInput label="Confirm Password" type="password" icon={Lock} value={confirm} onChange={setConfirm} error={!!error} />
                
                {error && (
                    <div className="text-red-400 text-xs mb-4 flex items-center justify-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                        <History className="w-3 h-3" /> {error}
                    </div>
                )}

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 hover:bg-emerald-500"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                </motion.button>
            </form>
        </motion.div>
    )
}

export default AuthModal;