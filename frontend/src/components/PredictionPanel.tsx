import React from "react";
import { Sliders, Monitor, Radio as RadioIcon, Newspaper as NewsIcon, Target, Calendar, Globe } from "lucide-react";

interface PredictionPanelProps {
  tv: number;
  setTv: (val: number) => void;
  radio: number;
  setRadio: (val: number) => void;
  newspaper: number;
  setNewspaper: (val: number) => void;
  targetSegment: string;
  setTargetSegment: (val: string) => void;
  platform: string;
  setPlatform: (val: string) => void;
  duration: number;
  setDuration: (val: number) => void;
  isPredicting: boolean;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  tv,
  setTv,
  radio,
  setRadio,
  newspaper,
  setNewspaper,
  targetSegment,
  setTargetSegment,
  platform,
  setPlatform,
  duration,
  setDuration,
  isPredicting
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full bg-slate-900/40 relative overflow-hidden border border-brand-border">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-brand-primary/5 rounded-full filter blur-xl pointer-events-none"></div>

      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-brand-border/40">
        <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
          <Sliders className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Campaign Settings
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold uppercase">
            Configure Advertising Channel Budgets
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* TV Slider */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Monitor className="w-3.5 h-3.5 text-brand-primary" />
              TV Advertising Spend
            </span>
            <span className="text-brand-primary">${tv.toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="300"
              step="0.5"
              value={tv}
              onChange={(e) => setTv(parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-lg bg-slate-800 accent-brand-primary cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="300"
              value={tv}
              onChange={(e) => setTv(Math.max(0, Math.min(300, parseFloat(e.target.value) || 0)))}
              className="w-20 bg-slate-950/80 border border-brand-border rounded-xl py-1 px-2.5 text-xs text-right text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Radio Slider */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-300">
              <RadioIcon className="w-3.5 h-3.5 text-brand-secondary" />
              Radio Advertising Spend
            </span>
            <span className="text-brand-secondary">${radio.toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="50"
              step="0.1"
              value={radio}
              onChange={(e) => setRadio(parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-lg bg-slate-800 accent-brand-secondary cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="50"
              value={radio}
              onChange={(e) => setRadio(Math.max(0, Math.min(50, parseFloat(e.target.value) || 0)))}
              className="w-20 bg-slate-950/80 border border-brand-border rounded-xl py-1 px-2.5 text-xs text-right text-white focus:outline-none focus:border-brand-secondary"
            />
          </div>
        </div>

        {/* Newspaper Slider */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-300">
              <NewsIcon className="w-3.5 h-3.5 text-brand-accent" />
              Newspaper Spend
            </span>
            <span className="text-brand-accent">${newspaper.toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="114"
              step="0.5"
              value={newspaper}
              onChange={(e) => setNewspaper(parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-lg bg-slate-800 accent-brand-accent cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="114"
              value={newspaper}
              onChange={(e) => setNewspaper(Math.max(0, Math.min(114, parseFloat(e.target.value) || 0)))}
              className="w-20 bg-slate-950/80 border border-brand-border rounded-xl py-1 px-2.5 text-xs text-right text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {/* Dynamic Extra Metadata (Traditional vs Digital, target, duration) */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Target Segment */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Target className="w-3 h-3 text-brand-primary" /> Target Segment
            </label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value)}
              className="w-full bg-slate-950 border border-brand-border rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-brand-primary"
            >
              <option value="Global">Global Market</option>
              <option value="Demographic-A">Gen Z / Millennials</option>
              <option value="Demographic-B">High-Net-Worth</option>
            </select>
          </div>

          {/* Marketing Platform */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Globe className="w-3 h-3 text-brand-secondary" /> Marketing Mix
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-brand-border rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-brand-secondary"
            >
              <option value="Cross-channel">Integrated Cross-channel</option>
              <option value="Traditional">Traditional Only</option>
              <option value="Digital-first">Digital-first Hybrid</option>
            </select>
          </div>
        </div>

        {/* Campaign Duration */}
        <div className="space-y-2 text-left pt-2">
          <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand-accent" /> Campaign Duration
            </span>
            <span>{duration} Weeks</span>
          </div>
          <input
            type="range"
            min="1"
            max="52"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 accent-brand-accent cursor-pointer rounded-lg"
          />
        </div>
      </div>

      {isPredicting && (
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-primary font-bold tracking-widest uppercase">
          <svg className="animate-spin h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M 4 12 a 8 8 0 0 1 8 -8 V 0 C 5.373 0 0 5.373 0 12 h 4 z"></path>
          </svg>
          <span>Recalculating...</span>
        </div>
      )}
    </div>
  );
};
