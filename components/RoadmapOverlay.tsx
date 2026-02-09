import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Play, Pause, GitBranch, Calendar, ChevronRight, CheckCircle, LogOut } from 'lucide-react';

interface RoadmapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type NodeStatus = 'active' | 'locked' | 'completed' | 'default';

interface Node {
  id: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
  timelineX: number; // percentage for timeline view
  timelineY: number; // percentage for timeline view
  type: 'root' | 'branch' | 'leaf';
  status: NodeStatus;
  parentId?: string;
  month?: string;
  details?: {
    desc: string;
    skills: string[];
    outcome: string;
  };
}

const RoadmapOverlay: React.FC<RoadmapOverlayProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'timeline'>('tree');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [activeConnection, setActiveConnection] = useState<{from: string, to: string} | null>(null);
  
  // Responsive check
  useEffect(() => {
    if (isOpen) {
        const isMobile = window.innerWidth < 768;
        if (isMobile) setViewMode('timeline');
    }
  }, [isOpen]);

  // Sample Data Structure
  const nodes: Node[] = [
    // Root - Moved UP to 80%
    { 
      id: 'root', label: 'Student Profile', x: 50, y: 80, timelineX: 10, timelineY: 50, 
      type: 'root', status: 'active',
      details: { desc: "Year 2 Student, Aiming for SDE roles.", skills: ["Time: 2-3 hrs/day"], outcome: "Foundation Set" }
    },
    
    // Branch 1: Core Skills
    { 
      id: 'b1', parentId: 'root', label: 'Core Skills', x: 20, y: 55, timelineX: 25, timelineY: 30,
      type: 'branch', status: 'completed', month: 'Month 1',
      details: { desc: "Building the technical bedrock.", skills: ["Logic", "Syntax"], outcome: "Problem Solving" }
    },
      { id: 'b1-1', parentId: 'b1', label: 'DSA Basics', x: 10, y: 40, timelineX: 25, timelineY: 70, type: 'leaf', status: 'completed', details: { desc: "Arrays & Strings mastery", skills: ["Java/C++"], outcome: "LeetCode Easy" } },
      { id: 'b1-2', parentId: 'b1', label: 'Adv. Algorithms', x: 25, y: 35, timelineX: 40, timelineY: 30, type: 'leaf', status: 'locked', details: { desc: "DP & Graphs", skills: ["Optimization"], outcome: "LeetCode Hard" } },

    // Branch 2: Projects
    { 
      id: 'b2', parentId: 'root', label: 'Projects', x: 50, y: 50, timelineX: 55, timelineY: 50,
      type: 'branch', status: 'active', month: 'Month 2',
      details: { desc: "Applying theory to reality.", skills: ["React", "Node"], outcome: "Portfolio Piece" }
    },
      { id: 'b2-1', parentId: 'b2', label: 'Personal Site', x: 40, y: 30, timelineX: 55, timelineY: 20, type: 'leaf', status: 'completed', details: { desc: "Showcase yourself", skills: ["HTML/CSS"], outcome: "Live URL" } },
      { id: 'b2-2', parentId: 'b2', label: 'Full Stack App', x: 60, y: 30, timelineX: 70, timelineY: 50, type: 'leaf', status: 'active', details: { desc: "E-commerce Clone", skills: ["DB Design", "API"], outcome: "Complex System" } },

    // Branch 3: Placement
    { 
      id: 'b3', parentId: 'root', label: 'Placement Prep', x: 80, y: 55, timelineX: 85, timelineY: 50,
      type: 'branch', status: 'locked', month: 'Month 3',
      details: { desc: "Cracking the interview.", skills: ["Mock Interviews"], outcome: "Job Offer" }
    },
      { id: 'b3-1', parentId: 'b3', label: 'Resume', x: 75, y: 40, timelineX: 85, timelineY: 20, type: 'leaf', status: 'locked', details: { desc: "ATS Optimization", skills: ["Writing"], outcome: "Shortlists" } },
      { id: 'b3-2', parentId: 'b3', label: 'System Design', x: 90, y: 35, timelineX: 95, timelineY: 50, type: 'leaf', status: 'locked', details: { desc: "Scalability", skills: ["Load Balancing"], outcome: "L5 Level" } },
  ];

  // Auto-Demo Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDemoPlaying) {
      interval = setInterval(() => {
        // Find current index
        const currentIndex = nodes.findIndex(n => n.id === selectedNodeId);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex >= nodes.length) {
          setIsDemoPlaying(false);
          setActiveConnection(null);
          return;
        }

        const prevNode = nodes[currentIndex >= 0 ? currentIndex : 0];
        const nextNode = nodes[nextIndex];

        // Animate connection from parent to next node if applicable
        // Or if strictly sequential in array, animate from prev to next (conceptually)
        // For better visuals, let's find the parent of the next node to light up THAT connection
        if (nextNode.parentId) {
             setActiveConnection({ from: nextNode.parentId, to: nextNode.id });
        } else {
             // Fallback if jumping branches blindly (though array is sorted somewhat structurally)
             setActiveConnection({ from: prevNode.id, to: nextNode.id }); 
        }

        setSelectedNodeId(nextNode.id);
        
      }, 2000); // Slower for golden light to travel
    } else {
        setActiveConnection(null);
    }
    return () => clearInterval(interval);
  }, [isDemoPlaying, selectedNodeId, nodes]);

  // Handle ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
          if (selectedNodeId) setSelectedNodeId(null);
          else onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, selectedNodeId]);

  const activeNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#0f172a] overflow-hidden flex flex-col md:block"
        >
          {/* Background Ambient Noise & Glow */}
          <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
          <motion.div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-burgundy/20 blur-[150px] rounded-full pointer-events-none"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Top Bar Controls (Mobile & Desktop) */}
          <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-8 flex justify-between items-start pointer-events-none">
            
            {/* Left: View Controls */}
            <div className="pointer-events-auto flex flex-col gap-4">
                 <div className="p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex shadow-xl">
                    <button 
                        onClick={() => setViewMode('tree')}
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${viewMode === 'tree' ? 'bg-rose-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        <GitBranch className="w-3 h-3 md:w-4 md:h-4" /> Map
                    </button>
                    <button 
                        onClick={() => setViewMode('timeline')}
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${viewMode === 'timeline' ? 'bg-rose-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" /> Timeline
                    </button>
                </div>

                <button 
                    onClick={() => {
                        setIsDemoPlaying(!isDemoPlaying);
                        if (!isDemoPlaying) {
                            setSelectedNodeId(nodes[0].id);
                        }
                    }}
                    className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-xl border transition-all text-xs md:text-sm font-bold tracking-wide pointer-events-auto backdrop-blur-md
                    ${isDemoPlaying 
                        ? 'border-rose-500 bg-rose-500/10 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                >
                    {isDemoPlaying ? <Pause className="w-3 h-3 md:w-4 md:h-4" /> : <Play className="w-3 h-3 md:w-4 md:h-4" />}
                    {isDemoPlaying ? 'Playing...' : 'Play Sample'}
                </button>
            </div>

            {/* Right: Exit Button */}
            <motion.button 
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all backdrop-blur-md"
            >
                <span className="hidden md:inline text-sm font-medium">Exit Map</span>
                <LogOut className="w-4 h-4 text-white/70 group-hover:text-red-200" />
            </motion.button>
          </div>


          {/* MAIN VISUALIZATION AREA */}
          <div className="relative w-full h-full touch-pan-x overflow-hidden">
            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               <defs>
                 <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" stopColor="#f472b6" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#881337" stopOpacity="0.1" />
                 </linearGradient>
                 {/* Golden Glow Gradient */}
                 <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                   <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                   <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                 </linearGradient>
               </defs>
               {nodes.map(node => {
                 if (!node.parentId) return null;
                 const parent = nodes.find(n => n.id === node.parentId);
                 if (!parent) return null;

                 const startX = viewMode === 'tree' ? parent.x : parent.timelineX;
                 const startY = viewMode === 'tree' ? parent.y : parent.timelineY;
                 const endX = viewMode === 'tree' ? node.x : node.timelineX;
                 const endY = viewMode === 'tree' ? node.y : node.timelineY;

                 const isGlowing = activeConnection?.from === parent.id && activeConnection?.to === node.id;

                 return (
                   <LineConnection 
                      key={`${parent.id}-${node.id}`} 
                      startX={startX} startY={startY} 
                      endX={endX} endY={endY}
                      viewMode={viewMode}
                      isGlowing={isGlowing}
                   />
                 );
               })}
            </svg>
            
            {/* Render Nodes */}
            {nodes.map((node, index) => (
               <NodeComponent 
                  key={node.id} 
                  node={node} 
                  viewMode={viewMode}
                  isSelected={selectedNodeId === node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  delay={index * 0.1}
               />
            ))}

            {/* Timeline Markers */}
            {viewMode === 'timeline' && (
                <div className="absolute top-20 md:top-10 left-0 w-full flex justify-between px-[10%] md:px-[15%] text-white/30 text-[10px] md:text-xs font-mono uppercase tracking-widest pointer-events-none">
                    <span>M 1</span>
                    <span>M 2</span>
                    <span>M 3</span>
                </div>
            )}
          </div>

          {/* SIDE PANEL (Right on Desktop, Bottom on Mobile) */}
          <AnimatePresence>
            {selectedNodeId && activeNode && (
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                // Responsive variants for Mobile (slide up) vs Desktop (slide left)
                variants={{
                    desktop: { x: 0, y: 0, width: "400px", height: "100%", top: 0, right: 0 },
                    mobile: { x: 0, y: 0, width: "100%", height: "60vh", top: "auto", bottom: 0, right: 0 }
                }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute bg-[#0f172a]/95 backdrop-blur-2xl border-l md:border-l border-t md:border-t-0 border-white/10 p-6 md:p-8 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-y-auto w-full md:w-[400px] h-[60vh] md:h-full bottom-0 md:top-0 right-0 rounded-t-3xl md:rounded-none"
              >
                 {/* Close Detail Button */}
                 <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-colors"
                 >
                    <X className="w-5 h-5" />
                 </button>

                 <div className="mt-4 md:mt-0 mb-2 text-rose-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                   {activeNode.type === 'root' ? 'Start Point' : activeNode.month || 'Phase Detail'}
                   <div className="h-px flex-1 bg-rose-500/20" />
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6 leading-tight">
                   {activeNode.label}
                 </h2>
                 
                 <div className="space-y-6 md:space-y-8">
                    <div>
                        <h4 className="text-white/50 text-xs uppercase tracking-wider mb-2">Objective</h4>
                        <p className="text-white/90 leading-relaxed font-light text-base md:text-lg">
                           {activeNode.details?.desc}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white/50 text-xs uppercase tracking-wider mb-3">Key Focus</h4>
                        <div className="flex flex-wrap gap-2">
                           {activeNode.details?.skills.map((s, i) => (
                             <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-pink-200">
                               {s}
                             </span>
                           ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white/50 text-xs uppercase tracking-wider mb-2">Outcome</h4>
                        <div className="flex items-center gap-3 text-emerald-300">
                           <CheckCircle className="w-5 h-5" />
                           <span className="font-medium text-sm md:text-base">{activeNode.details?.outcome}</span>
                        </div>
                    </div>

                    {activeNode.status === 'locked' && (
                        <div className="mt-4 md:mt-8 p-4 rounded-xl bg-rose-900/20 border border-rose-500/30 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-rose-400" />
                            <span className="text-xs md:text-sm text-rose-200">Unlock full details with Premium</span>
                        </div>
                    )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LineConnection: React.FC<{ startX: number, startY: number, endX: number, endY: number, viewMode: string, isGlowing: boolean }> = ({ startX, startY, endX, endY, viewMode, isGlowing }) => {
    // Convert % to VW/VH approximate logic for SVG path
    
    // Create a curved path
    const midY = (startY + endY) / 2;
    // For timeline, curve horizontal
    const midX = (startX + endX) / 2;

    const pathD = viewMode === 'tree' 
        ? `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
        : `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

    return (
        <g>
            {/* Base Line */}
            <motion.path 
                d={pathD}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="0.2" 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Golden Glow Light - Only renders when active */}
            {isGlowing && (
                <motion.path 
                    d={pathD}
                    fill="none"
                    stroke="#fbbf24" // Gold
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            )}
        </g>
    )
}

const NodeComponent: React.FC<{ node: Node, viewMode: 'tree' | 'timeline', isSelected: boolean, onClick: () => void, delay: number }> = ({ node, viewMode, isSelected, onClick, delay }) => {
    const isLocked = node.status === 'locked';
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
                opacity: 1, 
                scale: isSelected ? 1.2 : 1,
                left: `${viewMode === 'tree' ? node.x : node.timelineX}%`,
                top: `${viewMode === 'tree' ? node.y : node.timelineY}%`
            }}
            transition={{ 
                duration: 0.8, 
                ease: "easeInOut", // Slow, calm motion
                delay: delay
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10`}
            onClick={onClick}
        >
            <div className="relative group">
                {/* Glow Ring */}
                <motion.div 
                    className={`absolute inset-0 rounded-full blur-md transition-colors duration-500
                        ${isSelected ? 'bg-rose-500/60' : 'bg-transparent group-hover:bg-rose-500/30'}`}
                />
                
                {/* Node Body */}
                <div className={`
                    relative flex items-center justify-center rounded-full border backdrop-blur-md shadow-2xl transition-all duration-500
                    ${node.type === 'root' ? 'w-20 h-20 md:w-24 md:h-24 border-rose-500 bg-burgundy' : 'w-12 h-12 md:w-16 md:h-16 border-white/20 bg-white/5'}
                    ${isSelected ? 'border-rose-400 bg-rose-900/40' : ''}
                `}>
                    {isLocked ? (
                        <Lock className="w-4 h-4 md:w-5 md:h-5 text-white/40" />
                    ) : (
                        <div className={`w-2 h-2 rounded-full ${node.status === 'completed' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    )}
                </div>

                {/* Label */}
                <motion.div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 md:mt-3 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.5 }}
                >
                    <span className={`
                        text-[10px] md:text-xs font-medium tracking-wide px-2 py-1 rounded-md
                        ${isSelected ? 'bg-rose-500 text-white' : 'text-white/70 bg-black/40'}
                    `}>
                        {node.label}
                    </span>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default RoadmapOverlay;