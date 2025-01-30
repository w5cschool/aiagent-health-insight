import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical Diagnosis System",
  description: "AI-powered medical diagnosis system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-[95%] sm:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex justify-between h-12 sm:h-16">
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Medical Diagnosis System
                </span>
              </div>
            </div>
          </div>
        </nav>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
