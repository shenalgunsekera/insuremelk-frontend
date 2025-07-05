import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, IconButton, Pagination, Stack, Dialog, DialogContent, Snackbar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddClientForm from './AddClientForm';
import ClientDetailsModal from './ClientDetailsModal';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from '../App';
import Papa from 'papaparse';
import { textFields } from './AddClientForm';

const API_URL = 'http://localhost:5000';

const TableSection = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [detailsClient, setDetailsClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user, token } = useAuth();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableVisible, setTableVisible] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // If clients have a created_at field, sort by it descending
      let sorted = res.data;
      if (sorted.length && sorted[0].created_at) {
        sorted = [...sorted].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sorted.length && sorted[0].id) {
        // If id is an incrementing int, sort by id descending
        sorted = [...sorted].sort((a, b) => (b.id > a.id ? 1 : b.id < a.id ? -1 : 0));
      } else {
        // Otherwise, just reverse the array
        sorted = [...sorted].reverse();
      }
      setClients(sorted);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = async (formData) => {
    try {
      await axios.post(`${API_URL}/clients`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setAddOpen(false);
      fetchClients();
      showSnackbar('Client added successfully!', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to add client', 'error');
    }
  };

  const handleEdit = async (formData) => {
    try {
      await axios.put(`${API_URL}/clients/${editClient.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setEditClient(null);
      fetchClients();
      showSnackbar('Client updated successfully!', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to update client', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClients();
      showSnackbar('Client deleted successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to delete client', 'error');
    }
  };

  const requiredFields = ['customer_type', 'product', 'insurance_provider', 'client_name', 'mobile_no'];

  const handleDownloadTemplate = () => {
    const example = {
      customer_type: 'Individual',
      product: 'Comprehensive',
      insurance_provider: 'Ceylinco',
      client_name: 'John Doe',
      mobile_no: '0771234567'
    };
    const csv = Papa.unparse([requiredFields, requiredFields.map(h => example[h] ?? '')]);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Validate headers
        const csvHeaders = results.meta.fields || [];
        const missing = requiredFields.filter(f => !csvHeaders.includes(f));
        if (missing.length > 0) {
          showSnackbar(`Missing required fields: ${missing.join(', ')}`, 'error');
          return;
        }
        let success = 0, fail = 0;
        for (const row of results.data) {
          // Validate required fields in each row
          const missingRow = requiredFields.filter(f => !row[f]);
          if (missingRow.length > 0) {
            fail++;
            continue;
          }
          const formData = new FormData();
          Object.entries(row).forEach(([k, v]) => formData.append(k, v));
          formData.append('_csv_import', '1');
          try {
            await axios.post(`${API_URL}/clients`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            });
            success++;
          } catch {
            fail++;
          }
        }
        fetchClients();
        showSnackbar(`Imported: ${success}, Failed: ${fail}`, fail ? 'error' : 'success');
        // Reset file input so the same file can be selected again
        e.target.value = '';
      }
    });
  };

  const paginatedClients = clients.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(clients.length / rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField placeholder="Search clients..." size="small" sx={{ minWidth: 220, bgcolor: 'white' }} />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }} onClick={handleDownloadTemplate}>CSV Template</Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main', color: 'white' }} onClick={() => document.getElementById('import-csv-input').click()}>Import CSV</Button>
          {user && <Button variant="contained" startIcon={<AddCircleIcon />} sx={{ bgcolor: '#E65100', color: 'white' }} onClick={() => setAddOpen(true)}>Add Client</Button>}
          <Button variant="contained" sx={{ bgcolor: '#263238', color: 'white' }} onClick={() => setTableVisible(v => !v)}>{tableVisible ? 'Hide Table' : 'Show Table'}</Button>
        </Stack>
      </Box>
      {tableVisible && (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 16 }}>CLIENT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 16 }}>CONTACT NO</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 16 }}>PRODUCT</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 16 }}>POLICY #</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 16 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClients.map((client, idx) => (
                  <TableRow key={client.id} sx={{ bgcolor: idx % 2 === 0 ? 'white' : 'grey.50', '&:hover': { bgcolor: 'primary.50' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{client.client_name}</TableCell>
                    <TableCell>{client.mobile_no}</TableCell>
                    <TableCell>{client.product}</TableCell>
                    <TableCell>{client.policy_no}</TableCell>
                    <TableCell>
                      <Button startIcon={<VisibilityIcon />} size="small" sx={{ color: 'primary.main', textTransform: 'none' }} onClick={async () => {
                        const res = await axios.get(`${API_URL}/clients/${client.id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setDetailsClient(res.data);
                      }}>Details</Button>
                      {user?.role === 'manager' && (
                        <>
                          <IconButton color="primary" onClick={async () => {
                            const res = await axios.get(`${API_URL}/clients/${client.id}`, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setEditClient(res.data);
                          }}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDelete(client.id)}><DeleteIcon /></IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2">Showing {paginatedClients.length} of {clients.length} clients</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Show</Typography>
              <TextField select size="small" value={rowsPerPage} sx={{ width: 70, bgcolor: 'white' }} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }} SelectProps={{ native: true }}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </TextField>
              <Typography variant="body2">per page</Typography>
            </Box>
            <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} sx={{ '& .Mui-selected': { bgcolor: 'primary.main', color: 'white' } }} />
          </Box>
        </>
      )}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <AddClientForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editClient} onClose={() => setEditClient(null)} maxWidth="md" fullWidth>
        <DialogContent>
          {editClient && <AddClientForm initialData={editClient} isEdit onSubmit={handleEdit} onCancel={() => setEditClient(null)} />}
        </DialogContent>
      </Dialog>
      <ClientDetailsModal client={detailsClient} onClose={() => setDetailsClient(null)} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        id="import-csv-input"
        onChange={handleImportCSV}
      />
    </Box>
  );
};

export default TableSection; 