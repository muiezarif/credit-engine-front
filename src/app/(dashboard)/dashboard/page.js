'use client';
import { Box, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Assessment, CreditCard } from '@mui/icons-material';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Applications',
      value: '2,345',
      trend: '+12.5%',
      isPositive: true,
      icon: <Assessment sx={{ fontSize: 40, color: '#2CD3E1' }} />,
    },
    {
      title: 'Approved Credits',
      value: '1,876',
      trend: '+8.2%',
      isPositive: true,
      icon: <CreditCard sx={{ fontSize: 40, color: '#2CD3E1' }} />,
    },
    // Add more stats as needed
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#0A2647', fontWeight: 600 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ p: 1.5, bgcolor: 'rgba(44, 211, 225, 0.1)', borderRadius: 2 }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  {stat.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, my: 0.5 }}>
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.isPositive ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: stat.isPositive ? 'success.main' : 'error.main' }}
                  >
                    {stat.trend}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add more dashboard sections as needed */}
    </Box>
  );
}