import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

function AddProductSaleDialog({ open, onClose, onSaleAdded, orderId, productId, variantId }) {
  const [sale, setSale] = useState();
  const [quantity, setQuantity] = useState();
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Add sale for this product Variant </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <br />
          <TextField
            label="Enter Quantity"
            variant="outlined"
            type="number"
            id="quantity"
            size="small"
            fullWidth
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <br />
          <br />
          <TextField
            label="Enter Sale"
            variant="outlined"
            type="number"
            id="sale"
            size="small"
            fullWidth
            onChange={(e) => setSale(parseInt(e.target.value))}
          />

            <Box display="flex" justifyContent="center">
              <Button
                sx={{
                  width: '20%',
                  backgroundColor: 'white',
                  color: 'black',
                  border :'2px solid #04B17C',
                  borderRadius: '30px',
                  marginTop: '2rem',
                  marginLeft: '15px',
                  marginBottom: '2rem',
                  '&:hover': { backgroundColor: '#04B17C', color:'white' },
                }}
                onClick={() => {
                  const payload = {
                    orderId: orderId,
                    productId: productId,
                    variantId: variantId,
                    quantity: quantity,
                    sale: sale,
                  };
                  onSaleAdded(payload);
                }}
                disabled={!quantity || !sale}
              >
                Add
              </Button>
            </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddProductSaleDialog;
