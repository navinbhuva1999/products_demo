"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from "@mui/material";
import theme from "../theme";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <AppRouterCacheProvider>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
