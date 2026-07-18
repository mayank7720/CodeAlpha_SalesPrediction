import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { Hero } from "./components/Hero";
import { KPICards } from "./components/KPICards";
import { PredictionPanel } from "./components/PredictionPanel";
import { ResultsSection } from "./components/ResultsSection";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { BudgetOptimizer } from "./components/BudgetOptimizer";
import { InsightsPanel } from "./components/InsightsPanel";
import { ModelPerformance } from "./components/ModelPerformance";
import { Footer } from "./components/Footer";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Predict Input States
  const [tv, setTv] = useState<number>(147.0);
  const [radio, setRadio] = useState<number>(23.2);
  const [newspaper, setNewspaper] = useState<number>(30.5);
  const [targetSegment, setTargetSegment] = useState<string>("Global");
  const [platform, setPlatform] = useState<string>("Cross-channel");
  const [duration, setDuration] = useState<number>(12);

  // Predict Output States
  const [predictedSales, setPredictedSales] = useState<number>(14.02);
  const [confidenceLower, setConfidenceLower] = useState<number>(12.80);
  const [confidenceUpper, setConfidenceUpper] = useState<number>(15.24);
  const [revenue, setRevenue] = useState<number>(1402.0);
  const [roi, setRoi] = useState<number>(600.0);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  // Analytics & Metrics States
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);

  // API Call helper for predictions
  const fetchPrediction = async (t: number, r: number, n: number) => {
    setIsPredicting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tv: t, radio: r, newspaper: n })
      });
      if (response.ok) {
        const data = await response.json();
        setPredictedSales(data.predicted_sales);
        setConfidenceLower(data.confidence_lower);
        setConfidenceUpper(data.confidence_upper);
        setRevenue(data.revenue);
        setRoi(data.roi);
      }
    } catch (err) {
      console.error("Prediction fetch error:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Fetch metrics helper
  const fetchMetrics = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/metrics");
      if (response.ok) {
        const data = await response.json();
        setMetricsData(data);
      }
    } catch (err) {
      console.error("Metrics fetch error:", err);
    }
  };

  // Fetch history helper
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Trigger prediction on values change with small debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPrediction(tv, radio, newspaper);
    }, 150);
    return () => clearTimeout(delayDebounceFn);
  }, [tv, radio, newspaper]);

  // Initial fetches
  useEffect(() => {
    fetchMetrics();
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Channel,Spend ($1000s),Recommended Share (%)\n"
      + `TV,${tv.toFixed(2)},${((tv / (tv + radio + newspaper)) * 100).toFixed(2)}\n`
      + `Radio,${radio.toFixed(2)},${((radio / (tv + radio + newspaper)) * 100).toFixed(2)}\n`
      + `Newspaper,${newspaper.toFixed(2)},${((newspaper / (tv + radio + newspaper)) * 100).toFixed(2)}\n`
      + `\nSummary Metric,Value\n`
      + `Predicted Sales,${predictedSales.toFixed(2)}k units\n`
      + `Expected Revenue,$${revenue.toFixed(2)}k\n`
      + `ROI,${roi.toFixed(1)}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_intelligence_campaign_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex text-slate-200">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Top Navbar */}
      <TopNav onExport={handleExport} />

      {/* Main Panel Content */}
      <main className="flex-1 pl-64 pt-20 min-h-screen flex flex-col justify-between">
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">
          {/* Radial backgrounds for depth */}
          <div className="glow-bg glow-blue top-1/4 left-1/3"></div>
          <div className="glow-bg glow-purple top-1/2 right-1/4"></div>

          {/* ACTIVE TAB ROUTING WITH FRAMER MOTION TRANSITIONS */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="space-y-8"
            >
              {activeTab === "dashboard" && (
                <>
                  <Hero 
                    onPredictClick={() => setActiveTab("predictions")} 
                    onAnalyticsClick={() => setActiveTab("analytics")} 
                  />
                  <div className="text-left mb-4">
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">Campaign Overview</h3>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase">Overall KPIs based on your settings</p>
                  </div>
                  <KPICards 
                    predictedSales={predictedSales}
                    totalSpend={tv + radio + newspaper}
                    roi={roi}
                    bestChannel="TV + Radio synergy"
                    r2={metricsData?.R2 || 0.9882}
                    revenueGrowth={3.4}
                  />
                  <InsightsPanel />
                </>
              )}

              {activeTab === "predictions" && (
                <div className="space-y-6">
                  <div className="text-left mb-2">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Live Inference Engine</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">Run real-time sales predictions on budget adjustments</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-5">
                      <PredictionPanel 
                        tv={tv} setTv={setTv}
                        radio={radio} setRadio={setRadio}
                        newspaper={newspaper} setNewspaper={setNewspaper}
                        targetSegment={targetSegment} setTargetSegment={setTargetSegment}
                        platform={platform} setPlatform={setPlatform}
                        duration={duration} setDuration={setDuration}
                        isPredicting={isPredicting}
                      />
                    </div>
                    <div className="lg:col-span-7">
                      <ResultsSection 
                        predictedSales={predictedSales}
                        confidenceLower={confidenceLower}
                        confidenceUpper={confidenceUpper}
                        revenue={revenue}
                        roi={roi}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="text-left mb-2">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Platform Analytics</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">Explore data relationships and linear modeling fits</p>
                  </div>
                  <AnalyticsSection 
                    analyticsData={analyticsData}
                    loading={loadingAnalytics}
                    onRefresh={fetchAnalytics}
                  />
                </div>
              )}

              {activeTab === "optimizer" && (
                <div className="space-y-6">
                  <div className="text-left mb-2">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Budget Optimizer</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">AI solver maximizes revenue allocation constraints</p>
                  </div>
                  <BudgetOptimizer />
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-6">
                  <div className="text-left mb-2">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Model Metrics</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">Inspect hyperparameter states and trigger parameter retraining</p>
                  </div>
                  <ModelPerformance 
                    metrics={metricsData}
                    onRetrainSuccess={(newMetrics) => {
                      setMetricsData(newMetrics);
                      fetchAnalytics();
                    }}
                  />
                </div>
              )}

              {activeTab === "insights" && (
                <div className="space-y-6">
                  <div className="text-left mb-2">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">AI Recommendations</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">Conversational recommender summaries of marketing spend</p>
                  </div>
                  <InsightsPanel />
                </div>
              )}

              {activeTab === "reports" && (
                <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-brand-border">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Campaign Report Archives</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Access PDF exports, audit logs, and performance histories of previously scheduled campaigns.
                  </p>
                  <button 
                    onClick={handleExport}
                    className="bg-brand-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow hover:bg-brand-primary/95 transition-all duration-200"
                  >
                    Download Current Config Report
                  </button>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="glass-panel p-8 rounded-2xl text-left space-y-6 border border-brand-border">
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">System Config</h3>
                    <p className="text-xs text-slate-400">Manage api endpoints, modeling constraints, and currency settings.</p>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-brand-border/40 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-brand-border/20">
                      <span className="font-semibold text-slate-350">API Base URI</span>
                      <code className="bg-slate-950 px-3 py-1.5 rounded-lg border border-brand-border text-brand-primary">http://127.0.0.1:8000</code>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-brand-border/20">
                      <span className="font-semibold text-slate-350">Data Source Seeding</span>
                      <span className="text-slate-400">backend/data/Advertising.csv</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold text-slate-350">Default Optimization Solver</span>
                      <span className="text-slate-400 font-semibold uppercase">SLSQP (Sequential Least Squares)</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default App;
