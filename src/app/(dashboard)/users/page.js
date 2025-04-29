'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nationalId: '',
    fullName: '',
    simahScore: '',
    activeLoans: 0,
    defaults: 0,
    avgBankBalance: 0,
    estimatedIncome: 0,
    spendingRatio: 0,
    age: '',
    dbrObligations: 0
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      await creditEngine.get('/user/').then(response => {
        console.log(response.data.data);
        setUsers(response.data.data);
        setLoading(false);
      }).catch(err =>  {
        console.log(err);
        setError('Failed to fetch users');
        setLoading(false);
      });
     
      // setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    setFormData({
      nationalId: '',
      fullName: '',
      simahScore: '',
      activeLoans: 0,
      defaults: 0,
      avgBankBalance: 0,
      estimatedIncome: 0,
      spendingRatio: 0,
      age: '',
      dbrObligations: 0
    });
    setEditingUser(null);
    setOpen(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      nationalId: user.nationalId,
      fullName: user.fullName,
      simahScore: user.simahScore,
      activeLoans: user.activeLoans,
      defaults: user.defaults,
      avgBankBalance: user.avgBankBalance,
      estimatedIncome: user.estimatedIncome,
      spendingRatio: user.spendingRatio,
      age: user.age,
      dbrObligations: user.dbrObligations
    });
    setEditingUser(user);
    setOpen(true);
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      if (editingUser) {
        await creditEngine.put(`/user/${editingUser._id}`, formData);
      } else {
        await creditEngine.post('/user/', formData);
      }
      fetchUsers();
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError(editingUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await creditEngine.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#0A2647', fontWeight: 600 }}>
          Mock Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleAddUser}
          sx={{
            bgcolor: '#2CD3E1',
            color: '#0A2647',
            '&:hover': {
              bgcolor: '#1ABED0'
            }
          }}
        >
          Add Mock User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8F9FA' }}>
              <TableCell>National ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>SIMAH Score</TableCell>
              <TableCell>Active Loans</TableCell>
              <TableCell>Defaults</TableCell>
              <TableCell>Avg Bank Balance</TableCell>
              <TableCell>Est. Income</TableCell>
              <TableCell>Spending Ratio</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>DBR</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.nationalId}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>
                  <Chip
                    label={user.simahScore}
                    color={user.simahScore >= 700 ? 'success' : user.simahScore >= 600 ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.activeLoans}</TableCell>
                <TableCell>
                  <Chip
                    label={user.defaults}
                    color={user.defaults === 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>SAR{user.avgBankBalance.toLocaleString()}</TableCell>
                <TableCell>SAR{user.estimatedIncome.toLocaleString()}</TableCell>
                <TableCell>{(user.spendingRatio).toFixed(0)}%</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>
                  <Chip
                    label={`${(user.dbrObligations).toFixed(0)}%`}
                    color={user.dbrObligations <= 50 ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                      sx={{ color: '#2CD3E1' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteUser(user.id)}
                      sx={{ color: '#ff4444' }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit Mock User' : 'Add New Mock User'}
        </DialogTitle>
        <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              name="nationalId"
              label="National ID"
              fullWidth
              value={formData.nationalId}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="fullName"
              label="Full Name"
              fullWidth
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="simahScore"
              label="SIMAH Score"
              type="number"
              fullWidth
              value={formData.simahScore}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="activeLoans"
              label="Active Loans"
              type="number"
              fullWidth
              value={formData.activeLoans}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="defaults"
              label="Defaults"
              type="number"
              fullWidth
              value={formData.defaults}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="avgBankBalance"
              label="Average Bank Balance"
              type="number"
              fullWidth
              value={formData.avgBankBalance}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="estimatedIncome"
              label="Estimated Income"
              type="number"
              fullWidth
              value={formData.estimatedIncome}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="spendingRatio"
              label="Spending Ratio"
              type="number"
              fullWidth
              value={formData.spendingRatio}
              inputProps={{ step: 0.01, min: 0, max: 1 }}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="age"
              label="Age"
              type="number"
              fullWidth
              value={formData.age}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="dbrObligations"
              label="DBR Obligations"
              type="number"
              fullWidth
              value={formData.dbrObligations}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: '#2CD3E1',
              color: '#0A2647',
              '&:hover': {
                bgcolor: '#1ABED0'
              }
            }}
          >
            {editingUser ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
        {/* Add error snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>

        {/* Add loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Dialog>
    </Box>
  );
}