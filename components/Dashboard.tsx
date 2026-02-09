import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Star, Zap, Edit2, ArrowUpRight, Brain, Sparkles, Plus, Clock, Tag, X, Server, Activity, Bell } from 'lucide-react';
import { UserData } from '../App';

interface DashboardProps {
  onOpenRoadmap: () => void;
  userData: UserData;
  onUpdateUser: (data: Partial<UserData>) => void;
  onIncreaseScore: (amount: number) => void;
}

interface Task {
    id: number;
    text: string;
    time: string;
    tag: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenRoadmap, userData, onUpdateUser, onIncreaseScore }) => {
  const [greeting, setGreeting] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditGoalsOpen, setIsEditGoalsOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Lifted Task State
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Revise Array Manipulation (Two Pointer)", time: "45m", tag: "Learning" },
    { id: 2, text: "Refine 'About Me' section on Portfolio", time: "20m", tag: "Project" },
  ]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Trigger Notification Modal after a slight delay on mount
    const timer = setTimeout(() => {
        const hasAsked = localStorage.getItem('careergps_notifications_asked');
        if (!hasAsked) {
            setShowNotificationModal(true);
        }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTask = (newTask: { text: string, time: string, tag: string }) => {
      const task: Task = {
          id: Date.now(),
          ...newTask
      };
      setTasks([...tasks, task]);
      setIsAddTaskOpen(false);
  };

  const handleToggleTask = (id: number) => {
      if (completedTasks.includes(id)) {
          setCompletedTasks(completedTasks.filter(c => c !== id));
      } else {
          setCompletedTasks([...completedTasks, id]);
          onIncreaseScore(5);
      }
  };

  const handleNotificationChoice = (choice: boolean) => {
      setShowNotificationModal(false);
      localStorage.setItem('careergps_notifications_asked', 'true');
      if (choice) {
          console.log("Notifications Enabled");
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 sm:p-6 md:p-12 max-w-7xl mx-auto relative pb-24 md:pb-12"
    >
        {/* System Status Popup (Top) */}
        <AnimatePresence>
            {isSystemStatusOpen && (
                <SystemStatusModal 
                    userData={userData} 
                    onClose={() => setIsSystemStatusOpen(false)} 
                />
            )}
        </AnimatePresence>

        {/* Notification Request Modal (Top Slide-in) */}
        <AnimatePresence>
            {showNotificationModal && (
                <NotificationRequestModal onClose={handleNotificationChoice} />
            )}
        </AnimatePresence>

      <div className="flex flex-col gap-6 md:gap-8">
        
        {/* 1. HERO STRIP */}
        <HeroStrip greeting={greeting} name={userData.name} role={userData.role} isPremium={userData.isPremium} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 2. ALIGNMENT SCORE (Left Col) */}
            <div className="md:col-span-1 h-full">
                <AlignmentScore score={userData.alignmentScore} />
            </div>

            {/* 3. TODAY'S FOCUS (Right Col - Spans 2) */}
            <div className="md:col-span-2 h-full">
                <FocusCard 
                    tasks={tasks} 
                    completed={completedTasks}
                    onToggle={handleToggleTask}
                    onAddTask={() => setIsAddTaskOpen(true)} 
                />
            </div>
        </div>

        {/* 4. ROADMAP SNAPSHOT */}
        <RoadmapSnapshot onOpenFull={onOpenRoadmap} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* 5. SKILL PROGRESS */}
            <SkillProgress />
            
            {/* 6. PROJECTS PANEL - NOW SHOWS SAVED PROJECTS */}
            <ProjectsPanel savedProjects={userData.savedProjects} />
        </div>

        {/* 7. INSIGHTS */}
        <InsightsBanner />

        {/* 8. QUICK ACTIONS */}
        <QuickActions 
            onEditGoals={() => setIsEditGoalsOpen(true)} 
            onCheckStatus={() => setIsSystemStatusOpen(true)}
            isPremium={userData.isPremium}
        />

        <div className="h-4 md:h-20" /> {/* Spacer */}
      </div>

      {/* MODALS */}
      <AddTaskModal 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)} 
        onAdd={handleAddTask}
      />
      <EditGoalsModal 
        isOpen={isEditGoalsOpen} 
        onClose={() => setIsEditGoalsOpen(false)} 
        currentRole={userData.role}
        onSave={(newRole) => onUpdateUser({ role: newRole })}
      />

    </motion.div>
  );
};

// ... (Modals omitted from changes unless visual tweaks needed, retaining original functionality) ...

const NotificationRequestModal = ({ onClose }: { onClose: (allow: boolean) => void }) => (
    <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 w-full z-[120] flex justify-center pt-6 px-4 pointer-events-none"
    >
        <div className="pointer-events-auto bg-[#2c0003] border border-rose-500/30 rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col items-center text-center gap-4 relative">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center animate-bounce">
                <Bell className="w-6 h-6 text-rose-400" />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg mb-1">Stay on Track</h3>
                <p className="text-white/60 text-sm">Enable notifications for daily focus reminders and roadmap updates.</p>
            </div>
            <div className="flex gap-3 w-full">
                <button 
                    onClick={() => onClose(false)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
                >
                    Not Now
                </button>
                <button 
                    onClick={() => onClose(true)}
                    className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-colors"
                >
                    Enable
                </button>
            </div>
        </div>
    </motion.div>
)

const SystemStatusModal = ({ userData, onClose }: { userData: UserData, onClose: () => void }) => (
    <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-4 left-0 right-0 mx-auto w-full max-w-md z-[100] px-4"
    >
        <div className="bg-[#1a0505] border border-rose-500/30 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={16} /></button>
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 animate-pulse"><Server size={20} /></div>
                <div><h3 className="text-white font-bold text-sm">System Operational</h3><p className="text-xs text-white/50">All AI services running</p></div>
            </div>
            <div>
                <div className="flex justify-between text-xs text-rose-200/70 mb-2 font-medium"><span>Usage Time</span><span>{userData.timeSpent} mins today</span></div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-rose-500 to-pink-500" /></div>
            </div>
            <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-lg"><span className="text-white/60">Data Sync</span><span className="text-emerald-400 flex items-center gap-1"><Activity size={12} /> Live</span></div>
        </div>
    </motion.div>
);

const AddTaskModal = ({ isOpen, onClose, onAdd }: any) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState('');
    const [tag, setTag] = useState('Learning');
    const handleSubmit = () => { if (!text) return; onAdd({ text, time: time || '30m', tag }); setText(''); setTime(''); };
    return (
        <AnimatePresence>{isOpen && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} /><motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 m-auto w-full max-w-md h-fit bg-[#2c0003] border border-rose-500/30 rounded-3xl p-8 z-[70] shadow-2xl">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-serif italic font-bold text-white">Add Focus Task</h2><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white"><X size={18} /></button></div>
            <div className="space-y-4">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}><label className="text-xs uppercase text-rose-300 font-bold tracking-widest mb-1 block">Task Name</label><input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Complete System Design Chapter 1" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none" /></motion.div>
                <div className="grid grid-cols-2 gap-4">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}><label className="text-xs uppercase text-rose-300 font-bold tracking-widest mb-1 block">Duration</label><div className="relative"><Clock size={16} className="absolute left-3 top-3.5 text-white/30" /><input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="45m" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-rose-500 outline-none" /></div></motion.div>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}><label className="text-xs uppercase text-rose-300 font-bold tracking-widest mb-1 block">Tag</label><div className="relative"><Tag size={16} className="absolute left-3 top-3.5 text-white/30" /><select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-rose-500 outline-none appearance-none"><option className="bg-[#2c0003] text-white">Learning</option><option className="bg-[#2c0003] text-white">Project</option><option className="bg-[#2c0003] text-white">Network</option></select></div></motion.div>
                </div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="pt-4"><button onClick={handleSubmit} className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold shadow-lg hover:shadow-rose-900/50 transition-all">Add to Schedule</button></motion.div>
            </div></motion.div></>)}</AnimatePresence>
    )
}

const EditGoalsModal = ({ isOpen, onClose, currentRole, onSave }: any) => {
    const [role, setRole] = useState(currentRole);
    return (<AnimatePresence>{isOpen && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} /><motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 m-auto w-full max-w-md h-fit bg-[#2c0003] border border-rose-500/30 rounded-3xl p-8 z-[70]"><h2 className="text-2xl font-serif italic font-bold text-white mb-6">Edit Career Goal</h2><div className="space-y-4"><div><label className="text-xs uppercase text-rose-300 font-bold tracking-widest mb-1 block">Target Role</label><input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none" /></div><button onClick={() => { onSave(role); onClose(); }} className="w-full py-3 rounded-xl bg-white text-rose-900 font-bold hover:bg-rose-50 transition-colors">Save Changes</button></div></motion.div></>)}</AnimatePresence>)
}

const HeroStrip = ({ greeting, name, role, isPremium }: any) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-bold text-white mb-2">{greeting}, <span className="relative inline-block">{name}<motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.8 }} className="absolute bottom-1 left-0 w-full h-[2px] bg-rose-400/50 origin-left" /></span></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-pink-100/60 text-base md:text-lg">Your career is taking shape.</motion.p>
        </div>
        <div className="flex items-center gap-4 flex-wrap"><div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-pink-200 uppercase tracking-widest font-medium hover:bg-white/10 transition-colors cursor-pointer">Aiming: {role}</div>{isPremium && (<motion.div animate={{ boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 15px rgba(244,63,94,0.3)", "0 0 0px rgba(244,63,94,0)"] }} transition={{ duration: 4, repeat: Infinity }} className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-900 to-rose-800 border border-rose-500/30 text-xs text-rose-100 uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer"><Star className="w-3 h-3 text-rose-300 fill-rose-300" /> Premium</motion.div>)}</div>
    </div>
);

const AlignmentScore = ({ score }: any) => {
    const radius = 80; const circumference = 2 * Math.PI * radius;
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full min-h-[300px] p-8 rounded-3xl bg-[rgba(255,230,235,0.05)] border border-pink-200/10 backdrop-blur-md flex flex-col items-center justify-center relative group">
             <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center mb-6"><svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200"><circle cx="100" cy="100" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" /><motion.circle cx="100" cy="100" r={radius} stroke="#f43f5e" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }} transition={{ duration: 1.5, ease: "easeOut" }} className="drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><motion.span key={score} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl lg:text-6xl font-serif italic font-bold text-white">{score}%</motion.span><span className="text-xs text-pink-200/50 uppercase tracking-widest mt-1">Aligned</span></div></div><p className="text-pink-100/70 text-center text-sm">{score === 0 ? "Start working to build score." : "You're making progress!"}</p>
        </motion.div>
    );
};

const FocusCard = ({ tasks, completed, onToggle, onAddTask }: any) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full p-6 md:p-8 rounded-3xl bg-[rgba(255,230,235,0.05)] border border-pink-200/10 backdrop-blur-md flex flex-col relative overflow-hidden min-h-[300px]">
            <div className="flex justify-between items-start mb-8 relative z-10"><div><h3 className="text-2xl font-serif italic font-bold text-white mb-1">Today's Focus</h3><p className="text-pink-100/50 text-sm">Deep work only. No overwhelm.</p></div><div className="flex gap-2"><button onClick={onAddTask} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><Plus className="w-5 h-5" /></button><div className="p-2 rounded-full bg-rose-500/10 text-rose-300"><Zap className="w-5 h-5" /></div></div></div>
            <div className="space-y-4 relative z-10 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">{tasks.map((task: any) => { const isDone = completed.includes(task.id); return ( <motion.div key={task.id} layout onClick={() => onToggle(task.id)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${isDone ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}> <div className="flex items-center gap-4"> <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-rose-400'}`}> {isDone && <Check className="w-4 h-4 text-white" />} </div> <div className="flex flex-col"> <span className={`text-sm md:text-base font-medium transition-colors ${isDone ? 'text-emerald-200 line-through' : 'text-white'}`}> {task.text} </span> <span className="text-[10px] text-white/30 uppercase tracking-widest">{task.tag}</span> </div> </div> <span className="text-xs text-white/30 font-mono ml-4 shrink-0">{task.time}</span> </motion.div> ) })}</div>
        </motion.div>
    );
};

const RoadmapSnapshot = ({ onOpenFull }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 md:p-8 rounded-3xl bg-[rgba(255,230,235,0.05)] border border-pink-200/10 backdrop-blur-md relative group">
        <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-serif italic text-white">Roadmap Snapshot</h3><button onClick={onOpenFull} className="text-xs text-rose-300 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest font-bold">View Full Map <ArrowUpRight className="w-3 h-3" /></button></div>
        <div className="relative h-24 flex items-center overflow-x-auto custom-scrollbar md:overflow-visible">
            <div className="min-w-[300px] w-full relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" /><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute top-1/2 left-0 w-1/3 h-[2px] bg-gradient-to-r from-rose-500 to-pink-400 origin-left" /><div className="relative w-full flex justify-between px-2 md:px-12">{[{ label: "Basics", status: "done" }, { label: "Current", status: "active" }, { label: "Projects", status: "locked" }, { label: "Placement", status: "locked" }].map((node, i) => (<div key={i} className="flex flex-col items-center gap-3 relative z-10"><div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-500 ${node.status === 'done' ? 'bg-rose-500 border-rose-500' : node.status === 'active' ? 'bg-rose-900 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-125' : 'bg-[#2c0003] border-white/20'}`} /><span className={`text-[10px] uppercase tracking-widest font-medium ${node.status === 'active' ? 'text-white' : 'text-white/30'}`}>{node.label}</span></div>))}</div>
            </div>
        </div>
    </motion.div>
);

const SkillProgress = () => {
    const skills = [{ name: "DSA & Logic", val: 65, color: "bg-rose-500" }, { name: "Web Dev", val: 40, color: "bg-pink-400" }, { name: "Projects", val: 25, color: "bg-purple-400" }, { name: "Soft Skills", val: 10, color: "bg-orange-400", alert: true }];
    return (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="p-6 md:p-8 rounded-3xl bg-[rgba(255,230,235,0.05)] border border-pink-200/10 backdrop-blur-md"><h3 className="text-xl font-serif italic text-white mb-8">Skill Mastery</h3><div className="space-y-6">{skills.map((skill, i) => (<div key={i} className="group"><div className="flex justify-between text-xs text-white/70 mb-2 font-medium tracking-wide"><span className="flex items-center gap-2">{skill.name}{skill.alert && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}</span><span className="opacity-0 group-hover:opacity-100 transition-opacity">{skill.val}%</span></div><div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.val}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full rounded-full ${skill.color}`} /></div></div>))}</div></motion.div>);
};

const ProjectsPanel = ({ savedProjects }: { savedProjects: any[] }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 md:p-8 rounded-3xl bg-[rgba(255,230,235,0.05)] border border-pink-200/10 backdrop-blur-md flex flex-col"
    >
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif italic text-white">Saved Projects</h3>
            <div className="text-xs text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">{savedProjects.length} Active</div>
        </div>

        <div className="space-y-4 flex-1">
            {savedProjects.length > 0 ? (
                savedProjects.map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-bold group-hover:text-rose-200 transition-colors line-clamp-1 text-sm md:text-base">{p.title}</h4>
                            <span className="text-[8px] md:text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap">{p.domain}</span>
                        </div>
                        <p className="text-xs text-white/50 mb-3 line-clamp-1">{p.desc}</p>
                        <div className="w-full bg-black/20 h-1 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-rose-500" />
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-40 text-center py-8">
                    <Star className="w-8 h-8 mb-2" />
                    <p className="text-sm">No projects saved yet.</p>
                    <p className="text-xs">Explore projects to build your portfolio.</p>
                </div>
            )}
        </div>
    </motion.div>
);

const InsightsBanner = () => (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="p-6 rounded-2xl bg-gradient-to-r from-rose-900/30 to-transparent border border-rose-500/20 flex items-center gap-6"><div className="p-3 rounded-full bg-rose-500/10 text-rose-300 hidden md:block"><Brain className="w-6 h-6" /></div><div><h4 className="text-xs text-rose-300 uppercase tracking-widest font-bold mb-1">Career Insight</h4><TypewriterText text="Focusing on 'Project Structure' this week will likely boost your alignment score by 5%." /></div></motion.div>);
const TypewriterText = ({ text }: any) => (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-white/90 text-sm md:text-base font-medium leading-relaxed">{text}</motion.p>)
const QuickActions = ({ onEditGoals, onCheckStatus, isPremium }: any) => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4 justify-center md:justify-start pb-4"><ActionButton onClick={onEditGoals} icon={<Edit2 className="w-4 h-4" />} label="Edit Goals" /><ActionButton onClick={onCheckStatus} icon={<Zap className="w-4 h-4" />} label="Update Availability" />{!isPremium && <ActionButton icon={<Sparkles className="w-4 h-4" />} label="Upgrade to Premium" isPremium />}</motion.div>);
const ActionButton = ({ icon, label, isPremium, onClick }: any) => (<motion.button onClick={onClick} whileHover={{ y: -2 }} className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isPremium ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-900/40 hover:shadow-rose-900/60' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>{icon}{label}</motion.button>);

export default Dashboard;