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
  Grid,
  InputAdornment,
  Tooltip,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import { Save, Info, Security } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function FraudRulesPage() {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRuleId, setCurrentRuleId] = useState(null);
  const [rules, setRules] = useState({
    maxUnrelatedTransactions: {
      value: 5,
      description: 'Maximum number of unrelated incoming transactions allowed within a 30-day period'
    },
    maxSuddenDepositMultiple: {
      value: 3,
      description: 'Maximum allowed multiple of average deposits (e.g., 3x typical deposit amount)'
    },
    minAccountAge: {
      value: 90,
      description: 'Minimum account age required to reduce fraud risk'
    },
    maxNoExpensePeriod: {
      value: 45,
      description: 'Maximum number of days without any expense activity before flagging'
    },
    highBalanceThreshold: {
      value: 100000,
      description: 'Amount above which account requires activity justification'
    }
  });

  useEffect(() => {
    fetchFraudRules();
  }, []);

  const fetchFraudRules = async () => {
    try {
      const response = await creditEngine.get('/fraud-detection-rules/');
      const existingRules = response.data.data?.[0];

      if (existingRules) {
        setCurrentRuleId(existingRules._id);
        setRules({
          maxUnrelatedTransactions: {
            ...rules.maxUnrelatedTransactions,
            value: existingRules.maxUnrelatedIncomingTransactions
          },
          maxSuddenDepositMultiple: {
            ...rules.maxSuddenDepositMultiple,
            value: existingRules.maxSuddenDepositMultiple
          },
          minAccountAge: {
            ...rules.minAccountAge,
            value: existingRules.minimumAccountAge
          },
          maxNoExpensePeriod: {
            ...rules.maxNoExpensePeriod,
            value: existingRules.maxAllowedNoExpensePeriod
          },
          highBalanceThreshold: {
            ...rules.highBalanceThreshold,
            value: existingRules.highBalanceWithoutActivityThreshold
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching fraud rules:', err);
      setError('Failed to fetch fraud detection rules');
      setLoading(false);
    }
  };

  const handleRuleChange = (key, value) => {
    setRules(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formattedRules = {
        maxUnrelatedIncomingTransactions: Number(rules.maxUnrelatedTransactions.value),
        maxSuddenDepositMultiple: Number(rules.maxSuddenDepositMultiple.value),
        minimumAccountAge: Number(rules.minAccountAge.value),
        maxAllowedNoExpensePeriod: Number(rules.maxNoExpensePeriod.value),
        highBalanceWithoutActivityThreshold: Number(rules.highBalanceThreshold.value)
      };

      if (currentRuleId) {
        await creditEngine.put(`/fraud-detection-rules/${currentRuleId}`, formattedRules);
      } else {
        const response = await creditEngine.post('/fraud-detection-rules/', formattedRules);
        setCurrentRuleId(response.data.data._id);
      }
      
      setShowSaveSuccess(true);
    } catch (err) {
      console.error('Error saving fraud rules:', err);
      setError('Failed to save fraud detection rules');
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
          Fraud Detection Rules
        </Typography>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
          onClick={handleSave}
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


      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Security sx={{ fontSize: 40, color: '#2CD3E1' }} />
          <Typography variant="h5" sx={{ color: '#0A2647' }}>
            Fraud Detection Thresholds
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Unrelated Transactions Limit</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.maxUnrelatedTransactions.value}
                onChange={(e) => handleRuleChange('maxUnrelatedTransactions', Number(e.target.value))}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Sudden Deposit Multiple</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.maxSuddenDepositMultiple.value}
                onChange={(e) => handleRuleChange('maxSuddenDepositMultiple', Number(e.target.value))}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Minimum Account Age</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.minAccountAge.value}
                onChange={(e) => handleRuleChange('minAccountAge', Number(e.target.value))}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">No-Expense Period Limit</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.maxNoExpensePeriod.value}
                onChange={(e) => handleRuleChange('maxNoExpensePeriod', Number(e.target.value))}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">High Balance Alert Threshold</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.highBalanceThreshold.value}
                onChange={(e) => handleRuleChange('highBalanceThreshold', Number(e.target.value))}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Fraud detection rules updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}