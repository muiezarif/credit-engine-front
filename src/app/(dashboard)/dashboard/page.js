'use client';
import { useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Rating
} from '@mui/material';
import { 
  Search, 
  CheckCircle, 
  Warning, 
  Error,
  ThumbUp,
  ThumbDown,
  NotificationImportant
} from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function DashboardPage() {
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);


  const handleCreditCheck = async() => {
    setLoading(true);
    // Simulate API call
    await creditEngine.get(`/evaluation-flow/evaluate/${nationalId}`).then((response) => {
      console.log(response.data);
      if(response.data.result.knockoutResult.details.length > 0){
        setResult(null);
        setError(response.data.result.knockoutResult.details[0]);
        setLoading(false);
        return;
      }
      setResult(response.data.result);
      setLoading(false);

    }).then((err) => {
      setLoading(false);

      console.log(err);
    })
  };

  const getRatingColor = (rating) => {
    const colors = {
      'A': '#4CAF50',
      'B': '#8BC34A',
      'C': '#FFC107',
      'D': '#FF9800',
      'E': '#F44336'
    };
    return colors[rating] || '#757575';
  };

  const riskRatingTexts = {
    'A': 'Excellent',
    'B': 'Great',
    'C': 'Good',
    'D': 'Neutral',
    'E': 'Bad'
  };



  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}- Knockout rule</Alert>}
      <Typography variant="h4" sx={{ mb: 4, color: '#0A2647', fontWeight: 600 }}>
        Credit Risk Engine
      </Typography>

      {/* Search Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Enter National ID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              variant="outlined"
              placeholder="e.g., 1234567890"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCreditCheck}
              disabled={loading || !nationalId}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{
                bgcolor: '#2CD3E1',
                color: '#0A2647',
                height: '56px',
                '&:hover': {
                  bgcolor: '#1ABED0'
                }
              }}
            >
              {loading ? 'Processing...' : 'Run Credit Check'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {result && (
        <Grid container spacing={3}>
          {/* Score Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Risk Score
              </Typography>
              <Typography variant="h2" sx={{ color: '#0A2647', fontWeight: 700 }}>
                {result?.scoreResult.rawScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of 120 points
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Normalized Score
              </Typography>
              <Typography variant="h2" sx={{ color: '#0A2647', fontWeight: 700 }}>
                {result?.scoreResult.normalizedScore.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of 100 points
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Risk Rating
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: getRatingColor(result.riskRating)
                }}
              >
                {result.riskRating}
              </Typography>
              {riskRatingTexts[result.riskRating] || 'Unknown'}
            </Paper>
          </Grid>

          {/* Loan Suggestion */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0A2647' }}>
                Loan Offer
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Recommended Amount
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" sx={{ color: '#0A2647', fontWeight: 700 }}>
                  Range: SAR{result.loanOffer.minimum.toLocaleString()} - SAR{result.loanOffer.maximum.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* DBR Check */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0A2647' }}>
                DBR Check Result
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={result.dbrResult.passed?"Pass":"Fail"}
                  color={result.dbrResult.passed ? 'success' : 'error'}
                  sx={{ px: 2 }}
                />
                <Typography variant="body1">
                  Current DBR: {result.dbrResult.details.calculatedDBR}%
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Insights */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#0A2647' }}>
                Dynamic Insights
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ThumbUp sx={{ color: 'success.main' }} />
                      <Typography variant="h6" color="success.main">
                        Positive Factors
                      </Typography>
                    </Box>
                    {result.insightsResult?.positiveInsights?.map((insight, index) => (
                      <Alert key={index} severity="success" sx={{ mb: 1 }}>
                        {insight}
                      </Alert>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ThumbDown sx={{ color: 'error.main' }} />
                      <Typography variant="h6" color="error.main">
                        Negative Factors
                      </Typography>
                    </Box>
                    {result.insightsResult?.negativeInsights?.map((insight, index) => (
                      <Alert key={index} severity="error" sx={{ mb: 1 }}>
                        {insight}
                      </Alert>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <NotificationImportant sx={{ color: 'warning.main' }} />
                      <Typography variant="h6" color="warning.main">
                        Alerts
                      </Typography>
                    </Box>
                    {result?.insightsResult?.alertInsights?.map((insight, index) => (
                      <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                        {insight}
                      </Alert>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}