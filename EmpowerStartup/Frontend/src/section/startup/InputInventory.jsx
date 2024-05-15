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
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Add, Close, Remove, Search } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Post } from 'src/actions/API/apiActions';
import {
  Post_AddSale_URL,
  Post_GetAllProductsIrrespectiveOfAnyId_URL,
  Post_GetConfirmedOrdersByUserId_URL,
  Post_UpdateProductSale_URL,
  baseURL,
} from 'src/constants/apiURLs';
import { AddProductSaleDialog } from '.';
import { Helmet } from 'react-helmet-async';
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

function InputInventory(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [sale, setSale] = useState(null);
  const [date, setDate] = useState();
  const userId = localStorage.getItem('userId');
  const [showForm, setShowForm] = useState(false);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [openAddSaleDialog, setOpenAddSaleDialog] = useState(false);
  const [variantId, setVariantId] = useState();
  const [orderId, setOrderId] = useState();
  const [productId, setProductId] = useState();
  const [seeVraiants, setSeeVraiants] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const getConfirmedOrders = useCallback(() => {
    try {
      Post(
        { userId: userId },
        Post_GetConfirmedOrdersByUserId_URL,
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
  }, [userId]);

  useEffect(() => {
    getConfirmedOrders();
  }, [getConfirmedOrders]);

  const handleSaveSale = () => {
    try {
      Post(
        {
          sale: sale,
          date: date,
          userId: userId,
        },
        Post_AddSale_URL,
        (resp) => {
          setSale(null);
          setDate(null);
          setShowForm(null);
          getConfirmedOrders();
          getAllProducts()
          enqueueSnackbar('Sale saved successfully', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Sale can not be saved', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const handleUpdateProductSale = (payload) => {
    try {
      Post(
        {
          orderId: payload.orderId,
          productId: payload.productId,
          variantId: payload?.variantId,
          saleAmount: payload?.sale,
          soldQuantity: payload?.quantity,
        },
        Post_UpdateProductSale_URL,
        (resp) => {
          setOpenAddSaleDialog(false);
          getConfirmedOrders();
          getAllProducts()
          enqueueSnackbar('Sale saved successfully', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Sale can not be saved', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const getAllProducts = () => {
    try {
      Post(
        {},
        Post_GetAllProductsIrrespectiveOfAnyId_URL,
        (resp) => {
          setProducts(resp.data?.products);
          // enqueueSnackbar('Products loaded', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Can not load products', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  const findVariantSizeById = (variantId) => {
    let size = '';
    products.forEach((product) => {
      product?.variants?.forEach((variant) => {
        if (variant?._id === variantId) {
          size = variant?.size || 'Not known';
        }
      });
    });
    return size;
  };

  return (
    <div>
      <Helmet>
        <title> Inventory | SE</title>
      </Helmet>
      <div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            sx={{
              backgroundColor: '#04B17C',
              color: 'white',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              width: '15ch',
              fontSize: '15px',
              marginRight: '29rem',
              marginTop: '1REM',
              borderRadius: '30px',
            }}
          >
            Add Sale
          </Button>
        )}

        {showForm && (
          <Box display="flex" flexDirection="column" margin="auto">
            <Typography variant="h4">Sales</Typography>
            <br />
            <TextField
              label="Enter Sale"
              variant="outlined"
              type="number"
              id="sale"
              size="small"
              sx={{ width: '40%' }}
              onChange={(e) => setSale(parseInt(e.target.value))}
            />
            <br />
            <br />
            <TextField
              label="Select Date"
              variant="outlined"
              id="date"
              type="date"
              size="small"
              sx={{ width: '40%' }}
              defaultValue={new Date()}
              value={date}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            {!(date && sale) && <Alert severity="warning">Sale amount and date is required to add sale.</Alert>}
            <Box display="flex" justifyContent="center">
              <Button
                sx={{
                  backgroundColor: '#04B17C',
                  color: 'white',
                  padding: '10px',
                  '&:hover': {
                    backgroundColor: '#04B17C',
                  },
                  width: '15ch',
                  fontSize: '15px',
                  marginRight: '29rem',
                  marginTop: '1REM',
                  borderRadius: '30px',
                }}
                size="small"
                disabled={!(sale && date)}
                onClick={() => handleSaveSale()}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </div>
      <br />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" sx={{ marginLeft: '1rem' }}>
          Input Inventory
        </Typography>
        <div style={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ marginLeft: '1rem' }}
          />
        </div>
      </Box>
      <br />
      <Grid container spacing={2} justifyContent="space-around">
        {confirmedOrders?.map((order) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={order?._id}>
            <Card sx={{ border: '1px solid #ccc' }}>
              <CardMedia
                component="img"
                alt="Sample Image"
                height="200"
                image={`${baseURL}/uploads/${order?.products.map((product) => product?.variants[0]?.image)[0]}`}
              />
              <CardContent>
                <Typography variant="subtitle1">
                  Supplier: {order?.supplier?.firstName} {order?.supplier?.lastName}
                </Typography>
                {order?.products.map((product) => (
                  <div key={product?._id?._id}>
                    <Typography variant="subtitle1">Product Name: {product?._id?.productName}</Typography>
                    <Typography variant="subtitle1">Product Type: {product?._id?.productType}</Typography>
                    <Typography variant="subtitle1">
                      Order Date: {new Date(order?.orderDate).toLocaleString()}
                    </Typography>
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
                          width: '15ch',
                          marginLeft: '1rem',
                          marginTop: '1rem',
                        }}
                        onClick={() => {
                          setSeeVraiants(true);
                          setProductId(product?._id?._id);
                          setOrderId(order?._id);
                          setSelectedProduct(product);
                        }}
                      >
                        See Variants
                      </Button>
                    </Box>
                  </div>
                ))}
                {/* <Typography variant="subtitle1">Total Payment: {order?.totalPayment}</Typography> */}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* {confirmedOrders?.map((order) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={order?._id}>
            <Card sx={{ border: '1px solid #ccc' }}>
              <CardMedia component="img" alt="Sample Image" height="200" image={`${baseURL}/uploads/${order?.image}`} />
              <CardContent>
                <Typography variant="subtitle1">{order?.productName}</Typography>
                <Typography variant="subtitle1">Product Type: {order?.productType}</Typography>
                <Typography variant="subtitle1">Variant Size:&nbsp;{findVariantSizeById(order?._id)}</Typography>
                <Typography variant="subtitle1">Variant Quantity Available: {order?.quantity}</Typography>
                <Typography variant="subtitle1"> Quantity Sold: {order?.quantitySold}</Typography>
                <Typography variant="subtitle1">Variant Price: {order?.price}</Typography>
                <Typography variant="subtitle1">Profit : {order?.profit}</Typography>
                <Typography variant="subtitle1">Order Date: {new Date(order?.orderDate).toLocaleString()}</Typography>
                <Box display="flex" justifyContent="center">
                  <Button
                    sx={{
                      width: '50%',
                      backgroundColor: '#04B17C',
                      color: 'white',
                      borderRadius: '30px',
                      marginTop: '20px',
                      marginLeft: '15px',
                      marginBottom: '2rem',
                      '&:hover': { backgroundColor: '#04B17C' },
                    }}
                    onClick={() => {
                      setVariantId(order?._id)
                      setProductId(order?.productId)
                      setOrderId(order?.orderId);
                      setOpenAddSaleDialog(true);
                    }}
                  >
                    Add Sale
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))} */}
      </Grid>

      <Dialog open={seeVraiants} onClose={() => setSeeVraiants(false)} fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Product Vraiants </Typography>
            <IconButton onClick={() => setSeeVraiants(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProduct?.variants.map((variant, index) => (
            <Grid item xs={12} sm={12} key={variant?._id}>
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
                    <Typography variant="subtitle1">Variant Size: {variant?.size}</Typography>
                    <Typography variant="subtitle1">{`Available Quantity: ${variant?.quantity}`}</Typography>
                    <Typography variant="subtitle1">Quantity Sold: {variant?.quantitySold}</Typography>
                    <Typography variant="subtitle1">{`Per Unit Price: ${variant?.price}`}</Typography>
                    <Typography variant="subtitle1">Profit : {variant?.profit}</Typography>
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="center">
                  <Button
                    sx={{
                      width: '10ch',
                      backgroundColor: '#04B17C',
                      color: 'white',
                      borderRadius: '30px',
                      marginTop: '20px',
                      marginLeft: '15px',
                      marginBottom: '2rem',
                      '&:hover': { backgroundColor: '#04B17C' },
                    }}
                    onClick={() => {
                      setVariantId(variant?._id);
                      setOpenAddSaleDialog(true);
                    }}
                  >
                    Add Sale
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </DialogContent>
      </Dialog>
      <AddProductSaleDialog
        open={openAddSaleDialog}
        onClose={() => setOpenAddSaleDialog(false)}
        orderId={orderId}
        productId={productId}
        variantId={variantId}
        onSaleAdded={(payload) => {
          handleUpdateProductSale(payload)
        }}
      />
    </div>
  );
}

export default InputInventory;
