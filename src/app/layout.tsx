/**
 * Root layout for Admin Console
 */

import './globals.css';
import { Inter } from 'next/font/google';
import ThreeBackground from '../components/ThreeBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Discord Copilot - Admin Console',
  description: 'Admin control panel for Discord Copilot AI agent',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThreeBackground />
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
