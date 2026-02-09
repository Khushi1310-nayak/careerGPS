import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import HowItWorks from './components/HowItWorks';
import RoadmapPreview from './components/RoadmapPreview';
import Pricing from './components/Pricing';
import MicroInteractions from './components/MicroInteractions';
import ResponsibleAI from './components/ResponsibleAI';
import Footer from './components/Footer';
import RoadmapOverlay from './components/RoadmapOverlay';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import RoadmapPage from './components/RoadmapPage';
import ProjectsPage, { Project } from './components/ProjectsPage';
import PremiumPage from './components/PremiumPage';
import SettingsPage from './components/SettingsPage';
import LogoutModal from './components/LogoutModal';

export interface UserData {
  name: string;
  email: string;
  role: string;
  alignmentScore: number;
  isPremium: boolean;
  plan: 'free' | 'monthly' | 'yearly';
  tasksCompleted: number;
  timeSpent: number; // in minutes
  goals: string[];
  savedProjects: Project[];
}

const App: React.FC = () => {
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Initial State Helper
  const getInitialState = (): UserData => ({
    name: "Khushi",
    email: "khushi@example.com",
    role: "SDE @ Product",
    alignmentScore: 0, 
    isPremium: false,
    plan: 'free',
    tasksCompleted: 0,
    timeSpent: 124,
    goals: ["Master React", "System Design LLD", "Mock Interviews"],
    savedProjects: []
  });

  // Global State
  const [userData, setUserData] = useState<UserData>(getInitialState());
  
  useEffect(() => {
    // Optional: Smooth scroll polyfill
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
      setAuthMode(mode);
      setIsAuthOpen(true);
  };

  const handleSignupSuccess = () => {
    setIsAuthOpen(false);
    setTimeout(() => {
        setIsOnboardingOpen(true);
    }, 300);
  };

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    setTimeout(() => {
        setIsLoggedIn(true);
        setActivePage('dashboard');
    }, 300);
  }

  const handleOnboardingComplete = () => {
      setIsOnboardingOpen(false);
      setTimeout(() => {
          setIsLoggedIn(true);
          setActivePage('dashboard');
      }, 500);
  }

  const handleLogoutConfirm = () => {
      setIsLogoutModalOpen(false);
      setIsLoggedIn(false);
      setActivePage('dashboard');
  }

  const handleLogoutCancel = () => {
      setIsLogoutModalOpen(false);
      // Redirect to dashboard if they haven't finished tasks
      setActivePage('dashboard');
  }

  // Global State Updaters
  const updateUserData = (newData: Partial<UserData>) => {
      setUserData(prev => ({ ...prev, ...newData }));
  };

  const increaseAlignment = (amount: number) => {
      setUserData(prev => ({ 
          ...prev, 
          alignmentScore: Math.min(100, prev.alignmentScore + amount) 
      }));
  };

  const handleSaveProject = (project: Project) => {
      setUserData(prev => {
          // Avoid duplicates
          if (prev.savedProjects.find(p => p.id === project.id)) return prev;
          return { ...prev, savedProjects: [...prev.savedProjects, project] };
      });
  };

  const handleClearData = () => {
      // Reset to default state but keep name/email slightly personalized or just wipe it all
      setUserData({
          ...getInitialState(),
          name: userData.name, // Keep name for UX
          email: userData.email,
          savedProjects: []
      });
      // Optionally notify user
      alert("All data cleared and reset to defaults.");
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-pink-500/30 overflow-hidden relative bg-[#2c0003]">
      {/* Global Gradient Background */}
      <div className="fixed inset-0 w-full h-full -z-50 bg-gradient-to-b from-[#2c0003] via-[#4a0404] to-[#fbc2eb]" />
      <div className="fixed inset-0 w-full h-full -z-40 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Main Content Layout */}
      {!isLoggedIn ? (
          <div className={`transition-all duration-700 ${(isRoadmapOpen || isAuthOpen || isOnboardingOpen) ? 'blur-sm scale-95 opacity-50' : ''}`}>
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto backdrop-blur-md bg-white/10 border border-white/20 px-6 py-2 rounded-full shadow-lg shadow-rose-900/20 cursor-pointer" onClick={() => window.location.reload()}>
                <span className="font-serif italic font-bold tracking-wide text-white text-lg">CareerGPS</span>
                </div>
                <div className="pointer-events-auto backdrop-blur-md bg-white/10 border border-white/20 px-6 py-2 rounded-full shadow-lg shadow-rose-900/20 hover:bg-white/20 transition-all cursor-pointer">
                    <button 
                        onClick={() => openAuth('login')}
                        className="text-sm font-medium text-white hover:text-pink-200 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </nav>

            <Hero 
                onOpenRoadmap={() => setIsRoadmapOpen(true)} 
                onGetStarted={() => openAuth('signup')}
            />
            <TrustStrip />
            <HowItWorks />
            <RoadmapPreview />
            <MicroInteractions />
            <Pricing />
            <ResponsibleAI />
            <Footer onStartCareerMap={() => openAuth('signup')} />
          </div>
      ) : (
          <div className="flex min-h-screen">
              <Sidebar 
                  activePage={activePage} 
                  onNavigate={setActivePage} 
                  onLogout={() => setIsLogoutModalOpen(true)} 
              />
              {/* Responsive Margin: ml-0 mb-20 for mobile (bottom nav), ml-20 mb-0 for desktop (left sidebar) */}
              <main className="flex-1 ml-0 mb-20 md:ml-20 md:mb-0 transition-all duration-300">
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={activePage}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="min-h-screen"
                      >
                          {activePage === 'dashboard' && (
                            <Dashboard 
                                onOpenRoadmap={() => setActivePage('roadmap')} 
                                userData={userData}
                                onUpdateUser={updateUserData}
                                onIncreaseScore={increaseAlignment}
                            />
                          )}
                          {activePage === 'roadmap' && <RoadmapPage />}
                          {activePage === 'projects' && (
                            <ProjectsPage 
                                onSaveProject={handleSaveProject} 
                            />
                          )}
                          {activePage === 'premium' && (
                            <PremiumPage 
                                userData={userData}
                                onUpdateUser={updateUserData}
                            />
                          )}
                          {activePage === 'settings' && (
                            <SettingsPage 
                                userData={userData}
                                onUpdateUser={updateUserData}
                                onClearData={handleClearData}
                            />
                          )}
                      </motion.div>
                  </AnimatePresence>
              </main>
          </div>
      )}

      {/* Modals & Overlays */}
      <RoadmapOverlay isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        initialMode={authMode} 
        onClose={() => setIsAuthOpen(false)} 
        onSignupSuccess={handleSignupSuccess}
        onLoginSuccess={handleLoginSuccess}
      />

      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onComplete={handleOnboardingComplete} 
      />

      <LogoutModal 
         isOpen={isLogoutModalOpen} 
         onClose={handleLogoutCancel} 
         onConfirm={handleLogoutConfirm} 
      />
    </div>
  );
};

export default App;