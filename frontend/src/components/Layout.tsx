import React from "react";
export function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  return <div className="min-h-screen" style={{ background: "#050810", color: "#e2e8f0" }}>{children}</div>;
}
