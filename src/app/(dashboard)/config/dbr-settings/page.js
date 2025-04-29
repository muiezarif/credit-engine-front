'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Snackbar,
  InputAdornment,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { Save, Info, History } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function DBRSettingsPage() {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [dbrValue, setDbrValue] = useState(65);
  const [previousValue, setPreviousValue] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSettingId, setCurrentSettingId] = useState(null);

  useEffect(() => {
    fetchDBRSettings();
  }, []);

  const fetchDBRSettings = async () => {
    try {
      const response = await creditEngine.get('/dbr-settings/');
      const settings = response.data.data?.[0];
      
      if (settings) {
        setCurrentSettingId(settings._id);
        setDbrValue(settings.maximumDBRPercentage);
        setPreviousValue(settings.maximumDBRPercentage);
      }
    } catch (err) {
      console.error('Error fetching DBR settings:', err);
      setError('Failed to fetch DBR settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formattedSettings = {
        maximumDBRPercentage: Number(dbrValue)
      };

      if (currentSettingId) {
        await creditEngine.put(`/dbr-settings/${currentSettingId}`, formattedSettings);
      } else {
        const response = await creditEngine.post('/dbr-settings/', formattedSettings);
        setCurrentSettingId(response.data.data._id);
      }

      setPreviousValue(dbrValue);
      setShowSaveSuccess(true);
    } catch (err) {
      console.error('Error saving DBR settings:', err);
      setError('Failed to save DBR settings');
    } finally {
      setLoading(false);
    }
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
          DBR Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
          onClick={handleSave}
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
      </Box>


      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h6" color="#0A2647">
              Maximum DBR Threshold
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            type="number"
            value={dbrValue}
            onChange={(e) => setDbrValue(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          
        </Box>

        {/* <Alert severity="warning" sx={{ mt: 3 }}>
          Applications exceeding this DBR threshold will be automatically flagged for review or rejection.
        </Alert> */}
      </Paper>

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          DBR threshold updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}