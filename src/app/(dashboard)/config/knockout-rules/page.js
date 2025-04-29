'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  Tooltip,
  IconButton
} from '@mui/material';
import { Save, Info, RestartAlt } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function KnockoutRulesPage() {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRuleId, setCurrentRuleId] = useState(null);
  const [rules, setRules] = useState({
    simahScore: {
      value: 550,
      description: 'Applications below this SIMAH score will be automatically rejected'
    },
    activeDefaults: {
      value: 2,
      description: 'Applications with defaults equal or above this number will be rejected'
    },
    minimumBalance: {
      value: 5000,
      description: 'Minimum average bank balance required in the last 3 months'
    },
    monthlyIncome: {
      value: 3000,
      description: 'Minimum monthly income required for eligibility'
    },
    spendingRatio: {
      value: 0.85,
      description: 'Maximum allowed spending to income ratio'
    },
    minimumAge: {
      value: 21,
      description: 'Minimum age required for loan eligibility'
    }
  });

  useEffect(() => {
    fetchKnockoutRules();
  }, []);

  const fetchKnockoutRules = async () => {
    try {
      const response = await creditEngine.get('/knock-out-rules/');
      const existingRules = response.data.data?.[0];

      if (existingRules) {
        setCurrentRuleId(existingRules._id);
        setRules(prev => ({
          ...prev,
          simahScore: { ...prev.simahScore, value: existingRules.minimumSimahScore },
          activeDefaults: { ...prev.activeDefaults, value: existingRules.maximumActiveDefaults },
          minimumBalance: { ...prev.minimumBalance, value: existingRules.minimumAverageBalance },
          monthlyIncome: { ...prev.monthlyIncome, value: existingRules.minimumMonthlyIncome },
          spendingRatio: { ...prev.spendingRatio, value: existingRules.maximumSpendingToIncomeRatio },
          minimumAge: { ...prev.minimumAge, value: existingRules.minimumAge }
        }));
      }
    } catch (err) {
      console.error('Error fetching knockout rules:', err);
      setError('Failed to fetch knockout rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const formattedRules = {
        minimumSimahScore: Number(rules.simahScore.value),
        maximumActiveDefaults: Number(rules.activeDefaults.value),
        minimumAverageBalance: Number(rules.minimumBalance.value),
        minimumMonthlyIncome: Number(rules.monthlyIncome.value),
        maximumSpendingToIncomeRatio: Number(rules.spendingRatio.value),
        minimumAge: Number(rules.minimumAge.value)
      };

      if (currentRuleId) {
        await creditEngine.put(`/knock-out-rules/${currentRuleId}`, formattedRules);
      } else {
        const response = await creditEngine.post('/knock-out-rules/', formattedRules);
        setCurrentRuleId(response.data.data._id);
      }

      setShowSaveSuccess(true);
    } catch (err) {
      console.error('Error saving knockout rules:', err);
      setError('Failed to save knockout rules');
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

  return (
    <Box>
            {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#0A2647', fontWeight: 600 }}>
          Knock-out Rules Configuration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          
          <Button
            variant="contained"
            startIcon={<Save />}
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
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* <Alert severity="info" sx={{ mb: 4 }}>
        These rules define the minimum eligibility criteria. Applications failing any of these criteria will be automatically rejected without further scoring calculation.
      </Alert> */}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">SIMAH Score Threshold</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.simahScore.value}
                onChange={(e) => handleRuleChange('simahScore', e.target.value)}
                
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Maximum Active Defaults</Typography>

              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.activeDefaults.value}
                onChange={(e) => handleRuleChange('activeDefaults', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Minimum Average Balance</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.minimumBalance.value}
                onChange={(e) => handleRuleChange('minimumBalance', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Minimum Monthly Income</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.monthlyIncome.value}
                onChange={(e) => handleRuleChange('monthlyIncome', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Maximum Spending Ratio</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.spendingRatio.value}
                onChange={(e) => handleRuleChange('spendingRatio', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="#0A2647">Minimum Age</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={rules.minimumAge.value}
                onChange={(e) => handleRuleChange('minimumAge', e.target.value)}
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
          Knock-out rules updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}