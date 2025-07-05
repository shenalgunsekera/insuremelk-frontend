import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, IconButton, Pagination, Stack, Dialog, DialogContent, Snackbar, List, ListItem, ListItemText } from '@mui/material';
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
  const [csvErrors, setCsvErrors] = useState([]);
  const [csvErrorDialog, setCsvErrorDialog] = useState(false);
  const [csvImporting, setCsvImporting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // The backend now returns clients sorted by created_at DESC, id DESC
      // But let's add extra sorting logic to ensure newest clients are at the top
      let sorted = res.data;
      
      if (sorted.length > 0) {
        // Sort by created_at first (newest first), then by id (newest first)
        sorted = [...sorted].sort((a, b) => {
          // If both have created_at, sort by that
          if (a.created_at && b.created_at) {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateB.getTime() - dateA.getTime();
            }
          }
          
          // If created_at is the same or missing, sort by id
          if (a.id && b.id) {
            // Handle both string and numeric IDs
            const idA = typeof a.id === 'string' ? a.id.toLowerCase() : a.id;
            const idB = typeof b.id === 'string' ? b.id.toLowerCase() : b.id;
            if (idA !== idB) {
              return idA > idB ? -1 : 1;
            }
          }
          
          return 0;
        });
      }
      
      setClients(sorted);
    } catch (err) {
      console.error('Error fetching clients:', err);
      showSnackbar('Failed to fetch clients', 'error');
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

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Are you sure you want to delete ALL clients? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      const response = await axios.delete(`${API_URL}/clients`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-confirm-delete': 'true'
        }
      });
      fetchClients();
      showSnackbar(`Successfully deleted ${response.data.deletedCount} clients!`, 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to delete all clients', 'error');
    }
  };

  const requiredFields = ['customer_type', 'product', 'insurance_provider', 'client_name', 'mobile_no'];

  const handleDownloadTemplate = () => {
    const allFields = [
      'customer_type', 'product', 'insurance_provider', 'client_name', 'mobile_no',
      'ceilao_ib_file_no', 'vehicle_number', 'main_class', 'insurer', 'introducer_code',
      'branch', 'street1', 'street2', 'city', 'district', 'province', 'telephone',
      'contact_person', 'email', 'social_media', 'nic_proof', 'dob_proof',
      'business_registration', 'svat_proof', 'vat_proof', 'policy_type', 'policy_no',
      'policy_period_from', 'policy_period_to', 'coverage', 'sum_insured',
      'basic_premium', 'srcc_premium', 'tc_premium', 'net_premium', 'stamp_duty',
      'admin_fees', 'road_safety_fee', 'policy_fee', 'vat_fee', 'total_invoice',
      'commission_type', 'commission_basic', 'commission_srcc', 'commission_tc',
      'sales_rep_id'
    ];
    
    const example = {
      customer_type: 'Individual',
      product: 'Comprehensive',
      insurance_provider: 'Ceylinco',
      client_name: 'John Doe',
      mobile_no: '0771234567',
      ceilao_ib_file_no: 'IB001',
      vehicle_number: 'ABC-1234',
      main_class: 'Motor',
      insurer: 'Ceylinco Insurance',
      introducer_code: 'INT001',
      branch: 'Colombo',
      street1: '123 Main Street',
      street2: 'Apt 4B',
      city: 'Colombo',
      district: 'Western',
      province: 'Western',
      telephone: '0112345678',
      contact_person: 'Jane Doe',
      email: 'john.doe@email.com',
      social_media: 'Facebook: johndoe',
      nic_proof: 'NIC123456789',
      dob_proof: '1990-01-01',
      business_registration: 'BR123456',
      svat_proof: 'SVAT123456',
      vat_proof: 'VAT123456',
      policy_type: 'Comprehensive',
      policy_no: 'POL123456',
      policy_period_from: '2024-01-01',
      policy_period_to: '2025-01-01',
      coverage: 'Comprehensive Coverage',
      sum_insured: '5000000',
      basic_premium: '50000',
      srcc_premium: '5000',
      tc_premium: '3000',
      net_premium: '58000',
      stamp_duty: '100',
      admin_fees: '500',
      road_safety_fee: '200',
      policy_fee: '1000',
      vat_fee: '5800',
      total_invoice: '64600',
      commission_type: 'Percentage',
      commission_basic: '10',
      commission_srcc: '5',
      commission_tc: '5',
      sales_rep_id: '1'
    };
    
    const csv = Papa.unparse([allFields, allFields.map(h => example[h] ?? '')]);
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
    setCsvImporting(true);
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
        
        // Prepare all clients for batch import
        const clients = results.data.map(row => {
          // Clean up the data - remove empty strings and convert to proper types
          const cleanRow = {};
          Object.entries(row).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
              cleanRow[key] = value;
            }
          });
          return cleanRow;
        });
        
        try {
          const response = await axios.post(`${API_URL}/clients`, {
            _csv_import: '1',
            clients: clients
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          
          const { imported, failed, errors } = response.data;
          
          // Show detailed results
          if (failed > 0) {
            setCsvErrors(errors);
            setCsvErrorDialog(true);
            showSnackbar(`Import completed. Imported: ${imported}, Failed: ${failed}. Click to view details.`, 'warning');
          } else {
            showSnackbar(`Successfully imported ${imported} clients!`, 'success');
          }
          
          // Refresh the client list to show new clients at the top
          // Add a small delay to ensure database has processed the new clients
          setTimeout(async () => {
            await fetchClients();
          }, 500);
        } catch (err) {
          showSnackbar(err.response?.data?.error || 'Failed to import CSV', 'error');
        }
        
        // Reset file input so the same file can be selected again
        e.target.value = '';
        setCsvImporting(false);
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
          <Button 
            variant="contained" 
            sx={{ bgcolor: 'primary.main', color: 'white' }} 
            onClick={() => document.getElementById('import-csv-input').click()}
            disabled={csvImporting}
          >
            {csvImporting ? 'Importing...' : 'Import CSV'}
          </Button>
          {user && <Button variant="contained" startIcon={<AddCircleIcon />} sx={{ bgcolor: '#E65100', color: 'white' }} onClick={() => setAddOpen(true)}>Add Client</Button>}
          {user?.role === 'manager' && (
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f', color: 'white', '&:hover': { bgcolor: '#b71c1c' } }} 
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
          )}
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
      
      {/* CSV Import Error Dialog */}
      <Dialog open={csvErrorDialog} onClose={() => setCsvErrorDialog(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
            CSV Import Errors ({csvErrors.length} failed rows)
          </Typography>
          <List>
            {csvErrors.map((error, index) => (
              <ListItem key={index} sx={{ border: '1px solid #ffcdd2', borderRadius: 1, mb: 1 }}>
                <ListItemText
                  primary={`Row ${error.row}`}
                  secondary={error.error}
                  primaryTypographyProps={{ fontWeight: 'bold', color: 'error.main' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setCsvErrorDialog(false)} variant="contained">
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TableSection; 