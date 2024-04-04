import type { Metadata } from "next";
import "@/app/globals.css";

import TanstackProvider from "@/providers/TanstackProvider";

export const metadata: Metadata = {
  title: "김치 프리미엄",
  description: "김치 프리미엄",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
