import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, InputLabel, Link, Divider, MenuItem, Select, FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const docTextFields = [
  { label: 'Policyholder', doc: 'policyholder_doc_url', text: 'policyholder_text' },
  { label: 'Proposal Form', doc: 'proposal_form_doc_url', text: 'proposal_form_text' },
  { label: 'Quotation', doc: 'quotation_doc_url', text: 'quotation_text' },
  { label: 'CR Copy', doc: 'cr_copy_doc_url', text: 'cr_copy_text' },
  { label: 'Schedule', doc: 'schedule_doc_url', text: 'schedule_text' },
  { label: 'Invoice / Debit Note', doc: 'invoice_doc_url', text: 'invoice_text' },
  { label: 'Payment Receipt', doc: 'payment_receipt_doc_url', text: 'payment_receipt_text' },
  { label: 'NIC / BR', doc: 'nic_br_doc_url', text: 'nic_br_text' },
];

const dropdownFields = {
  'main_class': ['Motor', 'Fire', 'Marine', 'Miscellaneous'],
  'product': ['Comprehensive', 'Third Party', 'Other'],
  'customer_type': ['Individual', 'Company'],
  'insurance_provider': ['Ceylinco', 'Janashakthi', 'Union', 'Other'],
  'branch': ['Colombo', 'Kandy', 'Galle', 'Other'],
  'commission_type': ['Flat', 'Percentage', 'Other']
};

export const textFields = [
  { label: 'Ceilao IB File No.', name: 'ceilao_ib_file_no', section: 'General Info' },
  { label: 'Vehicle Number', name: 'vehicle_number', section: 'General Info' },
  { label: 'Main Class', name: 'main_class', section: 'General Info', dropdown: true },
  { label: 'Insurer', name: 'insurer', section: 'General Info' },
  { label: 'Introducer Code', name: 'introducer_code', section: 'General Info' },
  { label: 'Customer Type', name: 'customer_type', required: true, section: 'General Info', dropdown: true },
  { label: 'Product', name: 'product', required: true, section: 'General Info', dropdown: true },
  { label: 'Policy', name: 'policy_', section: 'General Info' },
  { label: 'Insurance Provider', name: 'insurance_provider', required: true, section: 'General Info', dropdown: true },
  { label: 'Branch', name: 'branch', section: 'General Info', dropdown: true },
  { label: 'Client Name', name: 'client_name', required: true, section: 'General Info' },
  { label: 'Street 1', name: 'street1', section: 'Address' },
  { label: 'Street 2', name: 'street2', section: 'Address' },
  { label: 'City', name: 'city', section: 'Address' },
  { label: 'District', name: 'district', section: 'Address' },
  { label: 'Province', name: 'province', section: 'Address' },
  { label: 'Telephone', name: 'telephone', section: 'Contact' },
  { label: 'Mobile No', name: 'mobile_no', required: true, section: 'Contact' },
  { label: 'Contact Person', name: 'contact_person', section: 'Contact' },
  { label: 'Email', name: 'email', section: 'Contact' },
  { label: 'Social Media', name: 'social_media', section: 'Contact' },
  { label: 'NIC Proof', name: 'nic_proof', section: 'Proofs' },
  { label: 'DOB Proof', name: 'dob_proof', section: 'Proofs' },
  { label: 'Business Registration', name: 'business_registration', section: 'Proofs' },
  { label: 'SVAT Proof', name: 'svat_proof', section: 'Proofs' },
  { label: 'VAT Proof', name: 'vat_proof', section: 'Proofs' },
  { label: 'Policy Type', name: 'policy_type', section: 'Policy Details' },
  { label: 'Policy No', name: 'policy_no', section: 'Policy Details' },
  { label: 'Policy Period From', name: 'policy_period_from', section: 'Policy Details', date: true },
  { label: 'Policy Period To', name: 'policy_period_to', section: 'Policy Details', date: true },
  { label: 'Coverage', name: 'coverage', section: 'Policy Details' },
  { label: 'Sum Insured', name: 'sum_insured', type: 'number', section: 'Financials' },
  { label: 'Basic Premium', name: 'basic_premium', type: 'number', section: 'Financials' },
  { label: 'SRCC Premium', name: 'srcc_premium', type: 'number', section: 'Financials' },
  { label: 'TC Premium', name: 'tc_premium', type: 'number', section: 'Financials' },
  { label: 'Net Premium', name: 'net_premium', type: 'number', section: 'Financials' },
  { label: 'Stamp Duty', name: 'stamp_duty', type: 'number', section: 'Financials' },
  { label: 'Admin Fees', name: 'admin_fees', type: 'number', section: 'Financials' },
  { label: 'Road Safety Fee', name: 'road_safety_fee', type: 'number', section: 'Financials' },
  { label: 'Policy Fee', name: 'policy_fee', type: 'number', section: 'Financials' },
  { label: 'VAT Fee', name: 'vat_fee', type: 'number', section: 'Financials' },
  { label: 'Total Invoice', name: 'total_invoice', type: 'number', section: 'Financials' },
  { label: 'Commission Type', name: 'commission_type', section: 'Commission', dropdown: true },
  { label: 'Commission Basic', name: 'commission_basic', type: 'number', section: 'Commission' },
  { label: 'Commission SRCC', name: 'commission_srcc', type: 'number', section: 'Commission' },
  { label: 'Commission TC', name: 'commission_tc', type: 'number', section: 'Commission' },
  { label: 'Sales Rep ID', name: 'sales_rep_id', section: 'Other' },
  { label: 'Policies', name: 'policies', type: 'number', section: 'Other' },
];

const sectionOrder = [
  'General Info', 'Address', 'Contact', 'Proofs', 'Policy Details', 'Financials', 'Commission', 'Other'
];

const AddClientForm = ({ onSubmit, onCancel, initialData = {}, isEdit = false }) => {
  const [fields, setFields] = useState(() => {
    const obj = {};
    textFields.forEach(f => { obj[f.name] = initialData[f.name] || ''; });
    docTextFields.forEach(f => {
      obj[f.text] = initialData[f.text] || '';
    });
    return obj;
  });
  const [docs, setDocs] = useState({});
  const [dates, setDates] = useState({
    policy_period_from: initialData.policy_period_from || null,
    policy_period_to: initialData.policy_period_to || null
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleDocChange = (e) => {
    setDocs({ ...docs, [e.target.name]: e.target.files[0] });
  };

  const handleDateChange = (name, value) => {
    setDates({ ...dates, [name]: value });
    setFields({ ...fields, [name]: value ? value.toISOString().split('T')[0] : '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const f of textFields.filter(f => f.required)) {
      if (!fields[f.name]) {
        setError(`${f.label} is required`);
        return;
      }
    }
    for (const f of docTextFields) {
      if (!isEdit && !docs[f.doc]) {
        setError(`${f.label} document is required`);
        return;
      }
    }
    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
    Object.entries(docs).forEach(([k, v]) => { if (v) formData.append(k, v); });
    docTextFields.forEach(f => {
      if (fields[f.text]) formData.append(f.text, fields[f.text]);
    });
    onSubmit(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>{isEdit ? 'Edit Client' : 'Add Client'}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Documents</Typography>
        <Grid container columns={12} columnSpacing={2} rowSpacing={2}>
          {docTextFields.map((f, idx) => (
            <Grid item xs={12} sm={6} md={6} key={f.doc}>
              <InputLabel>{f.label} Document {isEdit && initialData[f.doc] && (
                <Link href={initialData[f.doc]} target="_blank" rel="noopener noreferrer">(Current)</Link>
              )}</InputLabel>
              <input
                type="file"
                name={f.doc}
                accept="application/pdf,image/*"
                onChange={handleDocChange}
                style={{ marginBottom: 8 }}
              />
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        {sectionOrder.map(section => (
          <Box key={section} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{section}</Typography>
            <Grid container columns={12} columnSpacing={2} rowSpacing={2}>
              {textFields.filter(f => f.section === section).map(f => (
                <Grid item xs={12} sm={6} md={4} key={f.name}>
                  {f.dropdown ? (
                    <FormControl fullWidth>
                      <InputLabel>{f.label}</InputLabel>
                      <Select
                        label={f.label}
                        name={f.name}
                        value={fields[f.name]}
                        onChange={handleChange}
                        required={!!f.required}
                      >
                        {dropdownFields[f.name].map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                      {f.required && !fields[f.name] && <FormHelperText error>{f.label} is required</FormHelperText>}
                    </FormControl>
                  ) : f.date ? (
                    <DatePicker
                      label={f.label}
                      value={dates[f.name] || null}
                      onChange={val => handleDateChange(f.name, val)}
                      slotProps={{ textField: { fullWidth: true, required: !!f.required } }}
                    />
                  ) : (
                    <TextField
                      label={f.label}
                      name={f.name}
                      value={fields[f.name]}
                      onChange={handleChange}
                      type={f.type || 'text'}
                      fullWidth
                      required={!!f.required}
                    />
                  )}
                </Grid>
              ))}
              {section === 'General Info' && docTextFields.map(f => (
                <Grid item xs={12} sm={6} md={4} key={f.text}>
                  <TextField
                    label={f.label + ' Description'}
                    name={f.text}
                    value={fields[f.text]}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained">{isEdit ? 'Update' : 'Submit'}</Button>
          <Button onClick={onCancel} variant="outlined">Cancel</Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddClientForm; 