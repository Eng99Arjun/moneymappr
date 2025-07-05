import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'MoneyMappr - Personal Finance Tracker',
  description: 'Track your personal finances with MoneyMappr - A modern, intuitive finance management app',
  keywords: ['finance', 'money', 'tracker', 'budget', 'expenses', 'MoneyMappr'],
  authors: [{ name: 'MoneyMappr Team' }],
  creator: 'MoneyMappr',
  publisher: 'MoneyMappr',
  applicationName: 'MoneyMappr',
  openGraph: {
    title: 'MoneyMappr - Personal Finance Tracker',
    description: 'Track your personal finances with MoneyMappr',
    siteName: 'MoneyMappr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyMappr - Personal Finance Tracker',
    description: 'Track your personal finances with MoneyMappr',
  },
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
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <head>
        <link rel="icon" href="/money.svg" />
        <meta name="application-name" content="MoneyMappr" />
        <meta name="apple-mobile-web-app-title" content="MoneyMappr" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900 antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
