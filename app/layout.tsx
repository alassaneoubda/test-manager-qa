import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Manager - Gestion de Tests",
  description: "Application de gestion de tests fonctionnels avec génération de rapport PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
