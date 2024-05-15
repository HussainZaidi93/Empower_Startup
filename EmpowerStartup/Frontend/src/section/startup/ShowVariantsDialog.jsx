import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { baseURL } from 'src/constants/apiURLs';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  image: {
    width: 100,
    height: 100,
    borderRadius: theme.spacing(1),
  },
  variantItem: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
  },
}));

const ShowVariantsDialog = ({ product, open, onClose, onSubmit }) => {
  const classes = useStyles();
  const [selectedQuantities, setSelectedQuantities] = useState(new Array(product.variants.length).fill(0));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const handleQuantityChange = (index, event) => {
    const newQuantities = [...selectedQuantities];
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > product.variants[index].quantity) {
      setSnackbarMessage(`Only ${product.variants[index].quantity} available.`);
      setSnackbarOpen(true);
      newQuantities[index] = product.variants[index].quantity;
    } else {
      newQuantities[index] = newQuantity;
    }
    setSelectedQuantities(newQuantities);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (let i = 0; i < product.variants.length; i++) {
      totalPrice += selectedQuantities[i] * product.variants[i].price;
    }
    return totalPrice;
  };

  const handleVariantSubmission = () => {
    const totalPrice = calculateTotalPrice();
    const selectedVariants = product.variants.map((variant, index) => ({
      ...variant,
      quantity: selectedQuantities[index],
      orderedQuantity : selectedQuantities[index],
      size : variant?.size,
      variantPrice : variant?.price,
      sale: 0, // Set initial sale value to 0
      profit : 0,
      quantitySold: 0,
      image: variant?.image || '',
    }));
    const selectedProduct = {
      ...product,
      totalPrice: totalPrice, // Add totalPrice to the selected product
      variants: selectedVariants.filter((variant) => variant.quantity > 0),
    };
    onSubmit(selectedProduct);
  };

  // reset values when Dialog is closed
  // useEffect(() => {
  //   if (!open) {
  //     // Reset the selected quantities when the dialog is closed
  //     setSelectedQuantities(new Array(product.variants.length).fill(0));
  //   }
  // }, [open, product.variants.length]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">Product Variants</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {product?.variants.map((variant, index) => (
            <Grid item xs={12} sm={12} md={12} lg={12} key={variant?._id}>
              <Box className={classes.variantItem}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <img
                      src={`${baseURL}/uploads/${variant?.image}`}
                      alt={`Variant ${index}`}
                      className={classes.image}
                    />
                  </Grid>
                  <Grid item>
                    <Typography>{`Size: ${variant?.size}`}</Typography>
                    <Typography>{`Per Unit Price: ${variant?.price}`}</Typography>
                    <Typography>{`Available Quantity: ${variant?.quantity}`}</Typography>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} lg={2}> 
                    <TextField
                      type="number"
                      label="Quantity"
                      size="small"
                      variant="outlined"
                      inputProps={{ min: 0, max: variant.quantity }}
                      value={selectedQuantities[index]}
                      onChange={(event) => handleQuantityChange(index, event)}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', flexDirection: 'column' }}>
        <br />
        <Typography variant="h6" sx={{ border: '1px solid green', borderRadius: '20px', padding: '10px' }}>
          Total Price: {calculateTotalPrice()}
        </Typography>
        <br />
        <Box display="flex" justifyContent="space-between" >
          <Button
            fullWidth
            sx={{
              backgroundColor: '#04B17C',
              color: 'white',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              fontSize: '13px',
              width: '20ch',
              marginLeft: '1rem',
            }}
            onClick={handleVariantSubmission}
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
      {/* <DialogContent>
        <Typography variant='h6' sx={{ border: '1px solid green', borderRadius: '20px', padding: '10px' }}>Total Price: {calculateTotalPrice()}</Typography>
      </DialogContent> */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} message={snackbarMessage} />
    </Dialog>
  );
};

export default ShowVariantsDialog;
