import React from "react";
import { X, Settings, LogOut, Shield, User } from "lucide-react";

interface AccountHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountHubModal: React.FC<AccountHubModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="
        relative w-full max-w-sm 
        bg-[#0B0F17] border border-white/5 
        rounded-3xl shadow-2xl 
        overflow-hidden
        animate-in fade-in zoom-in duration-300
      "
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Account Hub
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            {[
              { label: "Profile Settings", icon: User, color: "text-blue-500" },
              {
                label: "Security & Privacy",
                icon: Shield,
                color: "text-emerald-500",
              },
              {
                label: "App Preferences",
                icon: Settings,
                color: "text-purple-500",
              },
              { label: "Sign Out", icon: LogOut, color: "text-red-500" },
            ].map((item) => (
              <button
                key={item.label}
                className="
                  w-full flex items-center gap-4 
                  px-4 py-3 rounded-2xl 
                  hover:bg-white/5 text-gray-300 hover:text-white 
                  transition-all duration-200 group
                "
              >
                <div
                  className={`p-2.5 rounded-xl bg-white/5 ${item.color} transition-transform duration-200 group-hover:scale-110`}
                >
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHubModal;
