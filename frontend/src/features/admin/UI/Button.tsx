import React from "react";

interface ButtonProps {
  label: string | React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl text-sm font-medium
        backdrop-blur-xl transition-all duration-300 border
        ${
          active
            ? "bg-linear-to-r from-purple-500/90 to-pink-500/90 text-white border-white/40 shadow-lg shadow-purple-500/40 scale-[1.03]"
            : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.05] hover:border-white/30"
        }
      `}
    >
      {label}
    </button>
  );
};

export default Button;