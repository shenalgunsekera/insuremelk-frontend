import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClientTable = ({ clients, onEdit, onDelete }) => (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>NIC Document</TableCell>
          <TableCell>Policy Document</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.name}</TableCell>
            <TableCell>
              <Link
                href={client.document_url}
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                View
              </Link>
            </TableCell>
            <TableCell>
              <Link
                href={client.policy_url}
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                View
              </Link>
            </TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(client)}><EditIcon /></IconButton>
              <IconButton onClick={() => onDelete(client.id)} color="error"><DeleteIcon /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ClientTable; 