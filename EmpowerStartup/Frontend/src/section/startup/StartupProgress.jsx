import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import { Post_GetSalesReport_URL } from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';
import { BarChartComponent } from '.';

function StartupProgress(props) {
  const { enqueueSnackbar } = useSnackbar();
  const progressDurationOptions = ['Weekly', 'Monthly', 'Annually'];
  const [progressType, setProgressType] = useState('Weekly');
  const [salesData, setSalesData] = useState([]);

  const handleGetSalesProgress = useCallback(() => {
    try {
      // Make a POST request to fetch sales progress
      Post(
        { interval: progressType }, // Pass the interval as data to the POST request
        Post_GetSalesReport_URL,
        (resp) => {
          setSalesData(resp?.data?.data);
          // Process the response
          console.log('Sales progress data:', resp?.data?.data);
          // Handle the sales progress data as needed (e.g., update the chart)
        },
        (error) => {
          console.log('Error:', error);
          enqueueSnackbar('Failed to fetch sales progress', { variant: 'error' });
        }
      );
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Something went wrong while fetching sales progress', { variant: 'error' });
    }
  },[progressType,enqueueSnackbar]);

  useEffect(() => {
    handleGetSalesProgress();
  }, [handleGetSalesProgress]);

  return (
    <div>
      <Box display="flex" justifyContent="space-between" marginLeft="5rem" marginRight="2rem">
        <Typography variant="h6">Sale Progress</Typography>
        <Typography variant="h6">
          Progress Status: <span style={{ color: '#0685BB' }}>&nbsp;Phase 1</span>
        </Typography>
      </Box>
      <br />
      <Box display="flex" justifyContent="space-between" marginLeft="5rem" marginRight="5rem">
        <Autocomplete
          id="progress"
          fullWidth
          size="small"
          value={progressType}
          sx={{ m: 1, marginTop: '20px', width: '55ch' }}
          options={progressDurationOptions}
          getOptionLabel={(option) => option}
          onChange={(event, newValue) => {
            if (newValue) {
              setProgressType(newValue);
            } else {
              setProgressType('Weekly');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Duration"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </Box>
      <br />
      <div style={{
        margin: '2rem'
      }}>
      <BarChartComponent salesData={salesData} type="line"/>
      </div>
    </div>
  );
}

export default StartupProgress;
