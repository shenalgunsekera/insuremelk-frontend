import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TableSection from './components/TableSection';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useMemo, createContext, useContext } from 'react';
import LoginPage from './components/LoginPage';
import ReportsPage from './components/ReportsPage';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // blue
    secondary: { main: '#FFD600' }, // yellow
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const authValue = useMemo(() => ({ user, setUser, token, setToken }), [user, token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authValue}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/*" element={
              <RequireAuth>
                <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f8fa' }}>
                  <Sidebar />
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      ml: { md: '240px' },
                      width: { xs: '100vw', md: 'calc(100vw - 240px)' },
                      maxWidth: '100vw',
                      overflowX: 'auto',
                    }}
                  >
                    <Header />
                    <Box sx={{ flex: 1, p: { xs: 1, sm: 3 } }}>
                      <TableSection />
                    </Box>
                  </Box>
                </Box>
              </RequireAuth>
            } />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App; 