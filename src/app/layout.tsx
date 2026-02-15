import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Open Shekel - Israeli Tax Transparency',
  description:
    'See exactly where every shekel of your taxes goes. Israeli tax calculator with budget breakdown and civic action tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
