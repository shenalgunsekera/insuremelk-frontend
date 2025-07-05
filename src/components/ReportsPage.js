import React, { useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, CardActions, Button, Collapse, Stack, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useAuth } from '../App';
import Sidebar from './Sidebar';
import Header from './Header';
import Papa from 'papaparse';
import CircularProgress from '@mui/material/CircularProgress';

const API_URL = 'http://localhost:5000';

const ReportsPage = () => {
  const { token } = useAuth();
  const [expanded, setExpanded] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [clients, setClients] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState({ clients: 'all', summary: 'all' });
  const [dateRange, setDateRange] = useState({ clients: { from: null, to: null }, summary: { from: null, to: null } });

  const fetchClients = async (rangeMode) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let filtered = res.data;
      if (rangeMode === 'range') {
        const { from, to } = dateRange.clients;
        filtered = filtered.filter(c => {
          const date = c.policy_period_from ? new Date(c.policy_period_from) : null;
          if (!date) return false;
          if (from && date < from) return false;
          if (to && date > to) return false;
          return true;
        });
      }
      setClients(filtered);
      console.log('Fetched clients:', filtered);
    } catch (err) {
      setClients([]);
      console.error('Error fetching clients:', err);
    }
    setLoading(false);
  };

  const fetchSummary = async (rangeMode) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let filtered = res.data;
      if (rangeMode === 'range') {
        const { from, to } = dateRange.summary;
        filtered = filtered.filter(c => {
          const date = c.policy_period_from ? new Date(c.policy_period_from) : null;
          if (!date) return false;
          if (from && date < from) return false;
          if (to && date > to) return false;
          return true;
        });
      }
      const sum = (arr, key) => arr.reduce((a, b) => a + (Number(b[key]) || 0), 0);
      const summaryObj = {
        sum_insured: sum(filtered, 'sum_insured'),
        basic_premium: sum(filtered, 'basic_premium'),
        net_premium: sum(filtered, 'net_premium'),
        total_invoice: sum(filtered, 'total_invoice')
      };
      setSummary(summaryObj);
      console.log('Fetched summary:', summaryObj);
    } catch (err) {
      setSummary(null);
      console.error('Error fetching summary:', err);
    }
    setLoading(false);
  };

  const downloadClientsCSV = () => {
    const headers = ['Client Name', 'Product', 'Policy No', 'Policy Period From', 'Sum Insured', 'Net Premium'];
    let data = clients.map(c => [
      c.client_name,
      c.product,
      c.policy_no,
      c.policy_period_from,
      c.sum_insured,
      c.net_premium
    ]);
    if (!data.length) {
      data = [['No data for selected range']];
    }
    const csv = Papa.unparse({ fields: headers, data });
    const now = new Date();
    const filename = `client_list_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.csv`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Downloaded client list CSV:', filename);
  };

  const downloadSummaryCSV = () => {
    const headers = ['Sum Insured', 'Basic Premium', 'Net Premium', 'Total Invoice'];
    let data = summary ? [[
      summary.sum_insured,
      summary.basic_premium,
      summary.net_premium,
      summary.total_invoice
    ]] : [['No data for selected range']];
    const csv = Papa.unparse({ fields: headers, data });
    const now = new Date();
    const filename = `financial_summary_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.csv`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Downloaded summary CSV:', filename);
  };

  const handleExpand = (card) => {
    setExpanded(card);
    if (card === 'clients') {
      fetchClients(mode.clients);
    } else if (card === 'summary') {
      fetchSummary(mode.summary);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f8fa' }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: { md: '240px' }, width: { xs: '100vw', md: 'calc(100vw - 240px)' }, maxWidth: '100vw', overflowX: 'auto' }}>
          <Header />
          <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="primary" mb={2}>Reports</Typography>
            <Stack spacing={3}>
              {/* Client List Card */}
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} color="primary">Client List</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>View all clients for a selected period.</Typography>
                  <CardActions>
                    <Button variant={mode.clients === 'all' ? 'contained' : 'outlined'} color="primary" onClick={() => { setMode(m => ({ ...m, clients: 'all' })); handleExpand('clients'); }}>All Time</Button>
                    <Button variant={mode.clients === 'range' ? 'contained' : 'outlined'} color="secondary" onClick={() => { setMode(m => ({ ...m, clients: 'range' })); handleExpand('clients'); }}>Select Date Range</Button>
                    <Button variant="outlined" color="primary" onClick={downloadClientsCSV} sx={{ ml: 'auto' }} disabled={!clients.length || loading}>Download CSV</Button>
                  </CardActions>
                  <Collapse in={expanded === 'clients'} timeout="auto" unmountOnExit>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}><CircularProgress /></Box>
                    ) : (
                      <>
                        {mode.clients === 'range' && (
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ my: 2 }}>
                            <DatePicker
                              label="From"
                              value={dateRange.clients.from}
                              onChange={val => setDateRange(r => ({ ...r, clients: { ...r.clients, from: val } }))}
                              slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                            <DatePicker
                              label="To"
                              value={dateRange.clients.to}
                              onChange={val => setDateRange(r => ({ ...r, clients: { ...r.clients, to: val } }))}
                              slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                            <Button variant="contained" color="primary" onClick={() => fetchClients('range')}>View</Button>
                          </Stack>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Client Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Policy No</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Policy Period From</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Sum Insured</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Net Premium</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {clients.map(c => (
                                <TableRow key={c.id}>
                                  <TableCell>{c.client_name}</TableCell>
                                  <TableCell>{c.product}</TableCell>
                                  <TableCell>{c.policy_no}</TableCell>
                                  <TableCell>{c.policy_period_from}</TableCell>
                                  <TableCell>{c.sum_insured}</TableCell>
                                  <TableCell>{c.net_premium}</TableCell>
                                </TableRow>
                              ))}
                              {clients.length === 0 && !loading && (
                                <TableRow>
                                  <TableCell colSpan={6} align="center">No clients found for selected range.</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
              {/* Financial Summary Card */}
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} color="primary">Financial Summary</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>View financial summary for a selected period.</Typography>
                  <CardActions>
                    <Button variant={mode.summary === 'all' ? 'contained' : 'outlined'} color="primary" onClick={() => { setMode(m => ({ ...m, summary: 'all' })); handleExpand('summary'); }}>All Time</Button>
                    <Button variant={mode.summary === 'range' ? 'contained' : 'outlined'} color="secondary" onClick={() => { setMode(m => ({ ...m, summary: 'range' })); handleExpand('summary'); }}>Select Date Range</Button>
                    <Button variant="outlined" color="primary" onClick={downloadSummaryCSV} sx={{ ml: 'auto' }} disabled={!summary || loading}>Download CSV</Button>
                  </CardActions>
                  <Collapse in={expanded === 'summary'} timeout="auto" unmountOnExit>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}><CircularProgress /></Box>
                    ) : (
                      <>
                        {mode.summary === 'range' && (
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ my: 2 }}>
                            <DatePicker
                              label="From"
                              value={dateRange.summary.from}
                              onChange={val => setDateRange(r => ({ ...r, summary: { ...r.summary, from: val } }))}
                              slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                            <DatePicker
                              label="To"
                              value={dateRange.summary.to}
                              onChange={val => setDateRange(r => ({ ...r, summary: { ...r.summary, to: val } }))}
                              slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                            <Button variant="contained" color="primary" onClick={() => fetchSummary('range')}>View</Button>
                          </Stack>
                        )}
                        <Divider sx={{ my: 2 }} />
                        {summary && (
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                            <Box>
                              <Typography variant="subtitle2">Sum Insured</Typography>
                              <Typography variant="h6" color="primary">{summary.sum_insured.toLocaleString()}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">Basic Premium</Typography>
                              <Typography variant="h6" color="primary">{summary.basic_premium.toLocaleString()}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">Net Premium</Typography>
                              <Typography variant="h6" color="primary">{summary.net_premium.toLocaleString()}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">Total Invoice</Typography>
                              <Typography variant="h6" color="primary">{summary.total_invoice.toLocaleString()}</Typography>
                            </Box>
                          </Stack>
                        )}
                        {!summary && !loading && <Typography color="text.secondary">No data for selected range.</Typography>}
                      </>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsPage; 