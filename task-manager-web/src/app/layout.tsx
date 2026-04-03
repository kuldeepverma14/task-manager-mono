'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Provider store={store}>
          {children}
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}
