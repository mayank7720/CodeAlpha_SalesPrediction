import React from "react";
import { Lightbulb, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const InsightsPanel: React.FC = () => {
  const recommendations = [
    {
      title: "Activate Coordinated TV & Radio Bundles",
      desc: "Our model shows that TV and Radio spends work together to drive the bulk of sales growth. Synchronizing audio and visual campaign dates multiplies ROI through joint exposure, driving 86.2% of the sales volume changes.",
      type: "opportunity"
    },
    {
      title: "Defund Newspaper Budgets",
      desc: "Newspaper spend has near-zero standalone predictive power and its allocation share was completely pruned by Lasso regularization. Stop print spends and reallocate them to visual/audio mixes.",
      type: "warning"
    },
    {
      title: "Observe Radio Saturation limits",
      desc: "Radio is the most efficient channel per dollar, but saturates early at $50k. Inside your allocations, do not spend beyond $50k on Radio as returns flatten out completely due to capacity constraints.",
      type: "risk"
    },
    {
      title: "Scale Baseline Spends with TV",
      desc: "While TV has lower marginal yields than Radio, it has much higher capacity. Use TV to scale your campaign footprints once Radio budget is maximized.",
      type: "opportunity"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-brand-primary/5 border border-brand-border mb-8 text-left relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full filter blur-xl pointer-events-none"></div>

      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-brand-border/40">
        <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shadow-glow">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            AI Recommendations
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold uppercase">
            Conversational Insights & Marketing Audits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chat / Recommendation Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-xs shadow-sm flex-shrink-0">
              AI
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-brand-border text-xs text-slate-300 space-y-3 leading-relaxed">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                Executive Synthesis
              </p>
              <p>
                Hello Mayank, I have audited your historical campaign database and active prediction models. The analysis suggests that the current marketing mix is suffering from capital leakage, primarily through **print media (Newspaper) budgets**.
              </p>
              <p>
                By shifting print budgets to a coordinated **TV and Radio synergy bundle**, you can boost expected campaign sales by up to **22.3%** without expanding your current spending cap.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
              Actionable Recommendations
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/30 border border-brand-border/80 flex gap-3.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {rec.type === "warning" || rec.type === "risk" ? (
                      <AlertTriangle className={`w-4 h-4 ${rec.type === "warning" ? "text-brand-warning" : "text-brand-error"}`} />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white leading-snug">{rec.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Audit Panel */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/50 border border-brand-border flex flex-col justify-between h-full">
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Marketing Allocation Health
            </h4>
            
            <div className="space-y-3.5">
              {/* Metric 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-semibold">Synergy Exposure</span>
                  <span className="text-brand-accent font-bold">Optimal</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-semibold">Print Waste Level</span>
                  <span className="text-brand-error font-bold">High (35%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-error rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-semibold">Budget Bounding Safety</span>
                  <span className="text-brand-primary font-bold">Secure</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-slate-900 border border-brand-border hover:bg-slate-800 text-xs font-bold text-white transition-all duration-200 group">
            <span>Generate PDF Audit</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
