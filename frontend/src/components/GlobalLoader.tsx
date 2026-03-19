import React from 'react';
import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ text = "Loading Security Perimeter...", fullScreen = true }) => {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-[9999]' : 'w-full h-full min-h-screen'} bg-[#0c121d] flex flex-col items-center justify-center`}>
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-[#422afb] blur-[30px] opacity-30 rounded-full" />
        <Loader2 size={56} className="text-[#422afb] animate-spin relative z-10" />
      </div>
      <h2 className="text-white/80 font-black tracking-[0.2em] uppercase text-xs animate-pulse">
        {text}
      </h2>
    </div>
  );
};

export default GlobalLoader;
