import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, LogOut, Download, Trash2, AlertTriangle } from 'lucide-react';
import { UserData } from '../App';

interface SettingsPageProps {
    userData: UserData;
    onUpdateUser: (data: Partial<UserData>) => void;
    onClearData?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ userData, onUpdateUser, onClearData }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
      setDownloading(true);
      setTimeout(() => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href", dataStr);
          downloadAnchorNode.setAttribute("download", "careergps_data.json");
          document.body.appendChild(downloadAnchorNode); // required for firefox
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
          setDownloading(false);
      }, 1000);
  };

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto min-h-screen pb-24 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-serif italic font-bold text-white mb-6 md:mb-8">Settings</h1>

      <div className="space-y-6">
        
        {/* Profile Section */}
        <section className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="text-rose-400" /> Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Full Name</label>
                    <input 
                        type="text" 
                        value={userData.name} 
                        onChange={(e) => onUpdateUser({ name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Target Role</label>
                    <div className="relative">
                        <select 
                            value={userData.role}
                            onChange={(e) => onUpdateUser({ role: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-rose-500 outline-none appearance-none"
                        >
                            <option className="bg-[#2c0003] text-white">SDE @ Product</option>
                            <option className="bg-[#2c0003] text-white">Frontend Engineer</option>
                            <option className="bg-[#2c0003] text-white">Backend Engineer</option>
                            <option className="bg-[#2c0003] text-white">Data Scientist</option>
                            <option className="bg-[#2c0003] text-white">UI/UX Designer</option>
                            <option className="bg-[#2c0003] text-white">Product Manager</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>

        {/* Notifications */}
        <section className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Bell className="text-rose-400" /> Notifications
            </h2>
            <div className="space-y-4">
                {["Daily Focus Reminders", "Weekly Progress Report", "New Project Suggestions"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-pink-100/80 text-sm md:text-base">{item}</span>
                        <div className="w-12 h-6 rounded-full bg-rose-500 p-1 cursor-pointer flex justify-end">
                            <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                        </div>
                    </div>
                ))}
            </div>
        </section>

         {/* Data */}
        <section className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="text-rose-400" /> Data & Privacy
            </h2>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-pink-100/80 text-sm md:text-base">Export my data</span>
                    <button 
                        onClick={handleDownload}
                        disabled={downloading}
                        className="text-sm font-bold text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
                    >
                        {downloading ? 'Preparing...' : <><Download size={14} /> <span className="hidden sm:inline">Download JSON</span><span className="sm:hidden">JSON</span></>}
                    </button>
                </div>
                
                <div className="h-px bg-white/10 my-2" />

                <div className="flex justify-between items-center">
                    <span className="text-pink-100/80 text-sm md:text-base">Reset Account Data</span>
                    <button 
                         onClick={onClearData}
                         className="text-sm font-bold text-red-400 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 flex items-center gap-2"
                    >
                        <Trash2 size={14} /> <span className="hidden sm:inline">Clear Data</span><span className="sm:hidden">Reset</span>
                    </button>
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex gap-3">
                    <AlertTriangle className="text-red-400 shrink-0" size={20} />
                    <p className="text-xs text-red-200/60 leading-relaxed">
                        Clearing data will reset your progress, tasks, and saved projects. This action cannot be undone.
                    </p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;