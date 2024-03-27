import { Search, AddShoppingCart, LocalShipping, Delete } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Snackbar,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';
import { Post_CreateOrder_URL, Post_GetAllProducts_URL, baseURL } from 'src/constants/apiURLs';
// import ActionConfirmationDialog from 'src/components/ActionConfrimationDialog';
import {  PlaceOrderDialog } from '.';

function OrderProducts({ supplierId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [searchString, setSearchString] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState([]);
  const [openConfirmOrderDialog, setOpenConfirmOrderDialog] = useState(false);
  const [overallTotal, setOverallTotal] = useState();
  const userId = localStorage.getItem('userId');

  const getAllProducts = useCallback(() => {
    try {
      Post(
        { searchString: searchString, supplierId },
        Post_GetAllProducts_URL,
        (resp) => {
          setProducts(resp?.data.products);
          // Initialize quantities with default values
          const initialQuantities = {};
          resp?.data.products.forEach((product) => {
            initialQuantities[product._id] = 0;
          });
          setQuantities(initialQuantities);
        },
        (error) => {
          console.log('errr', error);
          enqueueSnackbar('Can not load products', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, [searchString, enqueueSnackbar, supplierId]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  //Function to calculate total price
  const calculateTotalPrice = () => {
    let overallPrice = 0;
    addedToCart.forEach((item) => {
      overallPrice += item.totalPrice;
    });

    return overallPrice;
  };

  const handleQuantityChange = (productId, quantity) => {
    if (!isNaN(quantity)) {
      setQuantities({ ...quantities, [productId]: 0 });
    }
    setQuantities({ ...quantities, [productId]: parseInt(quantity) });
    const productToUpdate = addedToCart?.find((item) => item._id === productId);
    const newTotalPrice = productToUpdate?.price * parseInt(quantity);

    const updatedAddedToCart = addedToCart.map((item) => {
      if (item._id === productId) {
        return {
          ...item,
          quantity: parseInt(quantity),
          totalPrice: newTotalPrice,
        };
      }
      return item;
    });
    if (quantity > productToUpdate?.quantity) {
      // If the entered quantity exceeds the available quantity, remove the product from the cart
      handleRemoveFromCart(productId);

      setSnackbarMessage(`This item quantity is not available.`);
      setSnackbarOpen(true);
      return;
    }

    // Update the addedToCart state with the updated product
    setAddedToCart(updatedAddedToCart);
  };

  const handleAddToCart = (productId) => {
    // Find the product in the products array based on productId
    const productToAdd = products.find((product) => product._id === productId);
    const quantity = quantities[productId];

    const totalPrice = productToAdd?.price * quantity;
    const existingProductIndex = addedToCart.findIndex((item) => item._id === productId);

    if (existingProductIndex !== -1) {
      const updatedAddedToCart = [...addedToCart];
      updatedAddedToCart[existingProductIndex].quantity = quantity;
      updatedAddedToCart[existingProductIndex].totalPrice = totalPrice;
      setAddedToCart(updatedAddedToCart);
    } else {
      const addedProduct = {
        _id: productToAdd._id,
        quantity: quantity,
        price: productToAdd.price,
        totalPrice: totalPrice,
      };
      setAddedToCart([...addedToCart, addedProduct]);
    }

    if (quantity > productToAdd.quantity) {
      handleRemoveFromCart(productId);
      setSnackbarMessage(`This item quantity is not available. Available Quantity: ${productToAdd.quantity}`);
      setSnackbarOpen(true);
      return;
    }

    const message = `Added ${quantity} of ${productToAdd.productName} to cart`;
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    console.log(message);
  };

  // Function to extract product info from products array based on _id
  const getProductInfo = (productId) => {
    return products.find((product) => product._id === productId);
  };

  //Function to remove producst from cart
  const handleRemoveFromCart = (productId) => {
    const updatedAddedToCart = addedToCart.filter((item) => item._id !== productId);
    setAddedToCart(updatedAddedToCart);
  };

  const placeOrder = useCallback((payload) => {
    try {
      Post(
        {
          userId: userId,
          supplierId: supplierId,
          products: addedToCart,
          totalPayment: overallTotal,
          accountNumber: payload?.accountNumber,
          accountTitle: payload?.accountNumber,
          recieptImage: payload?.recieptImage,
          address: payload?.address,
        },
        Post_CreateOrder_URL,
        (resp) => {
          setOpenConfirmOrderDialog(false);
          setAddedToCart([]);
          enqueueSnackbar('Your order has been placed', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Can not place order', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, [userId, supplierId, addedToCart, overallTotal]);

  useEffect(() => {
    const totalCharges = calculateTotalPrice();
    setOverallTotal(totalCharges);
  }, [addedToCart]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">Products Catalog</Typography>
        {console.log('quanrew', addedToCart)}
        <div style={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search(By Name)"
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ marginLeft: '1rem' }}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </Box>
      <br />
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                position: 'relative',
                border: '1px solid #ccc',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
            >
              <CardMedia component="img" alt="Product Image" height="200" image={`${baseURL}${product?.image}`} />
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {product?.productName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Product Price: {product?.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Product Size: {product?.size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Product Category: {product?.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Product Sub Category: {product?.subCategory}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity Available: {product?.quantity}
                </Typography>
                <TextField
                  type="number"
                  label="Quantity"
                  variant="outlined"
                  size="small"
                  value={quantities[product._id]}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  style={{ marginTop: '0.5rem' }}
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product._id)}
                  startIcon={<AddShoppingCart />}
                  style={{
                    marginTop: '0.5rem',
                    // width: '40%',
                    backgroundColor: '#04B17C',
                    color: 'white',
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: '#04B17C' },
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      <br />

      {addedToCart.length > 0 && <Typography variant="h5">Products added to cart:</Typography>}
      <br />
      <Alert severity="warning">
        <Typography variant="subtitle2">
          {' '}
          Please refrain from refreshing the page while placing your order. Doing so may interrupt the order process and
          lead to potential issues.
        </Typography>
      </Alert>
      <br />
      <Grid container spacing={2}>
        {addedToCart.map((item) => {
          const product = getProductInfo(item._id);
          console.log('prodsdasdf', addedToCart, overallTotal);
          return (
            <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
              <Card
                key={product._id}
                sx={{
                  position: 'relative',
                  border: '1px solid #ccc',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                }}
              >
                {/* <CardMedia component="img" alt="Product Image" height="200" image={`${baseURL}${product?.image}`} /> */}
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {product?.productName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Product Price: {product?.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Product Size: {product?.size}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Product Category: {product?.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Product Sub Category: {product?.subCategory}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Box display="flex" justifyContent="flex-end">
                    <Tooltip arrow placement="top" title="Remove from cart">
                      <IconButton color="error" onClick={() => handleRemoveFromCart(product._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {addedToCart.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            style={{
              width: '70%',
              height: '20%',
              backgroundColor: '#B8D6E3',
              boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.3)',
              marginLeft: '50px',
              padding: '20px',
            }}
            display="flex"
            flexDirection="column"
            marginTop="2rem"
          >
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6">Total charges : Rs. {overallTotal} </Typography>
              <br />
              <Button
                variant="contained"
                color="primary"
                startIcon={<LocalShipping />}
                style={{
                  marginTop: '0.5rem',
                  width: '16%',
                  padding: '10px',
                  backgroundColor: '#04B17C',
                  color: 'white',
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: '#04B17C' },
                }}
                onClick={() => setOpenConfirmOrderDialog(true)}
              >
                Buy Now
              </Button>
            </div>
          </Box>
        </div>
      )}

      {/* <ActionConfirmationDialog
        title="Place Order"
        open={openConfirmOrderDialog}
        color="green"
        onClose={() => setOpenConfirmOrderDialog(false)}
        ActionConfirmationText="Are you sure , you want to place this order? "
        actionButtonText="Yes !"
        actionCancellationText="No"
        onSubmit={() => placeOrder()}
      /> */}

      <PlaceOrderDialog
        open={openConfirmOrderDialog}
        onClose={() => setOpenConfirmOrderDialog(false)}
        onOrderPlaced={(payload) => placeOrder(payload)}
      />
    </div>
  );
}

export default OrderProducts;
