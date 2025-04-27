import { Inter } from 'next/font/google';
import { AppBar } from '@mui/material';
import Navbar from '@/components/Navbar';
import ThemeRegistry from '@/components/ThemeRegistry';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Credit Engine',
  description: 'Credit lending eligibility check system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <Navbar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}