import "./globals.css";

export const metadata = {
  title: "Web",
  description: "Next.js app in a monorepo."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
