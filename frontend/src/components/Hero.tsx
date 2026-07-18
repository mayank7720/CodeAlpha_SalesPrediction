import React from "react";
import { Sparkles, ArrowRight, Play } from "lucide-react";

interface HeroProps {
  onPredictClick: () => void;
  onAnalyticsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPredictClick, onAnalyticsClick }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel border border-brand-border p-8 lg:p-12 mb-8 bg-gradient-to-br from-brand-card via-brand-bg/90 to-brand-secondary/5">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full filter blur-[80px] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Typographic Content */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Machine Learning</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            AI-Powered <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-secondary">
              Sales Intelligence
            </span>
          </h1>

          <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-lg">
            Predict sales, optimize channel spending allocation, and maximize marketing ROI with regularized machine learning and explainable intelligence pipelines.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onPredictClick}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-primary/90 hover:from-brand-primary/95 hover:to-brand-primary text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-glow transition-all duration-200 active:scale-95 group"
            >
              <span>Predict Sales</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={onAnalyticsClick}
              className="flex items-center gap-2 bg-slate-900/60 border border-brand-border hover:bg-slate-800/60 hover:text-white text-slate-300 text-sm font-bold px-6 py-3.5 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-brand-secondary" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Custom Animated Graphic */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-slate-950/40 border border-brand-border/40 flex items-center justify-center overflow-hidden">
            {/* Animated SVG illustration */}
            <svg viewBox="0 0 200 200" className="w-full h-full p-4">
              <defs>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F8CFF" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4F8CFF" floodOpacity="0.4"/>
                </filter>
              </defs>
              
              {/* Outer boundary lines */}
              <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

              {/* Data Flow Lines */}
              <path d="M 40,60 Q 70,60 100,100" fill="none" stroke="rgba(79, 140, 255, 0.4)" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 40,100 Q 70,100 100,100" fill="none" stroke="rgba(124, 58, 237, 0.4)" strokeWidth="2" />
              <path d="M 40,140 Q 70,140 100,100" fill="none" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="2" strokeDasharray="3 3" />
              
              {/* Central Target Sales Line */}
              <path d="M 100,100 Q 130,100 160,100" fill="none" stroke="url(#grad-blue)" strokeWidth="3" filter="url(#shadow)" />
              
              {/* Node - TV */}
              <circle cx="40" cy="60" r="10" fill="#111827" stroke="#4F8CFF" strokeWidth="2" />
              <text x="40" y="63" fill="#4F8CFF" fontSize="7" fontWeight="bold" textAnchor="middle">TV</text>

              {/* Node - Radio */}
              <circle cx="40" cy="100" r="10" fill="#111827" stroke="#7C3AED" strokeWidth="2" />
              <text x="40" y="103" fill="#7C3AED" fontSize="7" fontWeight="bold" textAnchor="middle">RAD</text>

              {/* Node - Newspaper */}
              <circle cx="40" cy="140" r="10" fill="#111827" stroke="#22C55E" strokeWidth="2" />
              <text x="40" y="143" fill="#22C55E" fontSize="7" fontWeight="bold" textAnchor="middle">PRN</text>

              {/* Central AI Brain Node */}
              <circle cx="100" cy="100" r="16" fill="#0B1220" stroke="url(#grad-blue)" strokeWidth="3" filter="url(#shadow)" />
              <circle cx="100" cy="100" r="6" fill="#4F8CFF" />
              <animate transform="translate(0 0)" attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />

              {/* Output - Sales Node */}
              <polygon points="156,100 164,93 172,100 164,107" fill="#EF4444" />
              <text x="164" y="117" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle">SALES</text>

              {/* Floating particles animation along flows */}
              <circle cx="0" cy="0" r="3" fill="#fff" filter="url(#shadow)">
                <animateMotion path="M 40,60 Q 70,60 100,100" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="3" fill="#fff">
                <animateMotion path="M 40,100 Q 70,100 100,100" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="3" fill="#fff">
                <animateMotion path="M 100,100 Q 130,100 160,100" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <div className="absolute bottom-3 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              Neural Optimization Flow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
