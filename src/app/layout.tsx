'use client';

import store from '@src/redux/store';
import '@styles/globals.css';
// import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';

// const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
