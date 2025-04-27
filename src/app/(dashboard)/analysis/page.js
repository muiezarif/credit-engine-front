'use client';
import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import { Search, CheckCircle, Cancel, AccountBalance, CreditScore, WorkHistory } from '@mui/icons-material';
import { userDatabase } from '@/data/userDatabase';

export default function CreditAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [applicantData, setApplicantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSearch = () => {
    setLoading(true);
    setError('');
    setApplicantData(null);
    setAnalysisResult(null);

    // Simulate API call
    setTimeout(() => {
      const applicant = userDatabase.find(user => 
        user.email === searchQuery || 
        user.govId === searchQuery ||
        user.id === searchQuery
      );

      if (applicant) {
        setApplicantData(applicant);
        analyzeCreditworthiness(applicant);
      } else {
        setError('No applicant found with the provided details.');
      }
      setLoading(false);
    }, 1500);
  };

  const analyzeCreditworthiness = (applicant) => {
    const factors = {
      creditScore: {
        score: applicant.creditScore >= 700 ? 1 : applicant.creditScore >= 650 ? 0.5 : 0,
        weight: 0.3,
        message: applicant.creditScore >= 700 
          ? "Excellent credit score"
          : applicant.creditScore >= 650 
          ? "Fair credit score, but acceptable"
          : "Credit score below minimum requirement"
      },
      incomeToLoan: {
        score: applicant.monthlyIncome >= 50000 ? 1 : applicant.monthlyIncome >= 30000 ? 0.5 : 0,
        weight: 0.25,
        message: applicant.monthlyIncome >= 50000
          ? "Strong monthly income"
          : applicant.monthlyIncome >= 30000
          ? "Moderate income level"
          : "Income below required threshold"
      },
      employmentStability: {
        score: applicant.employmentDuration >= 24 ? 1 : applicant.employmentDuration >= 12 ? 0.5 : 0,
        weight: 0.2,
        message: applicant.employmentDuration >= 24
          ? "Stable employment history"
          : applicant.employmentDuration >= 12
          ? "Moderate employment duration"
          : "Insufficient employment history"
      },
      bankBalance: {
        score: applicant.bankBalance >= 100000 ? 1 : applicant.bankBalance >= 50000 ? 0.5 : 0,
        weight: 0.15,
        message: applicant.bankBalance >= 100000
          ? "Strong bank balance"
          : applicant.bankBalance >= 50000
          ? "Adequate bank balance"
          : "Low bank balance"
      },
      paymentHistory: {
        score: applicant.existingLoans.every(loan => loan.paymentHistory === "Regular") ? 1 : 0,
        weight: 0.1,
        message: applicant.existingLoans.every(loan => loan.paymentHistory === "Regular")
          ? "Good payment history"
          : "Irregular payment history detected"
      }
    };
  
    const totalScore = Object.values(factors).reduce(
      (acc, factor) => acc + (factor.score * factor.weight), 0
    );
  
    setAnalysisResult({
      score: totalScore,
      eligible: totalScore >= 0.7,
      factors,
      summary: totalScore >= 0.7
        ? "Application Approved: Strong financial profile with good credit history."
        : "Application Declined: Does not meet minimum eligibility criteria."
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#0A2647', fontWeight: 600 }}>
        Credit Analysis
      </Typography>

      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Enter Applicant Email, Government ID, or User ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading || !searchQuery}
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
              {loading ? 'Searching...' : 'Check Eligibility'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {applicantData && (
        <Grid container spacing={3}>
          {/* Applicant Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#0A2647' }}>
                Applicant Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {applicantData.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Credit Score</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {applicantData.creditScore}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Monthly Income</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    SAR{applicantData.monthlyIncome.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Bank Balance</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    SAR{applicantData.bankBalance.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Analysis Result */}
          {analysisResult && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#0A2647' }}>
                    Analysis Result
                  </Typography>
                  <Chip
                    icon={analysisResult.eligible ? <CheckCircle /> : <Cancel />}
                    label={analysisResult.eligible ? "Eligible" : "Not Eligible"}
                    color={analysisResult.eligible ? "success" : "error"}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Credit Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysisResult.score * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'rgba(44, 211, 225, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#2CD3E1'
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Score: {(analysisResult.score * 100).toFixed(1)}%
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}