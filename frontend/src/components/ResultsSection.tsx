import React from "react";
import { Sparkles, DollarSign, Percent } from "lucide-react";

interface ResultsSectionProps {
  predictedSales: number;
  confidenceLower: number;
  confidenceUpper: number;
  revenue: number;
  roi: number;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  predictedSales,
  confidenceLower,
  confidenceUpper,
  revenue,
  roi
}) => {
  // Determine ROI health
  const isPositiveROI = roi > 0;

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between bg-gradient-to-br from-slate-900/60 to-brand-primary/5 border border-brand-border shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/10 rounded-full filter blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-brand-border/40">
        <div className="p-2.5 rounded-xl bg-brand-accent/10 text-brand-accent shadow-glow-green">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            AI Predictions
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold uppercase">
            Model Outputs & Financial Estimates
          </p>
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {/* Main Sales Output */}
        <div className="text-center p-6 rounded-2xl bg-slate-950/50 border border-brand-border relative">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Predicted Sales Volume
          </div>
          <div className="text-5xl font-black text-white tracking-tight flex items-baseline justify-center gap-1.5">
            {predictedSales.toFixed(2)}
            <span className="text-sm font-bold text-slate-400">k units</span>
          </div>

          {/* Confidence interval slider simulation */}
          <div className="mt-4 pt-4 border-t border-brand-border/40 space-y-2">
            <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              <span>95% Confidence Interval</span>
              <span className="text-brand-primary">[{confidenceLower.toFixed(2)}k – {confidenceUpper.toFixed(2)}k]</span>
            </div>
            {/* CI Horizontal Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
              {/* Highlight CI range visually */}
              <div 
                className="absolute h-full bg-brand-primary/30 rounded-full"
                style={{ left: "20%", right: "20%" }}
              ></div>
              {/* Highlight actual prediction point */}
              <div 
                className="absolute h-3 w-3 bg-brand-primary rounded-full -top-0.5 border border-white shadow-glow"
                style={{ left: "50%", transform: "translateX(-50%)" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Forecasted Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Gross Revenue
              </span>
              <DollarSign className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}k
            </div>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              At $100 average selling price
            </p>
          </div>

          {/* ROI */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Estimated ROI
              </span>
              <Percent className={`w-3.5 h-3.5 ${isPositiveROI ? "text-brand-accent" : "text-brand-error"}`} />
            </div>
            <div className={`text-2xl font-bold tracking-tight ${isPositiveROI ? "text-brand-accent" : "text-brand-error"}`}>
              {isPositiveROI ? "+" : ""}{roi.toFixed(1)}%
            </div>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              Compared to total budget spend
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-[10px] font-bold text-slate-500 border-t border-brand-border/40 pt-4 uppercase tracking-widest">
        Powered by Optimized Lasso Regression Pipeline
      </div>
    </div>
  );
};
