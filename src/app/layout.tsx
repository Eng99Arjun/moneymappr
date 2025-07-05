import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'Track your personal finances with ease',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900 antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
