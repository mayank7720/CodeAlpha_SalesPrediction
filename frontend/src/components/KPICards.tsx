import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Zap, 
  Cpu, 
  ArrowUpRight
} from "lucide-react";

interface KPICardsProps {
  predictedSales: number;
  totalSpend: number;
  roi: number;
  bestChannel: string;
  r2: number;
  revenueGrowth: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  }
} as const;

export const KPICards: React.FC<KPICardsProps> = ({
  predictedSales,
  totalSpend,
  roi,
  bestChannel,
  r2,
  revenueGrowth
}) => {
  const cards = [
    {
      title: "Predicted Sales",
      value: `${predictedSales.toFixed(2)}k`,
      subtitle: "Product units predicted",
      icon: TrendingUp,
      glow: "hover:shadow-glow hover:border-brand-primary/30",
      color: "text-brand-primary",
      badge: "+14.2% vs avg",
      badgeType: "success"
    },
    {
      title: "Total Campaign Spend",
      value: `$${totalSpend.toFixed(2)}k`,
      subtitle: "Combined marketing budget",
      icon: DollarSign,
      glow: "hover:shadow-glow-purple hover:border-brand-secondary/30",
      color: "text-brand-secondary",
      badge: "Within budget limits",
      badgeType: "info"
    },
    {
      title: "Estimated ROI",
      value: `${roi.toFixed(1)}%`,
      subtitle: "Gross campaign return",
      icon: Percent,
      glow: "hover:shadow-glow-green hover:border-brand-accent/30",
      color: "text-brand-accent",
      badge: "High efficiency",
      badgeType: "success"
    },
    {
      title: "Best Performing Channel",
      value: bestChannel,
      subtitle: "Primary revenue driver",
      icon: Zap,
      glow: "hover:shadow-glow hover:border-yellow-400/30",
      color: "text-yellow-400",
      badge: "Compounding synergy",
      badgeType: "warning"
    },
    {
      title: "Model Accuracy (R²)",
      value: `${(r2 * 100).toFixed(2)}%`,
      subtitle: "Variance explained by model",
      icon: Cpu,
      glow: "hover:shadow-glow-purple hover:border-indigo-400/30",
      color: "text-indigo-400",
      badge: "Lasso Optimized",
      badgeType: "info"
    },
    {
      title: "Expected Revenue Growth",
      value: `+$${revenueGrowth.toFixed(1)}k`,
      subtitle: "Reallocation opportunity",
      icon: ArrowUpRight,
      glow: "hover:shadow-glow-green hover:border-brand-accent/30",
      color: "text-brand-accent",
      badge: "+22.3% achievable",
      badgeType: "success"
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out cursor-default ${card.glow}`}
          >
            {/* Background subtle gradient */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full -mr-8 -mt-8 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-slate-900/60 border border-brand-border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-brand-border/40 flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                card.badgeType === "success" 
                  ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                  : card.badgeType === "warning"
                  ? "bg-brand-warning/10 text-brand-warning border border-brand-warning/20"
                  : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
              }`}>
                {card.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
