import { Search } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Badge,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';
import { Post_CreateOrder_URL, Post_GetAllProducts_URL, baseURL } from 'src/constants/apiURLs';
import { PlaceOrderDialog, ShowVariantsDialog } from '.';
import ShoppingCartIconWithBadge from 'src/components/ShoppingCartIconWithBadge';

function OrderProducts({ supplierId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [quantities, setQuantities] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState([]);
  const [openConfirmOrderDialog, setOpenConfirmOrderDialog] = useState(false);
  const [overallTotal, setOverallTotal] = useState(0);
  const userId = localStorage.getItem('userId');
  const [productsToShow, setproductsToShow] = useState(null);
  const [openShowProductDialog, setopenShowProductDialog] = useState(false);

  // open Cart State
  const [openCart, setOpenCart] = useState(false)
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
            product.variants.forEach((variant) => {
              initialQuantities[variant._id] = 0;
            });
          });
          setQuantities(initialQuantities);
        },
        (error) => {
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

  const handleAddToCart = (newProduct) => {
    // Check if the product already exists in the addedToCart array
    const existingProductIndex = addedToCart.findIndex((product) => product._id === newProduct._id);

    if (existingProductIndex !== -1) {
      // If the product already exists, update it
      const updatedCart = [...addedToCart];
      updatedCart[existingProductIndex] = newProduct;
      setAddedToCart(updatedCart);
    } else {
      // If the product doesn't exist, add it to the array
      setAddedToCart([...addedToCart, newProduct]);
    }
    setopenShowProductDialog(false);
  };

  const placeOrder = useCallback(
    (payload) => {
      let grandTotalPrice = 0;
      addedToCart.forEach((product) => {
        grandTotalPrice += product.totalPrice;
      });

      try {
        Post(
          {
            userId: userId,
            supplierId: supplierId,
            products: addedToCart,
            totalPayment: grandTotalPrice,
            accountNumber: payload?.accountNumber,
            accountTitle: payload?.accountNumber,
            recieptImage: payload?.recieptImage,
            address: payload?.address,
            status: 'Pending',
          },
          Post_CreateOrder_URL,
          (resp) => {
            setOpenConfirmOrderDialog(false);
            setOpenCart(false)
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
    },
    [userId, supplierId, addedToCart, overallTotal, enqueueSnackbar]
  );

  useEffect(() => {
    const totalCharges = calculateTotalPrice();
    setOverallTotal(totalCharges);
  }, [addedToCart]);
  const handleRemoveFromCart = (variantId) => {
    // Filter out the variant to be removed from each product's variants array
    const updatedCart = addedToCart.map((item) => ({
      ...item,
      variants: item.variants.filter((variant) => variant._id !== variantId),
    }));

    // Filter out products from the cart that have no variants left
    const filteredCart = updatedCart.filter((item) => item.variants.length > 0);

    setAddedToCart(filteredCart);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
        flexDirection: 'column',
      }}
    >
        <Typography variant="h5">Products Catalog</Typography>
      <Box display="flex" justifyContent="flex-end">
        <ShoppingCartIconWithBadge itemCount={addedToCart?.length} onClick={() => setOpenCart(true)} />
        <div style={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search (By Name)"
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
              <CardContent>
                <img src={`${baseURL}/uploads/${product.variants[0].image}`} alt="product image" style={{ height: '200px', width: '100%' }} />
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {product?.productName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {/* Product Price: {product?.variants[0]?.price} */}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Product Category: {product?.category}
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" m={2}>
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
                      width: '15ch',
                      marginLeft: '1rem',
                      marginTop: '1rem',
                    }}
                    onClick={() => {
                      setproductsToShow(product);
                      setopenShowProductDialog(true);
                    }}
                  >
                    Buy Now
                  </Button>
                </Box>
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
      <>
        {/* Create a Cart Dialog */}

        <Dialog open={openCart} onClose={() => setOpenCart(false)} fullWidth>
          <DialogTitle>Your Cart</DialogTitle>
          <DialogContent>
            {addedToCart.length > 0 && (
              <>
                <Typography variant="h5">Products added to cart:</Typography>
                {addedToCart.map((cartItem, index) => (
                  <Card key={index} style={{ marginTop: '20px', padding: '10px' }}>
                    <CardContent>
                      <Typography variant="h6">{`Product Name: ${cartItem.productName}`}</Typography>
                      <Typography>{`Category: ${cartItem.category}`}</Typography>
                      <Typography>{`Total Price: ${cartItem.totalPrice}`}</Typography>
                      <Grid container spacing={2}>
                        {cartItem.variants
                          .filter((variant) => variant.quantity > 0)
                          .map((variant, variantIndex) => (
                            <Grid item xs={12} sm={6} md={6} key={variantIndex}>
                              <Card style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
                                <CardContent>
                                  <Typography>{`Size: ${variant.size}`}</Typography>
                                  <Typography>{`Quantity: ${variant.quantity}`}</Typography>
                                  <Typography>{`Price: ${variant.price} * ${variant.quantity} = ${variant.price * variant.quantity
                                    }`}</Typography>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveFromCart(variant._id)}
                                  >
                                    Remove
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                <Box display="flex" justifyContent="center">
                  <Button
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
                    color="primary"
                    onClick={() => setOpenConfirmOrderDialog(true)}
                    style={{ marginTop: '10px' }}
                  >
                    Place Order
                  </Button>
                </Box>
              </>
            )}
          </DialogContent>

        </Dialog>


      </>
      <br />

      <Alert severity="warning">
        <Typography variant="subtitle2">
          {' '}
          Please refrain from refreshing the page while placing your order. Doing so may interrupt the order process and
          lead to potential issues.
        </Typography>
      </Alert>

      <PlaceOrderDialog
        open={openConfirmOrderDialog}
        onClose={() => setOpenConfirmOrderDialog(false)}
        onOrderPlaced={(payload) => placeOrder(payload)}
      />
      {productsToShow && (
        <ShowVariantsDialog
          open={openShowProductDialog}
          onClose={() => setopenShowProductDialog(false)}
          product={productsToShow}
          onSubmit={handleAddToCart}
        />
      )}
    </div>
  );
}

export default OrderProducts;
