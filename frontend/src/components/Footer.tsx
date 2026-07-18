import React from "react";
import { Sparkles, Code, FileText, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-brand-border mt-12 py-8 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 bg-brand-bg/40">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
        <span className="font-extrabold text-slate-400 uppercase tracking-widest">
          Sales Intelligence AI
        </span>
        <span>• v1.0.0</span>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <a href="#docs" className="flex items-center gap-1.5 hover:text-slate-350 hover:underline">
          <FileText className="w-3.5 h-3.5" />
          <span>Documentation</span>
        </a>
        <a href="#github" className="flex items-center gap-1.5 hover:text-slate-350 hover:underline">
          <Code className="w-3.5 h-3.5" />
          <span>GitHub Repository</span>
        </a>
        <a href="#privacy" className="flex items-center gap-1.5 hover:text-slate-350 hover:underline">
          <Globe className="w-3.5 h-3.5" />
          <span>Privacy & Security</span>
        </a>
        <a href="#terms" className="hover:text-slate-350 hover:underline">Terms of Service</a>
        <a href="#contact" className="hover:text-slate-350 hover:underline">Contact Enterprise Support</a>
      </div>

      <div className="mt-4 md:mt-0">
        &copy; {new Date().getFullYear()} Sales Intelligence AI Inc. All rights reserved.
      </div>
    </footer>
  );
};
