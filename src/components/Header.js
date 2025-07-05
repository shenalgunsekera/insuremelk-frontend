import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useAuth } from '../App';

const Header = () => {
  const { user } = useAuth();
  const roleLabel = user?.role === 'manager' ? 'Manager' : user?.role === 'employee' ? 'Employee' : '';
  const name = user?.full_name || user?.username || '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, sm: 3 }, py: 2, bgcolor: 'white', borderBottom: 1, borderColor: '#eee' }}>
      <Box>
        <Typography variant="h6" fontWeight={600}>Underwriters</Typography>
        <Typography variant="body2" color="text.secondary">Welcome back, {roleLabel}!</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography color="text.secondary">{name}</Typography>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}> <span role="img" aria-label="user">👤</span> </Avatar>
      </Box>
    </Box>
  );
};

export default Header; 