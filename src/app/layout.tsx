"use client";
import "@fontsource-variable/lora";
import "@fontsource-variable/inter";
import { Provider } from "@/contexts";
import NavBar from "@/components/navigation";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: JSX.Element;
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
      <body style={{ minWidth: "320px" }}>
        <SessionProvider>
          <Provider>
            <div style={{ gridColumn: "1/-1" }}>
              <NavBar />
              {children}
            </div>
          </Provider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
