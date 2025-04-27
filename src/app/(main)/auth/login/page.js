'use client';
import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import Link from 'next/link';

export default function LoginPage() {
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
              Welcome Back
            </Typography>
            <Typography color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography color="text.secondary">
                Dont have an account?{' '}
                <Link href="/auth/register" style={{
                  color: '#2CD3E1',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}