import React, { useState } from "react";
// @ts-ignore
import Plot from "react-plotly.js";
import { BarChart3, RefreshCw } from "lucide-react";

interface AnalyticsSectionProps {
  analyticsData: {
    historical_scatter: any[];
    correlation_matrix: any;
    shap_importance: any[];
    residuals: any[];
  } | null;
  loading: boolean;
  onRefresh: () => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  analyticsData,
  loading,
  onRefresh
}) => {
  const [chartTab, setChartTab] = useState<string>("relationships");

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center min-h-[400px] mb-8 border border-brand-border">
        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mb-4" />
        <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
          Loading Analytics Data...
        </p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center min-h-[400px] mb-8 border border-brand-border text-slate-500 text-sm">
        No analytics data available. Ensure backend is running.
      </div>
    );
  }

  const { historical_scatter, correlation_matrix, shap_importance, residuals } = analyticsData;

  // 1. Spend vs Sales Scatter Data
  const scatterPlotData = [
    {
      x: historical_scatter.map(d => d.TV),
      y: historical_scatter.map(d => d.Sales),
      mode: 'markers',
      name: 'TV Spend',
      marker: { color: '#00F2FE', opacity: 0.7, size: 7 }
    },
    {
      x: historical_scatter.map(d => d.Radio),
      y: historical_scatter.map(d => d.Sales),
      mode: 'markers',
      name: 'Radio Spend',
      marker: { color: '#FF007A', opacity: 0.7, size: 7 }
    },
    {
      x: historical_scatter.map(d => d.Newspaper),
      y: historical_scatter.map(d => d.Sales),
      mode: 'markers',
      name: 'Newspaper Spend',
      marker: { color: '#39FF14', opacity: 0.5, size: 7 }
    }
  ];

  // 2. SHAP Importance Data
  // Sort from lowest to highest for horizontal layout
  const sortedShap = [...shap_importance].reverse();
  const shapChartData = [
    {
      x: sortedShap.map(d => d.Mean_Abs_SHAP),
      y: sortedShap.map(d => d.Feature),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: sortedShap.map((_, i) => i / sortedShap.length),
        colorscale: [
          [0, '#FF007A'],
          [1, '#00F2FE']
        ]
      }
    }
  ];

  // 3. Correlation Heatmap Data
  const corrFeatures = Object.keys(correlation_matrix);
  const zValues = corrFeatures.map(f1 => 
    corrFeatures.map(f2 => correlation_matrix[f1][f2])
  );
  const heatmapData = [
    {
      z: zValues,
      x: corrFeatures,
      y: corrFeatures,
      type: 'heatmap',
      colorscale: 'Viridis',
      showscale: true
    }
  ];

  // 4. Actual vs Predicted Data
  const actuals = residuals.map(r => r.Sales);
  const predictions = residuals.map(r => r.Predicted);
  const minVal = Math.min(...actuals, ...predictions);
  const maxVal = Math.max(...actuals, ...predictions);
  
  const residualChartData = [
    {
      x: actuals,
      y: predictions,
      mode: 'markers',
      name: 'Campaigns',
      marker: { color: '#FF007A', opacity: 0.7, size: 6 }
    },
    {
      x: [minVal, maxVal],
      y: [minVal, maxVal],
      mode: 'lines',
      name: 'Perfect Match (y=x)',
      line: { color: '#FF3366', dash: 'dash', width: 2 }
    }
  ];

  // Common Layout settings for Dark Theme
  const commonLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#94a3b8', family: 'Inter, sans-serif', size: 10 },
    margin: { l: 60, r: 20, t: 40, b: 50 },
    hoverlabel: { bgcolor: '#1e293b', font: { color: '#fff' } },
    xaxis: {
      gridcolor: 'rgba(255,255,255,0.03)',
      zerolinecolor: 'rgba(255,255,255,0.05)',
      linecolor: 'rgba(255,255,255,0.08)'
    },
    yaxis: {
      gridcolor: 'rgba(255,255,255,0.03)',
      zerolinecolor: 'rgba(255,255,255,0.05)',
      linecolor: 'rgba(255,255,255,0.08)'
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl bg-slate-900/40 border border-brand-border mb-8 flex flex-col justify-between">
      {/* Header bar with tabs and refresh */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border/40">
        <div className="flex items-center gap-3.5 text-left">
          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Marketing Analytics
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">
              Model diagnostics & historical campaign plots
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-brand-border">
          <button
            onClick={() => setChartTab("relationships")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 uppercase ${chartTab === "relationships" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Channels vs Sales
          </button>
          <button
            onClick={() => setChartTab("importance")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 uppercase ${chartTab === "importance" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            AI XAI Impact
          </button>
          <button
            onClick={() => setChartTab("heatmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 uppercase ${chartTab === "heatmap" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Correlation Matrix
          </button>
          <button
            onClick={() => setChartTab("residuals")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 uppercase ${chartTab === "residuals" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Fit Diagnostics
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="p-2 bg-slate-900/60 border border-brand-border hover:bg-slate-800/60 text-slate-400 hover:text-white rounded-xl transition-all duration-200"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Chart Canvas */}
      <div className="w-full min-h-[360px] flex items-center justify-center relative overflow-hidden rounded-xl bg-slate-950/20 p-2">
        {chartTab === "relationships" && (
          <Plot
            data={scatterPlotData}
            layout={{
              ...commonLayout,
              title: "Historical Spend ($1,000s) vs Sales Volume (1,000 units)",
              xaxis: { ...commonLayout.xaxis, title: "Advertising Budget ($1,000s)" },
              yaxis: { ...commonLayout.yaxis, title: "Product Sales (1,000 units)" },
              legend: { font: { color: '#e2e8f0' } }
            }}
            useResizeHandler={true}
            className="w-full min-h-[350px]"
          />
        )}

        {chartTab === "importance" && (
          <Plot
            data={shapChartData}
            layout={{
              ...commonLayout,
              title: "Global Feature Attribution (Mean Absolute SHAP Value)",
              xaxis: { ...commonLayout.xaxis, title: "Average Sales Shifts (1,000 units)" },
              yaxis: { ...commonLayout.yaxis, title: "Features", automargin: true }
            }}
            useResizeHandler={true}
            className="w-full min-h-[350px]"
          />
        )}

        {chartTab === "heatmap" && (
          <Plot
            data={heatmapData}
            layout={{
              ...commonLayout,
              title: "Pearson Feature Correlation Coefficients Matrix",
              xaxis: { ...commonLayout.xaxis, side: 'bottom' },
              yaxis: { ...commonLayout.yaxis, automargin: true }
            }}
            useResizeHandler={true}
            className="w-full min-h-[350px]"
          />
        )}

        {chartTab === "residuals" && (
          <Plot
            data={residualChartData}
            layout={{
              ...commonLayout,
              title: "Model Predictions Calibration: Actual vs. Predicted Sales",
              xaxis: { ...commonLayout.xaxis, title: "Actual Sales (1,000 units)" },
              yaxis: { ...commonLayout.yaxis, title: "Predicted Sales (1,000 units)" },
              legend: { font: { color: '#e2e8f0' } }
            }}
            useResizeHandler={true}
            className="w-full min-h-[350px]"
          />
        )}
      </div>
    </div>
  );
};
