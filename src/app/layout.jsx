'use client';

import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import { NotificationsProvider } from "@/context/notifications";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <link rel="icon" href="/img/favicon.ico" />
        <title>LFG Dashboard</title>
      </head>
      <body>
        <ThemeProvider>
          <MaterialTailwindControllerProvider>
            <QueryClientProvider client={queryClient}>
              <NotificationsProvider position="top-right">
                {children}
              </NotificationsProvider>
            </QueryClientProvider>
          </MaterialTailwindControllerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

