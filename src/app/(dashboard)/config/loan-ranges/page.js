'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Snackbar,
  InputAdornment,
  Card,
  CardContent,
  Slider,
  Chip,
  CircularProgress
} from '@mui/material';
import { Save, CurrencyRupee } from '@mui/icons-material';
import creditEngine from '@/api/credit-engine';

export default function LoanRangesPage() {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRangeId, setCurrentRangeId] = useState(null);
  const [ranges, setRanges] = useState([])
  const [availableRatings, setAvailableRatings] = useState([]);
  useEffect(() => {
    fetchRiskRatings();
    fetchLoanRanges();
  }, []);

  const fetchRiskRatings = async () => {
    try {
      const response = await creditEngine.get('/risk-rating-threshholds/');
      const existingThresholds = response.data.data?.[0];
  
      if (existingThresholds?.ratingRanges) {
        const ratings = existingThresholds.ratingRanges.map(range => ({
          rating: range.rating,
          color: getColorForRating(range.rating),
        }));
        setAvailableRatings(ratings);
        await fetchLoanRanges(ratings);
      }
    } catch (err) {
      console.error('Error fetching risk ratings:', err);
      setError('Failed to fetch risk ratings');
      setLoading(false);
    }
  };
  // const [ranges, setRanges] = useState([
  //   {
  //     rating: 'A',
  //     color: '#4CAF50',
  //     minAmount: 300000,
  //     maxAmount: 500000,
  //     description: 'Premium loan range for excellent credit risk'
  //   },
  //   {
  //     rating: 'B',
  //     color: '#8BC34A',
  //     minAmount: 150000,
  //     maxAmount: 300000,
  //     description: 'Standard loan range for good credit risk'
  //   },
  //   {
  //     rating: 'C',
  //     color: '#FFC107',
  //     minAmount: 75000,
  //     maxAmount: 150000,
  //     description: 'Moderate loan range for average credit risk'
  //   },
  //   {
  //     rating: 'D',
  //     color: '#FF9800',
  //     minAmount: 25000,
  //     maxAmount: 75000,
  //     description: 'Limited loan range for high credit risk'
  //   },
  //   {
  //     rating: 'E',
  //     color: '#F44336',
  //     minAmount: 10000,
  //     maxAmount: 25000,
  //     description: 'Minimal loan range for very high credit risk'
  //   }
  // ]);

  const fetchLoanRanges = async (ratings) => {
    try {
      const response = await creditEngine.get('/loan-offer-ranges/');
      const existingRanges = response.data.data?.[0];
  
      if (existingRanges) {
        setCurrentRangeId(existingRanges._id);
        // Create a map of existing ranges
        const rangesMap = new Map(
          existingRanges.ratingRanges.map(range => [range.rating, range])
        );
  
        // Combine with available ratings
        const formattedRanges = ratings?.map(rating => {
          const existingRange = rangesMap.get(rating.rating);
          return {
            rating: rating.rating,
            color: rating.color,
            description: rating.description,
            minAmount: existingRange?.minimumAmount || 0,
            maxAmount: existingRange?.maximumAmount || 0
          };
        });
  
        setRanges(formattedRanges);
      } else {
        // If no existing ranges, initialize with 0 amounts
        const initialRanges = ratings?.map(rating => ({
          rating: rating.rating,
          color: rating.color,
          minAmount: 0,
          maxAmount: 0
        }));
        setRanges(initialRanges);
      }
    } catch (err) {
      console.error('Error fetching loan ranges:', err);
      setError('Failed to fetch loan offer ranges');
    } finally {
      setLoading(false);
    }
  };

  const getColorForRating = (rating) => {
    const colors = {
      'A': '#4CAF50',
      'B': '#8BC34A',
      'C': '#FFC107',
      'D': '#FF9800',
      'E': '#F44336'
    };
    return colors[rating];
  };

  const handleRangeChange = (rating, field, value) => {
    setRanges(prev =>
      prev.map(range =>
        range.rating === rating
          ? { ...range, [field]: parseInt(value) }
          : range
      )
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formattedRanges = {
        ratingRanges: ranges.map(range => ({
          rating: range.rating,
          minimumAmount: Number(range.minAmount),
          maximumAmount: Number(range.maxAmount)
        }))
      };

      if (currentRangeId) {
        await creditEngine.put(`/loan-offer-ranges/${currentRangeId}`, formattedRanges);
      } else {
        const response = await creditEngine.post('/loan-offer-ranges/', formattedRanges);
        setCurrentRangeId(response.data.data._id);
      }
      
      setShowSaveSuccess(true);
    } catch (err) {
      console.error('Error saving loan ranges:', err);
      setError('Failed to save loan offer ranges');
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
          Loan Offer Ranges
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


      <Grid container spacing={3}>
        {ranges?.map((range) => (
          <Grid item xs={12} md={6} key={range.rating}>
            <Card sx={{ position: 'relative' }}>
              <Chip
                label={range.rating}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: range.color,
                  color: 'white',
                  fontWeight: 'bold',
                  width: '32px',
                  height: '32px'
                }}
              />
              <CardContent sx={{ pt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#0A2647' }}>
                  Risk Rating {range.rating}
                </Typography>



                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Minimum Amount"
                      type="number"
                      value={range.minAmount}
                      onChange={(e) => handleRangeChange(range.rating, 'minAmount', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Maximum Amount"
                      type="number"
                      value={range.maxAmount}
                      onChange={(e) => handleRangeChange(range.rating, 'maxAmount', e.target.value)}

                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Loan ranges updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}