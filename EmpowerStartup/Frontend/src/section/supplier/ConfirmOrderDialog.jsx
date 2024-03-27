import { Check, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';

import { Post_ChangeStatus_URL, baseURL } from 'src/constants/apiURLs';

function ConfirmOrderDialog({ open, onClose, order, products, onOrderConfirmed }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmOrder = () => {
    try {
      Post(
        { orderId: order?._id, newStatus: 'Confirmed', userId: order?.user?._id },
        Post_ChangeStatus_URL,
        (resp) => {
          onOrderConfirmed();
          onClose();
          enqueueSnackbar('Order confirmed', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Order could not be confirmed', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const getProductInfo = (productId) => {
    return products.find((product) => product._id === productId);
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Confirm Order</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <div style={{ marginLeft: '20px', marginTop: '30px' }}>
            <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
              Customer Information
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
              Customer Name: {order?.user?.firstName} {order?.user?.lastName}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
              Customer phone no :: {order?.user?.phone}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
              Account Title: {order?.accountTitle}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
              Account Number: {order?.accountNumber}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
              Customer Address: {order?.address}
            </Typography>
            <br />
            {order?.recieptImage && (
              <Card sx={{ maxWidth: 400 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${baseURL}/uploads/${order?.recieptImage}`}
                  alt="Uploaded Image Preview"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Attached receipt
                  </Typography>
                </CardContent>
              </Card>
            )}
          </div>

          <Typography variant="h6">Order details:</Typography>
          <div>
            {order?.products?.map((product, index) => {
              const productInfo = getProductInfo(product?._id);
              return <div key={index} style={{ marginLeft: '20px' }}>

                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  Product Name: {productInfo?.productName}
                </Typography>
                <ul>
                  {product?.variants?.map((variant, variantIndex) => (
                    <li key={variantIndex}>

                      Quantity: {variant?.quantity}, Price: {variant?.price}
                    </li>
                  ))}
                </ul>
              </div>
            })}
          </div>

          <Box display="flex" justifyContent="center">
            <Button
              sx={{
                borderRadius: '10px',
                backgroundColor: '#06855E',
                color: 'white',
                padding: '5px',
                '&:hover': {
                  backgroundColor: '#06855E',
                },
                marginTop: '1rem',
              }}
              size="medium"
              onClick={handleConfirmOrder}
            >
              Confirm Order &nbsp; <Check />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ConfirmOrderDialog;
