"use client";
import { Providers } from "./providers";

import Footer from "@/components/Footer";
import Headeruser from "@/components/Headeruser";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <Providers>
          {children}
          <ScrollToTop />
        </Providers>
  );
}

