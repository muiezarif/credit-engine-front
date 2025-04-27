'use client';
import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Assessment, Settings, Person, CreditCard, Logout } from '@mui/icons-material';
import Link from 'next/link';

const DRAWER_WIDTH = 280;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Credit Analysis', icon: <Assessment />, path: '/analysis' },
    { text: 'Applications', icon: <CreditCard />, path: '/applications' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ px: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ 
          color: '#2CD3E1',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}>
          Credit Engine
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              sx={{
                mx: 2,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(44, 211, 225, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#2CD3E1' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            component={Link}
            href="/"
            sx={{
              mx: 2,
              borderRadius: 1,
              color: '#ff4444',
              '&:hover': {
                bgcolor: 'rgba(255, 68, 68, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#0A2647' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: '#0A2647',
              color: 'white'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: '#0A2647',
              color: 'white',
              borderRight: 'none'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: '#F8F9FA',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}