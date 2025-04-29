'use client';
import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton,Collapse } from '@mui/material';
import { Menu as MenuIcon, 
  Settings, 
  People, 
  ExpandLess, 
  ExpandMore,
  Assessment,
  Gavel,
  Warning,
  AttachMoney,
  Calculate,
  Security,
  Analytics,
  Message,
  Engineering } from '@mui/icons-material';
import Link from 'next/link';

const DRAWER_WIDTH = 280;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const menuItems = [
    { 
      text: 'Credit Risk Engine', 
      icon: <Assessment />, 
      path: '/dashboard' 
    },
    { 
      text: 'Mock Users', 
      icon: <People />, 
      path: '/users' 
    },
    { 
      text: 'Engine Configurations', 
      icon: <Engineering />, 
      isExpandable: true,
      subItems: [
        { text: 'Scoring Rules', icon: <Gavel />, path: '/config/scoring-rules' },
        { text: 'Knock out Rules', icon: <Warning />, path: '/config/knockout-rules' },
        { text: 'Risk Rating Thresholds', icon: <Analytics />, path: '/config/risk-thresholds' },
        { text: 'Loan Offer Ranges', icon: <AttachMoney />, path: '/config/loan-ranges' },
        { text: 'DBR Settings', icon: <Calculate />, path: '/config/dbr-settings' },
        { text: 'Fraud Detection Rules', icon: <Security />, path: '/config/fraud-rules' },
        { text: 'Insights Messages', icon: <Message />, path: '/config/insights' },
      ]
    }
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
          <Box key={item.text}>
            <ListItem key={item.text} disablePadding>
              {item.isExpandable ? (
                <ListItemButton
                  onClick={() => setConfigOpen(!configOpen)}
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
                  {configOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              ) : (
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
              )}
            </ListItem>
            {item.isExpandable && (
              <Collapse in={configOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      component={Link}
                      href={subItem.path}
                      sx={{
                        pl: 6,
                        py: 1,
                        mx: 2,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'rgba(44, 211, 225, 0.08)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#2CD3E1', minWidth: '40px' }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.text} 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }} 
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
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