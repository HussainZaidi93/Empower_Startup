import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Post_GetConfirmedOrdersByUserIdForAudit_URL, Post_GetConfirmedOrdersByUserId_URL, Post_PlaceAudit_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import ShowProducts from './ShowProducts';

function PlaceAuditDialog({ open, onClose, startupToAudit }) {
  const { enqueueSnackbar } = useSnackbar();
  const [revenue, setRevenue] = useState('');
  const [sales, setSales] = useState('');
  const [salasDataReport, setSalasDataReport] = useState('');
  const [actualSalesReport, setActualSalesReport] = useState('');
  const [issue, setIssue] = useState('');

  const [confirmedOrders, setConfirmedOrders] = useState([]);

  const handlePlaceAudit = async () => {
    try {
      const payload = {
        userId: startupToAudit.userId,
        auditDate: new Date().toISOString(),
        revenue: Number(revenue),
        sale: Number(sales),
        salasDataReport,
        actualSalesReport,
        issue
      };

      const response = await fetch(Post_PlaceAudit_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error placing audit');
      }

      const updatedAuditStartup = await response.json();

      if (!updatedAuditStartup) {
        throw new Error('Audit startup not found');
      }

      enqueueSnackbar('Audit placed', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error placing audit:', error);
      enqueueSnackbar('Can not place audit', { variant: 'error' });
    }
  };

  const getConfirmedOrders = useCallback(() => {
    try {
      Post(
        { userId: startupToAudit?.userId },
        Post_GetConfirmedOrdersByUserIdForAudit_URL,
        (resp) => {
          setConfirmedOrders(resp?.data?.confirmedOrders);
        },
        (error) => {
          enqueueSnackbar('Products are not loaded', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, [startupToAudit]);

  useEffect(() => {
    getConfirmedOrders();   
  }, [getConfirmedOrders]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">Place Audit</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <div>
          {confirmedOrders?.length > 0 &&
            <ShowProducts product={confirmedOrders[0]?.products} onAudit={(audit) => {
              enqueueSnackbar("Audit Placed", { variant: 'success' })
            }} />
          }
          <TextField
            label="Revenue"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sales"
            type="number"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Salas Data Report"
            value={salasDataReport}
            onChange={(e) => setSalasDataReport(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Actual Sales Report"
            value={actualSalesReport}
            onChange={(e) => setActualSalesReport(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box display="flex" justifyContent="center" marginTop="1rem">
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceAudit}
              sx={{
                backgroundColor: '#04B17C',
                color: 'white',
                padding: '10px',
                '&:hover': {
                  backgroundColor: '#04B17C',
                },
                width: '13ch'
              }}
            >
              Place
            </Button>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlaceAuditDialog;
