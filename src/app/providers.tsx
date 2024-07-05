"use client";

import { ThemeProvider } from "next-themes";
 import '../../i18n.tsx'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
