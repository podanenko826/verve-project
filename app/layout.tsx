import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import NavBar from './NavBar';
import SideBar from './SideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Verve',
  description: 'Manage events like never before',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradienn-radial flex w-screen`}>
        <div>
          <SideBar />
        </div>
        <div className="w-screen">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
