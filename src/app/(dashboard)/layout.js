'use client';
import { Box } from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}