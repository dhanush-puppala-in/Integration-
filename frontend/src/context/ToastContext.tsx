import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
           <div
           key={toast.id}
           className={`min-w-[300px] pointer-events-auto flex items-start gap-4 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
             toast.type === 'success' ? 'bg-[#0f172a]/90 border-green-500/20' :
             toast.type === 'error' ? 'bg-[#0f172a]/90 border-red-500/20' :
             'bg-[#0f172a]/90 border-blue-500/20'
           }`}
         >
           {toast.type === 'success' && <CheckCircle size={22} className="shrink-0 mt-0.5 text-green-400" />}
           {toast.type === 'error' && <AlertCircle size={22} className="shrink-0 mt-0.5 text-red-400" />}
           {toast.type === 'info' && <Info size={22} className="shrink-0 mt-0.5 text-blue-400" />}
           
           <p className="flex-1 text-sm font-semibold text-white mt-0.5 leading-snug">
             {toast.message}
           </p>
           
           <button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-white transition-colors mt-0.5">
             <X size={16} />
           </button>
         </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
