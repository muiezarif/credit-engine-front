'use client';
import { useState,useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Save } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function ScoringRulesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoringRules, setScoringRules] = useState(null);
  const [currentRuleId, setCurrentRuleId] = useState(null);
// Update the initial formData state
const [formData, setFormData] = useState({
  id: null,
  min: '',
  max: '',
  value: '',
  points: '',
});

// Fetch scoring rules on component mount
useEffect(() => {
  fetchScoringRules();
}, []);

// Update fetchScoringRules to match the backend schema
const fetchScoringRules = async () => {
  try {
    const response = await creditEngine.get('/scoring-rules/');
    const rules = response.data.data?.[0];

    if (!rules) {
      setScoringRules({
        simahScore: [],
        activeLoans: [],
        defaults: [],
        bankBalance: [],
        monthlyIncome: [],
        spendingRatio: []
      });
      setCurrentRuleId(null);
    } else {
      setCurrentRuleId(rules._id);
      setScoringRules({
        simahScore: rules.simahScore.map(rule => ({
          id: rule._id || Date.now(),
          min: rule.min,
          max: rule.max,
          points: rule.points
        })),
        activeLoans: rules.activeLoans.map(rule => ({
          id: rule._id || Date.now(),
          value: rule.count,
          points: rule.points
        })),
        defaults: rules.defaults.map(rule => ({
          id: rule._id || Date.now(),
          value: rule.count,
          points: rule.points
        })),
        bankBalance: rules.avgBankBalance.map(rule => ({
          id: rule._id || Date.now(),
          min: rule.min,
          max: rule.max,
          points: rule.points
        })),
        monthlyIncome: rules.estimatedMonthlyIncome.map(rule => ({
          id: rule._id || Date.now(),
          min: rule.min,
          max: rule.max,
          points: rule.points
        })),
        spendingRatio: rules.spendingToIncomeRatio.map(rule => ({
          id: rule._id || Date.now(),
          value:rule.count,
          points: rule.points
        }))
      });
    }
    setLoading(false);
  } catch (err) {
    console.error('Error fetching scoring rules:', err);
    setError('Failed to fetch scoring rules');
    setLoading(false);
  }
};

const handleSaveChanges = async () => {
  try {
    if (!scoringRules) {
      setError('No scoring rules to save');
      return;
    }

    const formattedRules = {
      simahScore: scoringRules.simahScore.map(({ min, max, points }) => ({
        min, max, points
      })),
      activeLoans: scoringRules.activeLoans.map(({ value, points }) => ({
        count: value,
        points
      })),
      defaults: scoringRules.defaults.map(({ value, points }) => ({
        count: value,
        points
      })),
      avgBankBalance: scoringRules.bankBalance.map(({ min, max, points }) => ({
        min, max, points
      })),
      estimatedMonthlyIncome: scoringRules.monthlyIncome.map(({ min, max, points }) => ({
        min, max, points
      })),
      spendingToIncomeRatio: scoringRules.spendingRatio.map(({ value, points }) => ({
        count: value,
        points
      }))
    };

    setLoading(true);
    if (currentRuleId) {
      await creditEngine.put(`/scoring-rules/${currentRuleId}`, formattedRules);
    } else {
      await creditEngine.post('/scoring-rules/', formattedRules);
    }
    
    setShowSaveSuccess(true);
    await fetchScoringRules();
  } catch (err) {
    console.error('Error saving scoring rules:', err);
    setError('Failed to save scoring rules');
  } finally {
    setLoading(false);
  }
};

const handleAddRule = (categoryKey) => {
  const newRule = {
    id: Date.now(), // Temporary ID for frontend use
    points: 0,
  };

  // For range-based rules (simahScore, avgBankBalance, estimatedMonthlyIncome)
  if (['simahScore', 'bankBalance', 'monthlyIncome'].includes(categoryKey)) {
    newRule.min = 0;
    newRule.max = 0;
  } else {
    // For count-based rules (activeLoans, defaults)
    newRule.count = 0;
  }

  setFormData(newRule);
  setEditingRule(null);
  setOpenDialog(true);
};

const handleSaveRule = (categoryKey, rule) => {
  const formattedRule = ['simahScore', 'bankBalance', 'monthlyIncome'].includes(categoryKey)
    ? {
        id: rule.id || Date.now(),
        min: Number(rule.min),
        max: Number(rule.max),
        points: Number(rule.points)
      }
    : {
        id: rule.id || Date.now(),
        value: Number(rule.value),
        points: Number(rule.points)
      };

  setScoringRules(prev => ({
    ...prev,
    [categoryKey]: editingRule ? 
      prev[categoryKey].map(r => r.id === editingRule.id ? formattedRule : r) :
      [...prev[categoryKey], formattedRule]
  }));
  setOpenDialog(false);
};

const handleDeleteRule = async (categoryKey, ruleId) => {
  try {
    setScoringRules(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter(rule => rule.id !== ruleId)
    }));
  } catch (err) {
    setError('Failed to delete rule');
  }
};

  const categories = [
    { key: 'simahScore', label: 'SIMAH Score' },
    { key: 'activeLoans', label: 'Active Loans' },
    { key: 'defaults', label: 'Defaults' },
    { key: 'bankBalance', label: 'Bank Balance' },
    { key: 'monthlyIncome', label: 'Monthly Income' },
    { key: 'spendingRatio', label: 'Spending Ratio' }
  ];


  const handleEditRule = (rule) => {
    const isRangeType = rule.hasOwnProperty('min');
    setFormData({
      id: rule.id,
      min: isRangeType ? rule.min : 0,
      max: isRangeType ? rule.max : 0,
      value: isRangeType ? 0 : rule.value,
      points: rule.points
    });
    setEditingRule(rule);
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderRuleTable = (categoryKey) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (!scoringRules || !scoringRules[categoryKey]) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No rules available for this category
          </Typography>
        </Paper>
      );
    }
  
    const rules = scoringRules[categoryKey];
    const isRangeType = ['simahScore', 'bankBalance', 'monthlyIncome'].includes(categoryKey);

    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8F9FA' }}>
              {isRangeType ? (
                <>
                  <TableCell>Min Range</TableCell>
                  <TableCell>Max Range</TableCell>
                </>
              ) : (
                <TableCell>Value</TableCell>
              )}
              <TableCell>Points</TableCell>
              <TableCell width={120}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} hover>
                {isRangeType ? (
                  <>
                    <TableCell>{rule.min?.toLocaleString()}</TableCell>
                    <TableCell>{rule.max?.toLocaleString() || 'Above'}</TableCell>
                  </>
                ) : (
                  <TableCell>{rule.value?.toString()}</TableCell>
                )}
                <TableCell>
                  <Typography
                    sx={{
                      color: rule.points >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 500
                    }}
                  >
                    {rule.points > 0 ? `+${rule.points}` : rule.points}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditRule(rule)}
                    sx={{ color: '#2CD3E1' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: '#ff4444' }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#0A2647', fontWeight: 600 }}>
          Scoring Rules Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveChanges}
          disabled={loading || !scoringRules}
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

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 120
            }
          }}
        >
          {categories.map((category, index) => (
            <Tab key={category.key} label={category.label} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#0A2647' }}>
          {categories[activeTab].label} Rules
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={handleAddRule}
          sx={{ color: '#2CD3E1' }}
        >
          Add Rule
        </Button>
      </Box>

      {renderRuleTable(categories[activeTab].key)}

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Scoring rules updated successfully
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRule ? 'Edit Scoring Rule' : 'Add New Scoring Rule'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['simahScore', 'bankBalance', 'monthlyIncome'].includes(categories[activeTab].key) ? (
              <>
                <TextField name="min"
                label="Minimum Value"
                type="number"
                value={formData.min}
                onChange={handleInputChange}
                fullWidth />
                <TextField name="max"
                label="Maximum Value"
                type="number"
                value={formData.max}
                onChange={handleInputChange}
                fullWidth />
              </>
            ) : (
              <TextField name="value"
              label="Value"
              type="number"
              value={formData.value}
              onChange={handleInputChange}
              fullWidth />
            )}
            <TextField name="points"
            label="Points"
            type="number"
            value={formData.points}
            onChange={handleInputChange}
            fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleSaveRule(categories[activeTab].key, formData)}
            sx={{
              bgcolor: '#2CD3E1',
              color: '#0A2647',
              '&:hover': {
                bgcolor: '#1ABED0'
              }
            }}
          >
            {editingRule ? 'Save Changes' : 'Add Rule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}