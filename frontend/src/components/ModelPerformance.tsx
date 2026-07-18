import React, { useState } from "react";
import { Cpu, RefreshCw, CheckCircle2, AlertTriangle, Layers, Sliders } from "lucide-react";

interface ModelPerformanceProps {
  metrics: {
    Model: string;
    MAE: number;
    RMSE: number;
    R2: number;
    CV_R2_Mean: number;
    CV_R2_Std: number;
    Best_Params?: {
      alpha: number;
      max_iter: number;
      tol: number;
    };
  } | null;
  onRetrainSuccess: (newMetrics: any) => void;
}

export const ModelPerformance: React.FC<ModelPerformanceProps> = ({
  metrics,
  onRetrainSuccess
}) => {
  const [retraining, setRetraining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRetrain = async () => {
    setRetraining(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("http://127.0.0.1:8000/train", {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("Retraining failed.");
      }
      const data = await response.json();
      setSuccess(true);
      onRetrainSuccess(data.metrics);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setRetraining(false);
    }
  };

  if (!metrics) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center min-h-[300px] border border-brand-border text-slate-500 text-sm">
        Metrics metadata not found. Ensure backend is running.
      </div>
    );
  }

  const modelParameters = metrics.Best_Params || { alpha: 0.02, max_iter: 1000, tol: 0.01 };

  return (
    <div className="glass-panel p-6 rounded-2xl bg-slate-900/40 border border-brand-border mb-8 text-left relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full filter blur-xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border/40">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Model Diagnostics
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">
              Mathematical performance & parameters tuning
            </p>
          </div>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-primary/90 hover:from-brand-primary/95 hover:to-brand-primary disabled:from-slate-800 disabled:to-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow transition-all duration-200 active:scale-95 disabled:pointer-events-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${retraining ? "animate-spin" : ""}`} />
          <span>{retraining ? "Retraining Model..." : "Retrain Model"}</span>
        </button>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center gap-3 text-xs text-brand-accent font-semibold animate-pulse">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Model retrained successfully! Hyperparameters re-estimated and reloaded on server.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-brand-error/10 border border-brand-error/20 flex items-center gap-3 text-xs text-brand-error font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Tuning failed: {error}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* R2 */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/80">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
            R² Accuracy (Test)
          </div>
          <div className="text-2xl font-black text-white">{(metrics.R2 * 100).toFixed(2)}%</div>
          <div className="text-[9px] font-bold text-brand-accent uppercase tracking-wider mt-1.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent"></span> High Confidence
          </div>
        </div>

        {/* CV R2 Mean */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/80">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
            CV Mean R²
          </div>
          <div className="text-2xl font-black text-white">{(metrics.CV_R2_Mean * 100).toFixed(2)}%</div>
          <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1.5">
            5-Fold average generalization
          </p>
        </div>

        {/* MAE */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/80">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
            Mean Absolute Error (MAE)
          </div>
          <div className="text-2xl font-black text-white">{metrics.MAE.toFixed(4)}</div>
          <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1.5">
            Average prediction units error
          </p>
        </div>

        {/* RMSE */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-brand-border/80">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
            Root Mean Squared Error
          </div>
          <div className="text-2xl font-black text-white">{metrics.RMSE.toFixed(4)}</div>
          <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1.5">
            Penalizes larger outliers error
          </p>
        </div>
      </div>

      {/* Model Parameters info block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-border/40">
        {/* Architecture */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-primary" />
            Model Architecture
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-brand-border/60">
              <span className="text-[9px] uppercase font-bold text-slate-500">Estimator Type</span>
              <p className="text-xs font-bold text-white mt-0.5">{metrics.Model || "Optimized Lasso Regression"}</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-brand-border/60">
              <span className="text-[9px] uppercase font-bold text-slate-500">Dataset Size</span>
              <p className="text-xs font-bold text-white mt-0.5">200 Observations</p>
            </div>
          </div>
        </div>

        {/* Hyperparameters */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-brand-secondary" />
            Hyperparameters Configuration
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-brand-border/60">
              <span className="text-[9px] uppercase font-bold text-slate-500">Regularization (α)</span>
              <p className="text-xs font-bold text-white mt-0.5">{modelParameters.alpha}</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-brand-border/60">
              <span className="text-[9px] uppercase font-bold text-slate-500">Max Iterations</span>
              <p className="text-xs font-bold text-white mt-0.5">{modelParameters.max_iter}</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-brand-border/60">
              <span className="text-[9px] uppercase font-bold text-slate-500">Tolerance (tol)</span>
              <p className="text-xs font-bold text-white mt-0.5">{modelParameters.tol}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
