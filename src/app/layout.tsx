import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WaitLess — Virtual Queue Management for Filipino Businesses',
    template: '%s | WaitLess',
  },
  description:
    'No more lines. Just time. WaitLess is a virtual queue management system built for Philippine clinics, dental offices, salons, banks, and government offices.',
  keywords: ['queue management', 'virtual queue', 'Philippines', 'QR code queue', 'palayan queue'],
  authors: [{ name: 'WaitLess' }],
  openGraph: {
    title: 'WaitLess — Virtual Queue Management',
    description: 'No more lines. Just time.',
    type: 'website',
    locale: 'en_PH',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
