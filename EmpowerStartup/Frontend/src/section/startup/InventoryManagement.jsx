import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Typography, Button, Card, CardActionArea, CardActions, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CardMedia, TextField } from '@mui/material';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';
import { Post_AddSales_URL, Post_GetConfirmedOrdersByUserIdForAudit_URL, baseURL } from 'src/constants/apiURLs';

function InventoryManagement({ supplierId }) {
    const { enqueueSnackbar } = useSnackbar();
    const [orders, setOrders] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userId = localStorage.getItem('userId');

    const handleOpenDialog = (product,order) => {
        setSelectedProduct({ ...product, orderId: order._id }); // Assign orderId to selectedProduct
        setSelectedVariants(product.variants.map(variant => ({ ...variant, quantitySold: 0 }))); // Initialize selected variants with quantitySold = 0
        setTotalPrice(0); // Reset total price
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedProduct(null);
        setOpenDialog(false);
    };

    const handleQuantityChange = (variantId, quantitySold) => {
        const updatedVariants = selectedVariants.map(variant =>
            variant._id === variantId ? { ...variant, quantitySold } : variant
        );
        setSelectedVariants(updatedVariants);

        // Calculate total price based on selected variants
        const totalPrice = updatedVariants.reduce((acc, variant) => acc + (variant.variantPrice * variant.quantitySold), 0);
        setTotalPrice(totalPrice);
    };

    const handleAddSale = async () => {
        try {
            console.log("hsdfdsfdsf", selectedProduct)
            const selectedVariantIds = selectedVariants.map(variant => ({ _id: variant._id, quantitySold: variant.quantitySold }));
            const data = {
                orderId: selectedProduct.orderId, // Assuming order ID is available in the selected product
                selectedVariants: selectedVariantIds,
                totalPrice: totalPrice
            };
            data._id = userId

            Post(
                data,
                Post_AddSales_URL,
                resp => {
                    enqueueSnackbar("Sales Added", { variant: 'success' })
                },
                error => {
                    enqueueSnackbar("Cannot add Sales", { variant: 'error' })
                }
            )

            handleCloseDialog();
            // You may want to update the state or reload the orders here
        } catch (error) {
            console.error('Error adding sales:', error);
            enqueueSnackbar('Failed to add sales', { variant: 'error' });
        }
    };

    const getAllProducts = useCallback(() => {
        try {
            Post(
                { user: userId },
                Post_GetConfirmedOrdersByUserIdForAudit_URL,
                (resp) => {
                    setOrders(resp?.data)
                },
                (error) => {
                    console.log('errr', error);
                    enqueueSnackbar('Can not load products', { variant: 'error' });
                }
            );
        } catch (error) {
            enqueueSnackbar('Something went wrong at server', { variant: 'error' });
        }
    }, [enqueueSnackbar, userId]);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    return (
        <Grid container spacing={2}>
            {orders.map((order, index) => (
                <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
                    {/* <Typography variant="h5" component="h2">
                        Order #{index + 1}
                    </Typography> */}
                    <Grid container spacing={2}>
                        {order.products.map((product, idx) => (
                            <Grid item xs={12} sm={12} md={6} key={idx}>
                                <Card>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {product.productName}
                                            </Typography>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`${baseURL}/uploads/${product?.variants[0]?.image}`} // Displaying the image of the variant at index 0
                                                alt={product.productName}
                                            />
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                Total Payment: {order.totalPayment}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button size="small" color="success" variant='contained' onClick={() => handleOpenDialog(product,order)}>
                                            Add Sale
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth>
                <DialogTitle>{selectedProduct && selectedProduct.productName} Variants</DialogTitle>
                <DialogContent>
                    <Grid container spacing={4}>
                        {selectedVariants.map((variant, idx) => (
                            <Grid item xs={6} key={idx}> {/* Each variant takes half of the row */}
                                <div>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`${baseURL}/uploads/${variant.image}`}
                                        alt={'Product variant'}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Size: {variant.size}, Ordered Quantity: {variant.orderedQuantity}
                                        </Typography>
                                        <br />
                                        {/* Add input field to add sold quanttiy which must me less than the ordered quantity */}
                                        <TextField
                                            type="number"
                                            label="Quantity Sold"
                                            size="small"
                                            fullWidth
                                            variant="outlined"
                                            value={variant.quantitySold}
                                            onChange={(e) => handleQuantityChange(variant._id, e.target.value)}
                                            inputProps={{ min: 0, max: variant.orderedQuantity }}
                                            error={variant.quantitySold > variant.orderedQuantity}
                                            helperText={variant.quantitySold > variant.orderedQuantity ? 'Quantity sold cannot be more than ordered quantity' : ''}
                                        />
                                        <br />
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Price: {variant.variantPrice * variant.quantitySold}
                                        </Typography>
                                    </CardContent>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="h6" component="p" sx={{ border: '1px solid', padding: '5px', borderRadius: '20px', textAlign: 'center' }}>
                        Total Price: {totalPrice}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleAddSale} color="primary">
                        Add Sale
                    </Button>
                </DialogActions>
            </Dialog>

        </Grid>
    );
}

export default InventoryManagement;
