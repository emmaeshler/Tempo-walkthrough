import type { Metadata } from "next";
import "./globals.css";
import WalkthroughShell from "../components/ModelWalkthrough/WalkthroughShell";

export const metadata: Metadata = {
  title: "Insight2Profit - Drive Applications",
  description: "Insight2Profit Drive Applications Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <WalkthroughShell>{children}</WalkthroughShell>
      </body>
    </html>
  );
}
