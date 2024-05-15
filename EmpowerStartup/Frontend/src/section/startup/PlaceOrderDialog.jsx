import { AttachFile, Close, LocalShipping } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  TextField,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { Post_UploadImage_URL } from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';
import { SupplierContext } from './PlaceOrder';
import cityList from 'src/utils/cities.js'


function PlaceOrderDialog({ open, onClose, onOrderPlaced }) {
  const [accountNumber, setAccountNumber] = useState();
  const [accountTitle, setAccountTitle] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [imagePreview, setImagePreview] = useState('');
  const [receiptImage, setReceiptImage] = useState();
  const [location, setLocation] = useState();
  const selectedSupplier = useContext(SupplierContext)
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Assuming you have an API endpoint for uploading images
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName;
          setReceiptImage(imageName);
          // You can also set the image name to a state if needed
          // setImageName(imageName);
        } else {
          // Handle error
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
          {' '}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Place Order</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5">Account Information</Typography>
          <Box display='flex' alignItems="flex-start" justifyContent="flex-start" flexDirection='column'>
            <Typography  variant="h6">Supplier Contact Details</Typography>
            <Typography>Name: {selectedSupplier?.firstName + ' ' + selectedSupplier?.lastName} </Typography>
            <Typography>JazzCash/Easypaisa: {selectedSupplier?.phone} </Typography>
          </Box>
          <br />
          <br />
          <TextField
            label="Account Title"
            variant="outlined"
            id="name"
            size="small"
            fullWidth
            sx={{ width: '100%' }}
            name="name"
            onChange={(e) => setAccountTitle(e.target.value)}
          />
          <br />
          <br />

          <TextField
            label="Account Number"
            variant="outlined"
            id="name"
            type='number'
            size="small"
            fullWidth
            sx={{ width: '100%' }}
            name="name"
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <br />
          <br />
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {/* <FormControl fullWidth error={Boolean(touched.city && errors.city)}> */}
            
            <InputLabel shrink>Location</InputLabel>
          
            <Select
              label="Location"
              variant="outlined"
              id="name"
              name="name"
              // value={value.city}
              size="small"
              fullWidth
              onChange={(e) => setLocation(e.target.value)}
            // {...getFieldProps('city')}
            >
              {cityList.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
            {/* {touched.city && errors.city && (
                            <FormHelperText>{errors.city}</FormHelperText>
                          )} */}
            {/* </FormControl> */}
          </Grid>
          <br />
          <br />

          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <TextField
              variant="outlined"
              fullWidth
              disabled
              value={imagePreview ? 'Image Selected' : 'Upload receipt'}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" component="span">
                    <AttachFile />
                  </IconButton>
                ),
              }}
            />
          </label>
          {imagePreview && (
            <Card sx={{ maxWidth: 400 }}>
              <CardMedia component="img" height="200" image={imagePreview} alt="Uploaded Image Preview" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Uploaded Image Preview
                </Typography>
              </CardContent>
            </Card>
          )}
          <br />
          {
            !(accountNumber && accountTitle && location && receiptImage) ?
              <Alert severity='error'>Account details are required</Alert>
              : (
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LocalShipping />}
                    style={{
                      marginTop: '0.5rem',
                      width: '30%',
                      padding: '10px',
                      backgroundColor: '#04B17C',
                      color: 'white',
                      borderRadius: '10px',
                      '&:hover': { backgroundColor: '#04B17C' },
                    }}

                    onClick={() => {
                      const payload = {
                        accountNumber: accountNumber,
                        accountTitle: accountTitle,
                        recieptImage: receiptImage,
                        address: location,
                      };
                      onOrderPlaced(payload);
                    }}
                  >
                    Place Order
                  </Button>
                </Box>
              )
          }

        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PlaceOrderDialog;
