'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';
export default function RiskThresholdsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentThresholdId, setCurrentThresholdId] = useState(null);
  const [formData, setFormData] = useState({
    minScore: '',
    maxScore: '',
    description: '',
    recommendation: ''
  });

  const [thresholds, setThresholds] = useState([]);
  // Add new state for add dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newThreshold, setNewThreshold] = useState({
    rating: '',
    minScore: '',
    maxScore: ''
  });

  useEffect(() => {
    fetchThresholds();
  }, []);

  const fetchThresholds = async () => {
    try {
      const response = await creditEngine.get('/risk-rating-threshholds/');
      const existingThresholds = response.data.data?.[0];

      if (existingThresholds) {
        setCurrentThresholdId(existingThresholds._id);
        setThresholds(existingThresholds.ratingRanges.map(range => ({
          ...range,
        })));
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching thresholds:', err);
      setError('Failed to fetch risk rating thresholds');
      setLoading(false);
    }
  };

  // Add handleAddThreshold function
  const handleAddThreshold = () => {
    setNewThreshold({
      rating: '',
      minScore: '',
      maxScore: ''
    });
    setOpenAddDialog(true);
  };

  // Add handleAddDialogSave function
  const handleAddDialogSave = () => {
    const newItem = {
      ...newThreshold,
    };
    setThresholds([...thresholds, newItem]);
    setOpenAddDialog(false);
    handleSaveChanges([...thresholds, newItem]);
  };

  // Add handleNewThresholdChange function
  const handleNewThresholdChange = (e) => {
    const { name, value } = e.target;
    setNewThreshold(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditThreshold = (threshold) => {
    setFormData({
      minScore: threshold.minScore,
      maxScore: threshold.maxScore,
      description: threshold.description,
      recommendation: threshold.recommendation
    });
    setEditingThreshold(threshold);
    setOpenDialog(true);
  };

  const handleSaveDialog = async () => {
    const updatedThresholds = thresholds.map(t =>
      t.rating === editingThreshold.rating
        ? { ...t, minScore: Number(formData.minScore), maxScore: Number(formData.maxScore) }
        : t
    );
    setThresholds(updatedThresholds);
    setOpenDialog(false);
    await handleSaveChanges(updatedThresholds);
  };

  const handleSaveChanges = async (updatedThresholds = thresholds) => {
    try {
      const formattedThresholds = {
        ratingRanges: updatedThresholds.map(({ rating, minScore, maxScore }) => ({
          rating,
          minScore: Number(minScore),
          maxScore: Number(maxScore)
        }))
      };

      setLoading(true);
      if (currentThresholdId) {
        await creditEngine.put(`/risk-rating-threshholds/${currentThresholdId}`, formattedThresholds);
      } else {
        const response = await creditEngine.post('/risk-rating-threshholds/', formattedThresholds);
        setCurrentThresholdId(response.data.data._id);
      }

      setShowSaveSuccess(true);
    } catch (err) {
      console.error('Error saving thresholds:', err);
      setError('Failed to save risk rating thresholds');
    } finally {
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

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#0A2647', fontWeight: 600 }}>
          Risk Rating Thresholds
        </Typography>

        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleAddThreshold}
          sx={{
            bgcolor: '#2CD3E1',
            color: '#0A2647',
            '&:hover': {
              bgcolor: '#1ABED0'
            }
          }}
        >
          Add
        </Button>
        {/* <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveChanges}
          sx={{
            bgcolor: '#2CD3E1',
            color: '#0A2647',
            '&:hover': {
              bgcolor: '#1ABED0'
            }
          }}
        >
          Save Changes
        </Button> */}
      </Box>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8F9FA' }}>
              <TableCell>Risk Rating</TableCell>
              <TableCell>Score Range</TableCell>
              <TableCell width={100}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {thresholds.map((threshold) => (
              <TableRow key={threshold.id} hover>
                <TableCell>
                  <Chip
                    label={threshold.rating}
                    sx={{
                      bgcolor: threshold.color,
                      color: 'white',
                      fontWeight: 'bold',
                      width: '32px',
                      height: '32px'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {threshold.minScore} - {threshold.maxScore}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditThreshold(threshold)}
                    sx={{ color: '#2CD3E1' }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Risk Rating Threshold
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="minScore"
                label="Minimum Score"
                type="number"
                fullWidth
                value={formData.minScore}
                onChange={handleInputChange}
              />
              <TextField
                name="maxScore"
                label="Maximum Score"
                type="number"
                fullWidth
                value={formData.maxScore}
                onChange={handleInputChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveDialog}
            disabled={loading}
            sx={{
              bgcolor: '#2CD3E1',
              color: '#0A2647',
              '&:hover': {
                bgcolor: '#1ABED0'
              }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Risk Rating Threshold
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              name="rating"
              label="Risk Rating"
              fullWidth
              value={newThreshold.rating}
              onChange={handleNewThresholdChange}
              SelectProps={{
                native: true
              }}
            >
              <option value="">Select Rating</option>
              {['A', 'B', 'C', 'D', 'E'].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="minScore"
                label="Minimum Score"
                type="number"
                fullWidth
                value={newThreshold.minScore}
                onChange={handleNewThresholdChange}
              />
              <TextField
                name="maxScore"
                label="Maximum Score"
                type="number"
                fullWidth
                value={newThreshold.maxScore}
                onChange={handleNewThresholdChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddDialogSave}
            disabled={!newThreshold.rating || loading}
            sx={{
              bgcolor: '#2CD3E1',
              color: '#0A2647',
              '&:hover': {
                bgcolor: '#1ABED0'
              }
            }}
          >
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Risk rating thresholds updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}