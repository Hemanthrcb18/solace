import React from "react";
export function Button({ children, onClick, variant = "primary", size = "md", icon: Icon, disabled }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn-${variant} ${size === "sm" ? "text-sm px-3 py-1.5" : ""}`}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
}
export default Button;
