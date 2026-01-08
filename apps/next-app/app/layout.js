import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
