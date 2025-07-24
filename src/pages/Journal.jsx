import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, Paper, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addSpending, getCategories, addCategory } from '../utils/storage';
import { getSpendings } from '../utils/storage';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { TablePagination } from '@mui/material';



const Journal = () => {
  const [date, setDate] = useState(dayjs());
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  useEffect(() => {
    setCategories(getCategories());
    setEntries(getSpendings());

  }, []);
  const handleSubmit = () => {
    if (!category || !amount) return;
    addSpending({ date: date.format('YYYY-MM-DD'), category, amount: parseFloat(amount) });
    setAmount('');
    setEntries(getSpendings());
  };
  const handleAddCategory = () => {
    if (!newCategory) return;
    addCategory(newCategory);
    setCategories(getCategories());
    setNewCategory('');
  };
  const handleChangePage = (event, newPage) => {
  setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };
  

  return (
    <Box sx={{minHeight: '100vh',bgcolor: '#e3f1d0',display: 'flex',flexDirection: 'row',justifyContent: 'center'}}>
      <Box sx={{minHeight: '100vh',bgcolor: '#e3f1d0',display: 'flex',flexDirection: 'column',alignItems: 'center',py: 5,px: 2,}}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 600, p: 4 }}>Spending Journal</Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 4,bgcolor: '#f1f8e9', width:640}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              sx={{ mb: 2, width: '100%' }}
            />
          </LocalizationProvider>

          <TextField
            select
            label="Category"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mb: 2, textOverflow:'ellipsis', overflow: 'hidden'}}
            
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button fullWidth variant="contained" onClick={handleSubmit}sx={{bgcolor:'#559c04ff'}}>Save Entry</Button>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, width:640,bgcolor: '#f1f8e9' }}>
          <Typography variant="h6" gutterBottom>Add New Category</Typography>
          <TextField
            fullWidth
            label="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button fullWidth variant="outlined" onClick={handleAddCategory} 
          sx={{
          borderColor: '#4caf50',  
          color: '#4caf50', 
          '&:hover': {borderColor: '#388e3c',
          backgroundColor: '#e8f5e9',}}}>Add</Button>
        </Paper>
      </Box>
        <Paper elevation={2} sx={{ p: 3, mt: 19.8, mb: 39, width: 640, bgcolor: '#f1f8e9' }}>
          <Typography variant="h6" gutterBottom>Spending Entries</Typography>
          {entries.length === 0 ? (
            <Typography>No entries yet.</Typography>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Amount ($)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell align="right">{entry.amount.toFixed(2)}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={entries.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10]}
              />
            </>
          )}
        </Paper>
      </Box>
  );
};

export default Journal;
