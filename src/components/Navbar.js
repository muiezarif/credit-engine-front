import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Link from 'next/link';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{
      background: 'linear-gradient(90deg, #0A2647 0%, #144272 100%)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ padding: '12px 0' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1 
          }}>
            <AccountBalanceIcon sx={{ 
              fontSize: 32, 
              marginRight: 1,
              color: '#2CD3E1'
            }} />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.5px',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #2CD3E1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Credit Engine
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              href="/auth/login"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: '#2CD3E1',
                  backgroundColor: 'rgba(44, 211, 225, 0.1)'
                }
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              component={Link} 
              href="/auth/register"
              sx={{
                backgroundColor: '#2CD3E1',
                color: '#0A2647',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1ABED0'
                }
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}