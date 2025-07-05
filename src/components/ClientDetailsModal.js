import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Grid, Link, Divider, Button, Card, CardContent, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PolicyIcon from '@mui/icons-material/Description';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FolderIcon from '@mui/icons-material/Folder';

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

const textFields = [
  { label: 'Ceilao IB File No.', name: 'ceilao_ib_file_no', section: 'General Info' },
  { label: 'Vehicle Number', name: 'vehicle_number', section: 'General Info' },
  { label: 'Main Class', name: 'main_class', section: 'General Info' },
  { label: 'Insurer', name: 'insurer', section: 'General Info' },
  { label: 'Introducer Code', name: 'introducer_code', section: 'General Info' },
  { label: 'Customer Type', name: 'customer_type', section: 'General Info' },
  { label: 'Product', name: 'product', section: 'General Info' },
  { label: 'Policy', name: 'policy_', section: 'General Info' },
  { label: 'Insurance Provider', name: 'insurance_provider', section: 'General Info' },
  { label: 'Branch', name: 'branch', section: 'General Info' },
  { label: 'Client Name', name: 'client_name', section: 'General Info' },
  { label: 'Street 1', name: 'street1', section: 'Address' },
  { label: 'Street 2', name: 'street2', section: 'Address' },
  { label: 'City', name: 'city', section: 'Address' },
  { label: 'District', name: 'district', section: 'Address' },
  { label: 'Province', name: 'province', section: 'Address' },
  { label: 'Telephone', name: 'telephone', section: 'Contact' },
  { label: 'Mobile No', name: 'mobile_no', section: 'Contact' },
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
  { label: 'Policy Period From', name: 'policy_period_from', section: 'Policy Details' },
  { label: 'Policy Period To', name: 'policy_period_to', section: 'Policy Details' },
  { label: 'Coverage', name: 'coverage', section: 'Policy Details' },
  { label: 'Sum Insured', name: 'sum_insured', section: 'Financials' },
  { label: 'Basic Premium', name: 'basic_premium', section: 'Financials' },
  { label: 'SRCC Premium', name: 'srcc_premium', section: 'Financials' },
  { label: 'TC Premium', name: 'tc_premium', section: 'Financials' },
  { label: 'Net Premium', name: 'net_premium', section: 'Financials' },
  { label: 'Stamp Duty', name: 'stamp_duty', section: 'Financials' },
  { label: 'Admin Fees', name: 'admin_fees', section: 'Financials' },
  { label: 'Road Safety Fee', name: 'road_safety_fee', section: 'Financials' },
  { label: 'Policy Fee', name: 'policy_fee', section: 'Financials' },
  { label: 'VAT Fee', name: 'vat_fee', section: 'Financials' },
  { label: 'Total Invoice', name: 'total_invoice', section: 'Financials' },
  { label: 'Commission Type', name: 'commission_type', section: 'Commission' },
  { label: 'Commission Basic', name: 'commission_basic', section: 'Commission' },
  { label: 'Commission SRCC', name: 'commission_srcc', section: 'Commission' },
  { label: 'Commission TC', name: 'commission_tc', section: 'Commission' },
  { label: 'Sales Rep ID', name: 'sales_rep_id', section: 'Other' },
  { label: 'Policies', name: 'policies', section: 'Other' },
];

const sectionIcons = {
  'General Info': <InfoIcon color="primary" sx={{ mr: 1 }} />,
  'Address': <HomeIcon color="primary" sx={{ mr: 1 }} />,
  'Contact': <ContactPhoneIcon color="primary" sx={{ mr: 1 }} />,
  'Policy Details': <PolicyIcon color="primary" sx={{ mr: 1 }} />,
  'Financials': <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />,
  'Commission': <AssignmentIndIcon color="primary" sx={{ mr: 1 }} />,
  'Documents': <FolderIcon color="primary" sx={{ mr: 1 }} />,
  'Proofs': <FolderIcon color="primary" sx={{ mr: 1 }} />,
  'Other': <InfoIcon color="primary" sx={{ mr: 1 }} />,
};

const sectionOrder = [
  'General Info', 'Address', 'Contact', 'Policy Details', 'Financials', 'Commission', 'Proofs', 'Other'
];

const ClientDetailsModal = ({ client, onClose }) => {
  if (!client) return null;
  return (
    <Dialog open={!!client} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Client Details</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ p: 2 }}>
          {sectionOrder.map(section => (
            <Card key={section} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {sectionIcons[section]}
                  <Typography variant="h6">{section}</Typography>
                </Box>
                <Grid container spacing={2}>
                  {textFields.filter(f => f.section === section).map(f => (
                    <Grid item xs={12} sm={6} md={4} key={f.name}>
                      <Typography variant="subtitle2">{f.label}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>{client[f.name] || '-'}</Typography>
                    </Grid>
                  ))}
                  {/* For doc+text fields, show in Documents section */}
                  {section === 'Documents' && docTextFields.map(f => (
                    <React.Fragment key={f.doc}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2">{f.label} Document</Typography>
                        {client[f.doc] ? (
                          <Link href={client[f.doc]} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                            View Document
                          </Link>
                        ) : (
                          <Typography variant="body2">-</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2">{f.label} Description</Typography>
                        <Typography variant="body2">{client[f.text] || '-'}</Typography>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
          {/* Documents section as a card at the end */}
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {sectionIcons['Documents']}
                <Typography variant="h6">Documents</Typography>
              </Box>
              <Grid container spacing={2}>
                {docTextFields.map(f => (
                  <React.Fragment key={f.doc}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2">{f.label} Document</Typography>
                      {client[f.doc] ? (
                        <Link href={client[f.doc]} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                          View Document
                        </Link>
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2">{f.label} Description</Typography>
                      <Typography variant="body2">{client[f.text] || '-'}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} variant="outlined">Close</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal; 