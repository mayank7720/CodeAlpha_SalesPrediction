import React from "react";
import { 
  LayoutDashboard, 
  LineChart, 
  BarChart3, 
  Sliders, 
  FileSpreadsheet, 
  Cpu, 
  Lightbulb, 
  Settings,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "predictions", name: "Predictions", icon: LineChart },
    { id: "analytics", name: "Marketing Analytics", icon: BarChart3 },
    { id: "optimizer", name: "Budget Optimizer", icon: Sliders },
    { id: "performance", name: "Model Performance", icon: Cpu },
    { id: "insights", name: "Business Insights", icon: Lightbulb },
  ];

  const secondaryItems = [
    { id: "reports", name: "Reports", icon: FileSpreadsheet },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-brand-border flex flex-col z-20">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-brand-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Sales Intel
          </h1>
          <span className="text-[10px] text-brand-primary font-bold tracking-widest uppercase">
            AI Platform
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
          Core Engine
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-brand-primary/15 to-brand-secondary/5 text-brand-primary border-l-2 border-brand-primary shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-brand-primary" : "text-slate-400 group-hover:text-slate-300"}`} />
              {item.name}
            </button>
          );
        })}

        <div className="pt-6">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
            System
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? "bg-gradient-to-r from-brand-primary/15 to-brand-secondary/5 text-brand-primary border-l-2 border-brand-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-brand-primary" : "text-slate-400 group-hover:text-slate-300"}`} />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Version */}
      <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-slate-500">
        <span>V1.0.0 (Ridge/Lasso)</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
        </span>
      </div>
    </aside>
  );
};
