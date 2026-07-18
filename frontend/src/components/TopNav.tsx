import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Download, Calendar, User, Check } from "lucide-react";

interface TopNavProps {
  onExport?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onExport }) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(2);
  const [notificationList, setNotificationList] = useState([
    { id: 1, message: "Lasso model parameters tuned successfully.", time: "10m ago", read: false },
    { id: 2, message: "Budget optimization simulation executed.", time: "1h ago", read: false },
    { id: 3, message: "Newspaper spend pruned due to zero coefficient.", time: "4h ago", read: true }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="h-20 border-b border-brand-border px-8 flex items-center justify-between fixed top-0 right-0 left-64 bg-brand-bg/80 backdrop-blur-md z-10">
      {/* Global Search Bar */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="w-4 h-4 text-slate-500" />
        </span>
        <input
          type="text"
          placeholder="Search campaigns, predictions..."
          className="w-full bg-slate-900/50 border border-brand-border rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all duration-200"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-6">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/50 border border-brand-border px-3.5 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
          <span>{currentTime}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleNotifications}
            className={`relative p-2.5 rounded-xl border transition-all duration-200 group cursor-pointer ${
              showNotifications 
                ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                : "bg-slate-900/50 border-brand-border text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-accent border-2 border-brand-bg"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl border border-brand-border p-4 shadow-xl z-50 text-left animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border/40 mb-3">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] text-brand-primary hover:text-brand-primary/80 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notificationList.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      notif.read ? "bg-slate-950/20 border-brand-border/20" : "bg-brand-primary/5 border-brand-primary/20"
                    }`}
                  >
                    <p className="text-xs text-slate-200 leading-snug">{notif.message}</p>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-1.5">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-primary/90 hover:from-brand-primary/90 hover:to-brand-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-brand-border"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-secondary/40 to-brand-primary/40 border border-brand-border flex items-center justify-center text-brand-primary shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-200">Mayank Raj</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Principal Marketer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
