import type { ReactNode } from "react";
import "@acme/ui/experiment-overview.css";
import "@acme/ui/experiment-workbench.css";
import "./globals.css";
import "@acme/ui/reset.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
