import React, { useState, useEffect } from "react";
import { Sliders, Monitor, Radio as RadioIcon, Newspaper as NewsIcon, Sparkles, TrendingUp, DollarSign, Percent } from "lucide-react";

interface OptimizationData {
  tv_spend: number;
  radio_spend: number;
  newspaper_spend: number;
  predicted_sales: number;
  revenue: number;
  roi: number;
  recommended_allocation: {
    TV: number;
    Radio: number;
    Newspaper: number;
  };
}

export const BudgetOptimizer: React.FC = () => {
  const [budget, setBudget] = useState<number>(200);
  const [optData, setOptData] = useState<OptimizationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimization = async (targetBudget: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_budget: targetBudget })
      });
      if (!response.ok) {
        throw new Error("Optimization failed.");
      }
      const data = await response.json();
      setOptData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOptimization(budget);
    }, 150); // Debounce to prevent hitting endpoint on every pixel drag
    return () => clearTimeout(delayDebounceFn);
  }, [budget]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
      {/* Budget Slider Controls */}
      <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 rounded-2xl bg-slate-900/40 relative border border-brand-border">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full filter blur-xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-brand-border/40">
            <div className="p-2.5 rounded-xl bg-brand-secondary/10 text-brand-secondary">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                Budget Simulator
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">
                Find the Highest-ROI Channel Mix
              </p>
            </div>
          </div>

          <div className="space-y-6 py-4 text-left">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-400">
                <span>Total Campaign Budget</span>
                <span className="text-brand-secondary text-base">${budget.toFixed(0)}k</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                  className="flex-1 h-2 rounded-lg bg-slate-800 accent-brand-secondary cursor-pointer"
                />
                <input
                  type="number"
                  min="20"
                  max="400"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(20, Math.min(400, parseFloat(e.target.value) || 20)))}
                  className="w-20 bg-slate-950/80 border border-brand-border rounded-xl py-1.5 px-3 text-xs text-right text-white focus:outline-none focus:border-brand-secondary"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/60 text-xs text-slate-400 space-y-2.5">
              <p className="font-semibold text-slate-300">💡 Optimization Constraints Applied:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>TV Budget limited to max <span className="text-brand-primary font-bold">$300k</span></li>
                <li>Radio Budget limited to max <span className="text-brand-secondary font-bold">$50k</span> (Saturation limit)</li>
                <li>Newspaper Spend limited to max <span className="text-brand-accent font-bold">$114k</span></li>
              </ul>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-secondary font-bold tracking-widest uppercase">
            <svg className="animate-spin h-4 w-4 text-brand-secondary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M 4 12 a 8 8 0 0 1 8 -8 V 0 C 5.373 0 0 5.373 0 12 h 4 z"></path>
            </svg>
            <span>Solving Solver...</span>
          </div>
        )}
      </div>

      {/* Allocation Outcomes */}
      <div className="lg:col-span-7 flex flex-col justify-between glass-panel p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-brand-secondary/5 border border-brand-border relative">
        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-accent/5 rounded-full filter blur-xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-brand-border/40">
            <div className="p-2.5 rounded-xl bg-brand-accent/10 text-brand-accent shadow-glow-green">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                AI Allocation Solution
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">
                Optimized Budget distribution & Returns
              </p>
            </div>
          </div>

          {error && (
            <div className="flex-1 flex items-center justify-center text-sm text-brand-error font-semibold">
              Error loading simulator: {error}
            </div>
          )}

          {optData && !error && (
            <div className="space-y-6 text-left">
              {/* Split visualization bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  <span>Channel Allocation Mix</span>
                  <span>Total Budget: ${(optData.tv_spend + optData.radio_spend + optData.newspaper_spend).toFixed(1)}k</span>
                </div>
                <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-brand-border">
                  <div 
                    className="h-full bg-brand-primary flex items-center justify-center text-[10px] font-black text-white"
                    style={{ width: `${optData.recommended_allocation.TV}%` }}
                    title={`TV: ${optData.recommended_allocation.TV}%`}
                  >
                    {optData.recommended_allocation.TV > 15 ? `${optData.recommended_allocation.TV.toFixed(0)}%` : ""}
                  </div>
                  <div 
                    className="h-full bg-brand-secondary flex items-center justify-center text-[10px] font-black text-white"
                    style={{ width: `${optData.recommended_allocation.Radio}%` }}
                    title={`Radio: ${optData.recommended_allocation.Radio}%`}
                  >
                    {optData.recommended_allocation.Radio > 15 ? `${optData.recommended_allocation.Radio.toFixed(0)}%` : ""}
                  </div>
                  <div 
                    className="h-full bg-brand-accent flex items-center justify-center text-[10px] font-black text-white"
                    style={{ width: `${optData.recommended_allocation.Newspaper}%` }}
                    title={`Newspaper: ${optData.recommended_allocation.Newspaper}%`}
                  >
                    {optData.recommended_allocation.Newspaper > 15 ? `${optData.recommended_allocation.Newspaper.toFixed(0)}%` : ""}
                  </div>
                </div>
              </div>

              {/* Channels Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TV */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/60">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-brand-primary">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>TV Spend</span>
                  </div>
                  <div className="text-xl font-extrabold text-white">${optData.tv_spend.toFixed(1)}k</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{optData.recommended_allocation.TV}% allocation</div>
                </div>

                {/* Radio */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/60">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-brand-secondary">
                    <RadioIcon className="w-3.5 h-3.5" />
                    <span>Radio Spend</span>
                  </div>
                  <div className="text-xl font-extrabold text-white">${optData.radio_spend.toFixed(1)}k</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{optData.recommended_allocation.Radio}% allocation</div>
                </div>

                {/* Newspaper */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/60">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-brand-accent">
                    <NewsIcon className="w-3.5 h-3.5" />
                    <span>Print Spend</span>
                  </div>
                  <div className="text-xl font-extrabold text-white">${optData.newspaper_spend.toFixed(1)}k</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{optData.recommended_allocation.Newspaper}% allocation</div>
                </div>
              </div>

              {/* Outputs Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Predicted Sales */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-brand-border flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Predicted Sales</span>
                    <TrendingUp className="w-3 h-3 text-brand-primary" />
                  </div>
                  <div className="text-2xl font-black text-white">{optData.predicted_sales.toFixed(2)}k</div>
                  <span className="text-[9px] font-semibold uppercase text-brand-primary mt-1">Units Sold</span>
                </div>

                {/* Gross Revenue */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-brand-border flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Gross Revenue</span>
                    <DollarSign className="w-3 h-3 text-brand-secondary" />
                  </div>
                  <div className="text-2xl font-black text-white">${optData.revenue.toFixed(1)}k</div>
                  <span className="text-[9px] font-semibold uppercase text-brand-secondary mt-1">Estimated Sales Value</span>
                </div>

                {/* ROI */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-brand-border flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Return on Spend</span>
                    <Percent className="w-3 h-3 text-brand-accent" />
                  </div>
                  <div className="text-2xl font-black text-brand-accent">+{optData.roi.toFixed(1)}%</div>
                  <span className="text-[9px] font-semibold uppercase text-brand-accent mt-1">Net Yield</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-[10px] font-bold text-slate-500 border-t border-brand-border/40 pt-4 uppercase tracking-widest">
          Optimized using SciPy SLSQP Solver under Budget constraints
        </div>
      </div>
    </div>
  );
};
