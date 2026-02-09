import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map, FolderKanban, Crown, Settings, LogOut, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { id: 'roadmap', label: 'Map', icon: <Map size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
    { id: 'premium', label: 'Premium', icon: <Crown size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  if (isMobile) {
      // --- MOBILE BOTTOM NAV ---
      return (
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#1a0505]/95 backdrop-blur-xl border-t border-rose-500/20 z-50 flex justify-around items-center px-2 pb-safe">
            {menuItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center gap-1 w-full h-full relative transition-colors ${isActive ? 'text-rose-400' : 'text-white/40'}`}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="mobileActive"
                                className="absolute -top-[1px] w-8 h-[2px] bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                            />
                        )}
                        <div className={isActive ? 'scale-110 transition-transform' : ''}>
                            {item.icon}
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                    </button>
                )
            })}
            <button
                onClick={onLogout}
                className="flex flex-col items-center justify-center gap-1 w-full h-full text-white/40 active:text-red-400"
            >
                <LogOut size={20} />
                <span className="text-[10px] font-medium tracking-wide">Exit</span>
            </button>
        </nav>
      )
  }

  // --- DESKTOP SIDEBAR ---
  return (
    <motion.aside
      initial={{ width: '5rem' }}
      animate={{ width: isHovered ? '16rem' : '5rem' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col bg-[#2c0003]/80 backdrop-blur-xl border-r border-rose-500/10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
        <span className="text-xl font-serif italic font-bold text-white whitespace-nowrap">
            {isHovered ? 'CareerGPS' : 'C'}
        </span>
        {isHovered && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute right-4 text-rose-500/50"
            >
                <ChevronRight size={14} />
            </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden
                ${isActive ? 'bg-rose-500/20 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-pink-100/50 hover:bg-white/5 hover:text-pink-100'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute left-0 w-1 h-6 bg-rose-500 rounded-r-full"
                />
              )}
              
              <div className="w-14 flex-shrink-0 flex items-center justify-center">
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-rose-300' : ''}`}>
                    {item.icon}
                </div>
              </div>

              <motion.span
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                className="whitespace-nowrap font-medium text-sm"
              >
                {item.label}
              </motion.span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="flex items-center w-full h-12 rounded-xl text-red-300/60 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group px-0"
        >
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
             <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <motion.span
             animate={{ opacity: isHovered ? 1 : 0 }}
             className="whitespace-nowrap font-medium text-sm"
          >
            Log Out
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;