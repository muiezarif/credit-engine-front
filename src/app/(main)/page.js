'use client';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import Link from 'next/link';
import { redirect } from 'next/navigation'; // for App Router (Next.js 13+)
import { useEffect } from 'react';


export default function LandingPage() {
  useEffect(() => {
      redirect('/dashboard');
  },[])
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A2647 0%, #144272 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
                Smart Credit Decisions
                <Typography component="span" sx={{
                  color: '#2CD3E1',
                  display: 'block'
                }}>
                  Made Simple
                </Typography>
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Instant credit eligibility checks powered by advanced analytics
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/auth/register"
                sx={{
                  backgroundColor: '#2CD3E1',
                  color: '#0A2647',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#1ABED0'
                  }
                }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                position: 'relative',
                width: '100%',
                height: '400px',
                '& img': {
                  objectFit: 'contain',
                  filter: 'invert(1)', // Makes the black SVG white
                  opacity: 0.9
                }
              }}>
                <img
                  src="/images/credit.svg"
                  alt="Credit Analysis"
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 600,
            color: '#0A2647'
          }}
        >
          Our Features
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          <Grid item xs={12} sm={6} md={4} sx={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Card sx={{
              width: { xs: '100%', sm: '340px' }, // Fixed width with responsiveness
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              minHeight: '300px', // Ensures minimum height
              boxShadow: 3,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{
                textAlign: 'center',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2
              }}>
                <AssessmentIcon sx={{ fontSize: 48, color: '#2CD3E1', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Instant Assessment
                </Typography>
                <Typography color="text.secondary">
                  Get immediate credit eligibility results based on comprehensive financial criteria
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Card sx={{
              width: { xs: '100%', sm: '340px' }, // Fixed width with responsiveness
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              minHeight: '300px', // Ensures minimum height
              boxShadow: 3,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{
                textAlign: 'center',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2
              }}>
                <SecurityIcon sx={{ fontSize: 48, color: '#2CD3E1', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Secure Analysis
                </Typography>
                <Typography color="text.secondary">
                  Bank-grade security ensuring your financial data remains protected
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Card sx={{
              width: { xs: '100%', sm: '340px' }, // Fixed width with responsiveness
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              minHeight: '300px', // Ensures minimum height
              boxShadow: 3,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{
                textAlign: 'center',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2
              }}>
                <SpeedIcon sx={{ fontSize: 48, color: '#2CD3E1', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Smart Parameters
                </Typography>
                <Typography color="text.secondary">
                  Customizable lending criteria based on salary, assets, and financial history
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(90deg, #0A2647 0%, #144272 100%)',
        color: 'white',
        py: 8,
        mt: 8
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Ready to Transform Your Lending Process?
          </Typography>
          <Typography sx={{ mb: 4, opacity: 0.9 }}>
            Join us today and make data-driven lending decisions with confidence
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/auth/register"
            sx={{
              backgroundColor: '#2CD3E1',
              color: '#0A2647',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#1ABED0'
              }
            }}
          >
            Start Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
}