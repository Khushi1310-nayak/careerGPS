import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ChevronRight, MessageSquare, Clock, AlertCircle, Info, CheckCircle2, Search, Crosshair, Play, Pause, RefreshCw, X, Menu } from 'lucide-react';

// --- Types ---
type RoleId = 'sde' | 'frontend' | 'backend' | 'fullstack' | 'data-analyst' | 'data-scientist' | 'ml' | 'devops' | 'mobile' | 'uiux';

interface RoleDefinition {
    id: RoleId;
    label: string;
    desc: string;
}

interface NodeData {
    id: string;
    label: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100 (100 is bottom)
    status: 'completed' | 'active' | 'pending' | 'locked';
    details: {
        description: string;
        why: string;
        time: string;
        tip: string;
    };
}

interface EdgeData {
    from: string;
    to: string;
}

// --- Data ---
const ROLES: RoleDefinition[] = [
    { id: 'sde', label: 'Software Engineer', desc: 'Generalist' },
    { id: 'frontend', label: 'Frontend Engineer', desc: 'Web UI & UX' },
    { id: 'backend', label: 'Backend Engineer', desc: 'API & Systems' },
    { id: 'fullstack', label: 'Full Stack Engineer', desc: 'End-to-End' },
    { id: 'data-analyst', label: 'Data Analyst', desc: 'Insights & Viz' },
    { id: 'data-scientist', label: 'Data Scientist', desc: 'Models & Stats' },
    { id: 'ml', label: 'ML Engineer', desc: 'AI Systems' },
    { id: 'devops', label: 'DevOps / Cloud', desc: 'Infra & CI/CD' },
    { id: 'mobile', label: 'Mobile Developer', desc: 'iOS & Android' },
    { id: 'uiux', label: 'UI/UX Engineer', desc: 'Design System' },
];

// Mock data generator for specific roles
const getRoadmapData = (role: RoleId): { nodes: NodeData[], edges: EdgeData[] } => {
    // Shared defaults for brevity in this demo
    const defaultDetails = {
        description: "Master the fundamentals to build a strong base.",
        why: "Essential for passing technical interviews and building scalable systems.",
        time: "3-4 Weeks",
        tip: "Build at least 2 mini-projects."
    };

    switch (role) {
        case 'frontend':
            return {
                nodes: [
                    { id: 'htmlcss', label: 'HTML & CSS', x: 50, y: 85, status: 'completed', details: { ...defaultDetails, description: "Semantic HTML and modern CSS Layouts (Flexbox/Grid).", time: "2 Weeks" } },
                    { id: 'js', label: 'JavaScript (ES6+)', x: 30, y: 70, status: 'active', details: { ...defaultDetails, description: "Async/Await, DOM manipulation, Closures.", why: "The language of the web.", time: "4-6 Weeks" } },
                    { id: 'react', label: 'React.js', x: 70, y: 55, status: 'pending', details: { ...defaultDetails, description: "Components, Hooks, State Management.", time: "6 Weeks" } },
                    { id: 'perf', label: 'Performance', x: 40, y: 40, status: 'locked', details: defaultDetails },
                    { id: 'a11y', label: 'Accessibility', x: 80, y: 35, status: 'locked', details: defaultDetails },
                    { id: 'system', label: 'Frontend System Design', x: 50, y: 15, status: 'locked', details: defaultDetails },
                ],
                edges: [
                    { from: 'htmlcss', to: 'js' },
                    { from: 'js', to: 'react' },
                    { from: 'react', to: 'perf' },
                    { from: 'react', to: 'a11y' },
                    { from: 'perf', to: 'system' },
                    { from: 'a11y', to: 'system' },
                ]
            };
        case 'backend':
             return {
                nodes: [
                    { id: 'lang', label: 'Java / Python', x: 50, y: 85, status: 'completed', details: defaultDetails },
                    { id: 'db', label: 'Databases (SQL)', x: 25, y: 70, status: 'active', details: defaultDetails },
                    { id: 'api', label: 'REST APIs', x: 75, y: 70, status: 'active', details: defaultDetails },
                    { id: 'auth', label: 'Auth (JWT/OAuth)', x: 50, y: 50, status: 'pending', details: defaultDetails },
                    { id: 'cache', label: 'Caching (Redis)', x: 30, y: 30, status: 'locked', details: defaultDetails },
                    { id: 'scale', label: 'Scalability', x: 60, y: 15, status: 'locked', details: defaultDetails },
                ],
                edges: [
                    { from: 'lang', to: 'db' },
                    { from: 'lang', to: 'api' },
                    { from: 'db', to: 'auth' },
                    { from: 'api', to: 'auth' },
                    { from: 'auth', to: 'cache' },
                    { from: 'cache', to: 'scale' },
                ]
             };
        // ... (Keep existing role cases) ...
        default:
            // SDE Generalist / Default
             return {
                nodes: [
                    { id: 'prog', label: 'Prog Basics', x: 50, y: 85, status: 'completed', details: defaultDetails },
                    { id: 'dsa', label: 'DSA & Algos', x: 50, y: 70, status: 'active', details: { ...defaultDetails, description: "Arrays, Trees, Graphs, DP.", why: "Crucial for OA and technical rounds." } },
                    { id: 'oop', label: 'OOPs', x: 30, y: 55, status: 'pending', details: defaultDetails },
                    { id: 'db', label: 'DBMS', x: 70, y: 55, status: 'pending', details: defaultDetails },
                    { id: 'os', label: 'OS & Networks', x: 50, y: 40, status: 'locked', details: defaultDetails },
                    { id: 'sys', label: 'System Design', x: 50, y: 20, status: 'locked', details: defaultDetails },
                ],
                edges: [
                    { from: 'prog', to: 'dsa' },
                    { from: 'dsa', to: 'oop' },
                    { from: 'dsa', to: 'db' },
                    { from: 'oop', to: 'os' },
                    { from: 'db', to: 'os' },
                    { from: 'os', to: 'sys' },
                ]
            };
    }
}

const RoadmapPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleId>('sde');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile, open on desktop via CSS
  const [isTourPlaying, setIsTourPlaying] = useState(false);

  // Force sidebar open on desktop initial render
  useEffect(() => {
      if(window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  const { nodes, edges } = getRoadmapData(selectedRole);
  const activeNodeData = nodes.find(n => n.id === selectedNodeId) || null;

  // Auto select first active node on role change
  useEffect(() => {
    if (!isTourPlaying) {
        const firstActive = nodes.find(n => n.status === 'active');
        setSelectedNodeId(firstActive ? firstActive.id : nodes[0].id);
    }
  }, [selectedRole, isTourPlaying]);

  // Tour Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTourPlaying) {
        let currentIndex = nodes.findIndex(n => n.id === selectedNodeId);
        if (currentIndex === -1) currentIndex = 0;

        interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % nodes.length;
            setSelectedNodeId(nodes[nextIndex].id);
            currentIndex = nextIndex;
        }, 3000); 
    }
    return () => clearInterval(interval);
  }, [isTourPlaying, nodes, selectedNodeId]);

  return (
    <div className="flex h-screen bg-[#2c0003] overflow-hidden text-white font-sans relative">
        
        {/* --- LEFT SIDEBAR (ROLES) --- */}
        <div className={`
            absolute md:relative z-40 h-full bg-[#1a0002]/95 backdrop-blur-xl border-r border-rose-500/10 flex flex-col transition-transform duration-300 w-64
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-serif italic font-bold text-white">Career Paths</h2>
                    <p className="text-xs text-white/40">Select your target role</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/50 p-2"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                {ROLES.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => { setSelectedRole(role.id); setIsTourPlaying(false); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                            ${selectedRole === role.id 
                                ? 'bg-gradient-to-r from-rose-900/60 to-transparent border border-rose-500/30' 
                                : 'hover:bg-white/5 border border-transparent'}`
                        }
                    >
                        <div className="relative z-10">
                            <div className={`text-sm font-bold ${selectedRole === role.id ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                {role.label}
                            </div>
                            <div className={`text-[10px] ${selectedRole === role.id ? 'text-rose-300' : 'text-white/30'}`}>
                                {role.desc}
                            </div>
                        </div>
                        {selectedRole === role.id && (
                             <motion.div 
                                layoutId="roleActive" 
                                className="absolute inset-0 bg-rose-500/5" 
                             />
                        )}
                    </button>
                ))}
            </div>

             {/* Premium Tease */}
             <div className="p-4 border-t border-white/5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-900 to-[#2c0003] border border-rose-500/30">
                    <div className="flex items-center gap-2 mb-1">
                        <Lock size={12} className="text-rose-300" />
                        <span className="text-[10px] uppercase font-bold text-rose-200">Premium Access</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-tight">Unlock deep-dive project suggestions for all 10 roles.</p>
                </div>
             </div>
        </div>

        {/* --- CENTER: CANVAS --- */}
        <div className="flex-1 relative flex flex-col h-full bg-gradient-to-b from-[#2c0003] to-[#150001]">
            
            {/* Canvas Header / Mobile Toggle */}
            <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
                 <div className="flex gap-2 pointer-events-auto">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2.5 bg-black/40 backdrop-blur rounded-full border border-white/10 text-white shadow-lg">
                        <Menu size={18} />
                    </button>
                    {/* Role Label on Mobile Header */}
                    <div className="md:hidden px-4 py-2 rounded-full bg-black/20 backdrop-blur border border-white/10 text-xs font-bold text-white shadow-lg">
                        {ROLES.find(r => r.id === selectedRole)?.label}
                    </div>
                 </div>

                 {/* Play Tour Button */}
                 <button 
                    onClick={() => setIsTourPlaying(!isTourPlaying)}
                    className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-lg
                        ${isTourPlaying 
                            ? 'bg-rose-500 border-rose-400 text-white animate-pulse' 
                            : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}
                 >
                    {isTourPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{isTourPlaying ? 'Playing' : 'Play'}</span>
                 </button>
            </div>

            {/* The Graph */}
            <div className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                {/* Nodes & Connections Render Container */}
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12 pb-24 md:pb-12">
                     <div className="relative w-full max-w-2xl aspect-[3/5] md:aspect-square">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <defs>
                                <linearGradient id="edge-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="#be123c" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            {edges.map((edge, i) => {
                                const fromNode = nodes.find(n => n.id === edge.from);
                                const toNode = nodes.find(n => n.id === edge.to);
                                if(!fromNode || !toNode) return null;
                                return (
                                    <motion.path
                                        key={i}
                                        d={`M ${fromNode.x}% ${fromNode.y}% C ${fromNode.x}% ${(fromNode.y + toNode.y)/2}%, ${toNode.x}% ${(fromNode.y + toNode.y)/2}%, ${toNode.x}% ${toNode.y}%`}
                                        stroke="url(#edge-gradient)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                    />
                                )
                            })}
                        </svg>

                        {nodes.map((node, i) => {
                            const isSelected = selectedNodeId === node.id;
                            const isLocked = node.status === 'locked';
                            
                            return (
                                <motion.button
                                    key={node.id}
                                    onClick={() => { setSelectedNodeId(node.id); setIsTourPlaying(false); }}
                                    className={`absolute w-10 h-10 md:w-16 md:h-16 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                                        ${isSelected ? 'scale-125 border-rose-400 bg-rose-900 shadow-[0_0_30px_rgba(244,63,94,0.6)]' : ''}
                                        ${node.status === 'completed' ? 'border-emerald-500/50 bg-[#0f291e]' : ''}
                                        ${node.status === 'active' ? 'border-rose-500 bg-[#2c0003] animate-pulse-slow' : ''}
                                        ${node.status === 'pending' ? 'border-white/20 bg-black/40' : ''}
                                        ${isLocked ? 'border-white/5 bg-white/5 grayscale opacity-70' : ''}
                                    `}
                                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: isSelected ? 1.25 : 1, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {isLocked ? <Lock size={14} className="text-white/30 md:w-5 md:h-5" /> : 
                                     node.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-400 md:w-6 md:h-6" /> :
                                     <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${node.status === 'active' ? 'bg-rose-500' : 'bg-white/30'}`} />}
                                    
                                    {/* Label */}
                                    <div className={`absolute top-full mt-2 whitespace-nowrap px-2 py-1 rounded bg-black/60 backdrop-blur text-[8px] md:text-xs font-medium z-20
                                        ${isSelected ? 'text-white' : 'text-white/60'}
                                    `}>
                                        {node.label}
                                    </div>
                                </motion.button>
                            )
                        })}
                     </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT PANEL: DETAILS (Slide up on Mobile, Right sidebar on Desktop) --- */}
        <AnimatePresence>
            {activeNodeData && (
                <motion.div 
                    initial={{ y: "100%", x: 0 }}
                    animate={{ y: 0, x: 0 }}
                    exit={{ y: "100%", x: 0 }}
                    className="fixed bottom-16 left-0 right-0 h-[60vh] md:h-full md:w-80 md:static md:bottom-0 bg-[#1a0002]/95 md:bg-[#1a0002]/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-rose-500/10 flex flex-col z-50 md:z-20 shadow-[-20px_-20px_50px_rgba(0,0,0,0.5)] md:shadow-none rounded-t-3xl md:rounded-none"
                >
                    <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Crosshair size={14} className="text-rose-400" />
                                <span className="text-xs uppercase tracking-widest text-rose-200 font-bold">Node Intelligence</span>
                            </div>
                            <h3 className="text-xl font-serif italic text-white leading-tight">
                                {activeNodeData.label}
                            </h3>
                        </div>
                        {/* Close button for mobile */}
                        <button onClick={() => setSelectedNodeId(null)} className="md:hidden p-2 bg-white/5 rounded-full text-white/50"><X size={16} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                        <motion.div 
                            key={activeNodeData.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Chat Bubble Effect */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/30">
                                    <MessageSquare size={14} className="text-rose-300" />
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-r-2xl rounded-bl-2xl bg-white/5 border border-white/10 text-sm leading-relaxed text-pink-100/90 shadow-sm">
                                        <p className="mb-3 font-semibold text-white">Here is the breakdown:</p>
                                        <p>{activeNodeData.details.description}</p>
                                    </div>
                                    <div className="p-4 rounded-r-2xl rounded-bl-2xl bg-white/5 border border-white/10 text-sm leading-relaxed text-pink-100/90 shadow-sm">
                                        <strong className="block text-rose-300 text-xs uppercase mb-1">Why it matters</strong>
                                        {activeNodeData.details.why}
                                    </div>
                                </div>
                            </div>

                            {/* Meta Data */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Est. Time</div>
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        <Clock size={12} className="text-rose-400" />
                                        {activeNodeData.details.time}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Difficulty</div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className={`h-1.5 w-full rounded-full ${i <= 2 ? 'bg-rose-500' : 'bg-white/10'}`} />)}
                                    </div>
                                </div>
                            </div>

                            {/* Tip */}
                            <div className="p-4 rounded-xl bg-emerald-900/10 border border-emerald-500/20 flex gap-3">
                                <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">Pro Tip</h4>
                                    <p className="text-xs text-emerald-100/70 leading-relaxed">
                                        {activeNodeData.details.tip}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

    </div>
  );
};

export default RoadmapPage;