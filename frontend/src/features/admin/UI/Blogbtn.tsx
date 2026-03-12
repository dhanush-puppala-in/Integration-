import React from "react";

interface BlogBtnProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children?: React.ReactNode;
  type?: "primary" | "danger" | "button" | "submit" | "reset";
}

const BlogBtn: React.FC<BlogBtnProps> = ({
  children,
  type = "primary",
  ...props
}) => {
  const base = "px-4 py-2 rounded-lg text-sm transition";

  const colors =
    type === "danger"
      ? "bg-red-500/20 border-red-400/40 hover:bg-red-500/30 text-red-300"
      : "bg-white/20 border border-white/30 hover:bg-white/30 text-white";

  const buttonType =
    type === "button" || type === "submit" || type === "reset"
      ? type
      : "button";

  return (
    <button type={buttonType} className={`${base} ${colors}`} {...props}>
      {children}
    </button>
  );
};

export default BlogBtn;