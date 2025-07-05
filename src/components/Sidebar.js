import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Divider, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../insureme-logo.png';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleReports = () => {
    navigate('/reports');
  };
  const handleUnderwriters = () => {
    navigate('/');
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
        <Box component="img" src={logo} alt="Insureme Logo" sx={{ width: 40, height: 40, bgcolor: 'white', borderRadius: '50%', objectFit: 'contain' }} />
        <Typography variant="h6" fontWeight={700}>Insureme</Typography>
      </Box>
      <Typography sx={{ pl: 2, pb: 1, fontSize: 13, color: 'secondary.main' }}>Manager Portal</Typography>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem button={true} selected onClick={handleUnderwriters}>
          <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Underwriters" />
        </ListItem>
        <ListItem button={true} onClick={handleReports}>
          <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem button={true} onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'absolute', top: 8, left: 8 }}>
        <IconButton onClick={handleDrawerToggle} color="primary">
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'primary.main' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'primary.main' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar; 