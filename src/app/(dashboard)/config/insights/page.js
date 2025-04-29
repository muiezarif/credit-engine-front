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
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MenuItem
} from '@mui/material';
import { Save, Add, Edit, Delete, ThumbUp, ThumbDown, Warning } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    trigger: {
      field: '',
      operator: '',
      value: ''
    },
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await creditEngine.get('/insight-messages/');
      const existingInsights = response.data.data?.[0];

      if (existingInsights) {
        setCurrentId(existingInsights._id);
        setInsights({
          positive: existingInsights.positiveInsights || [],
          negative: existingInsights.negativeInsights || [],
          alerts: existingInsights.alertInsights || []
        });
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to fetch insight messages');
    } finally {
      setLoading(false);
    }
  };
  const [insights, setInsights] = useState({
    positive: [
    ],
    negative: [
    ],
    alerts: [
    ]
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      const formattedInsights = {
        positiveInsights: insights.positive,
        negativeInsights: insights.negative,
        alertInsights: insights.alerts
      };

      if (currentId) {
        await creditEngine.put(`/insight-messages/${currentId}`, formattedInsights);
      } else {
        const response = await creditEngine.post('/insight-messages/', formattedInsights);
        setCurrentId(response.data.data._id);
      }
      
      setShowSaveSuccess(true);
    } catch (err) {
      console.error('Error saving insights:', err);
      setError('Failed to save insight messages');
    } finally {
      setLoading(false);
    }
  };




  const handleDialogSave = () => {
    const newInsight = {
      id: editingInsight?.id || Date.now(),
      message: formData.message,
      trigger: formData.trigger
    };

    setInsights(prev => ({
      ...prev,
      [editingInsight.type]: editingInsight.id 
        ? prev[editingInsight.type].map(item => item.id === editingInsight.id ? newInsight : item)
        : [...prev[editingInsight.type], newInsight]
    }));

    setOpenDialog(false);
    handleSave();
  };

  // Update handleAddInsight
  const handleAddInsight = (type) => {
    setFormData({
      message: '',
      trigger: {
        field: '',
        operator: '',
        value: ''
      },
    });
    setEditingInsight({ type });
    setOpenDialog(true);
  };

  // Update handleEditInsight
  const handleEditInsight = (type, insight) => {
    const [field, operator, value] = insight.trigger.split(' ');
    setFormData({
      message: insight.message,
      trigger: {
        field,
        operator,
        value
      },
    });
    setEditingInsight({ ...insight, type });
    setOpenDialog(true);
  };

  const getTabIcon = (index) => {
    switch(index) {
      case 0: return <ThumbUp sx={{ color: '#4CAF50' }} />;
      case 1: return <ThumbDown sx={{ color: '#f44336' }} />;
      case 2: return <Warning sx={{ color: '#ff9800' }} />;
      default: return null;
    }
  };

  const renderInsightsList = (type) => (
    <List>
      {insights[type].map((insight) => (
        <Paper key={insight.id} sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#0A2647' }}>
                {insight.message}
              </Typography>
              <Chip 
                label={`Trigger: ${insight.trigger.field} ${insight.trigger.operator} ${insight.trigger.value}`}
                size="small"
                sx={{ mr: 1 }}
              />

            </Box>
            <Box>
              {/* <IconButton
                size="small"
                onClick={() => handleEditInsight(type, insight)}
                sx={{ color: '#2CD3E1' }}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: '#ff4444' }}
              >
                <Delete />
              </IconButton> */}
            </Box>
          </Box>
        </Paper>
      ))}
    </List>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#0A2647', fontWeight: 600 }}>
          Insights Messages Configuration
        </Typography>
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

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={getTabIcon(0)} label="Positive Insights" />
          <Tab icon={getTabIcon(1)} label="Negative Insights" />
          <Tab icon={getTabIcon(2)} label="Alert Insights" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {activeTab === 0 ? 'Positive' : activeTab === 1 ? 'Negative' : 'Alert'} Messages
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={() => handleAddInsight(activeTab === 0 ? 'positive' : activeTab === 1 ? 'negative' : 'alerts')}
          sx={{ color: '#2CD3E1' }}
        >
          Add Message
        </Button>
      </Box>

      {renderInsightsList(activeTab === 0 ? 'positive' : activeTab === 1 ? 'negative' : 'alerts')}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingInsight?.id ? 'Edit Insight Message' : 'Add New Insight Message'}
        </DialogTitle>
        <DialogContent>
      <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Message"
          multiline
          rows={3}
          fullWidth
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
        />
        <TextField
          select
          label="Field"
          fullWidth
          value={formData.trigger.field}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            trigger: { ...prev.trigger, field: e.target.value }
          }))}
        >
          {['simahScore', 'activeLoans', 'defaults', 'avgBankBalance', 'estimatedIncome', 'spendingRatio', 'age', 'dbrObligations'].map(op => (
            <MenuItem key={op} value={op}>{op}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Operator"
          fullWidth
          value={formData.trigger.operator}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            trigger: { ...prev.trigger, operator: e.target.value }
          }))}
        >
          {['>', '<', '>=', '<=', '==', '!=', 'exists', 'not_exists'].map(op => (
            <MenuItem key={op} value={op}>{op}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Value"
          fullWidth
          value={formData.trigger.value}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            trigger: { ...prev.trigger, value: e.target.value }
          }))}
          disabled={['exists', 'not_exists'].includes(formData.trigger.operator)}
        />
      </Box>
    </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDialogSave}
            sx={{
              bgcolor: '#2CD3E1',
              color: '#0A2647',
              '&:hover': {
                bgcolor: '#1ABED0'
              }
            }}
          >
            {editingInsight?.id ? 'Save Changes' : 'Add Message'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Insight messages updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}