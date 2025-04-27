'use client';
import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, InputAdornment, IconButton, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Business } from '@mui/icons-material';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0A2647 0%, #144272 100%)',
      py: 8
    }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              color: '#0A2647',
              fontWeight: 700,
              mb: 1
            }}>
              Create Account
            </Typography>
            <Typography color="text.secondary">
              Join us to start making smarter lending decisions
            </Typography>
          </Box>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#2CD3E1' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#2CD3E1' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: '#2CD3E1' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#2CD3E1' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#2CD3E1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#2CD3E1',
                color: '#0A2647',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1ABED0'
                }
              }}
            >
              Create Account
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography color="text.secondary">
                Already have an account?{' '}
                <Link href="/auth/login" style={{
                  color: '#2CD3E1',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}