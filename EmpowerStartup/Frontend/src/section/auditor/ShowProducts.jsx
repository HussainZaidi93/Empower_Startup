import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField } from '@mui/material';
import { logoImage } from 'src/images';
import { baseURL } from 'src/constants/apiURLs';

const ShowProducts = ({ product, onAudit }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [auditData, setAuditData] = useState({});

    const toggleDialog = () => {
        setShowDialog(!showDialog);
    };

    const handleChange = (variantId, field) => (event) => {
        const { value } = event.target;
        setAuditData(prevData => ({
            ...prevData,
            variantId: {
                ...prevData[variantId],
                [field]: value
            }
        }));
    };

    const handleAudit = () => {
        auditData.productId = product[0]?._id
        onAudit(auditData);
        toggleDialog();
    };
    return (
        <div>
            <img src={`${baseURL}/uploads/${product[0]?.variants[0]?.image}`} alt="Product" width={200} height={200}/>
            <Button variant="contained" onClick={toggleDialog}>
                View Variants
            </Button>
            {showDialog &&
                <Dialog open={showDialog} onClose={toggleDialog}>
                    <DialogTitle>Variants for {product[0]?._id}</DialogTitle>
                    <DialogContent>
                        {product[0]?.variants?.map((variant) => (
                            <div key={variant?._id}>
                                <Typography variant="body1">Size: {variant?.size}</Typography>
                                <Typography variant="body1">Price: ${variant?.price}</Typography>
                                <Typography variant="body1">Variant Price: ${variant?.variantPrice}</Typography>
                                <Typography variant="body1">Quantity: {variant?.quantity}</Typography>
                                <Typography variant="body1">Ordered Quantity: {variant?.orderedQuantity}</Typography>
                                <br />
                                <TextField
                                    label="Sold Quantity"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={auditData[variant._id]?.soldQuantity || ''}
                                    onChange={handleChange(variant._id, 'soldQuantity')}
                                    inputProps={{ min: 0, max: variant.quantity }}
                                />
                                &nbsp;
                                <TextField
                                    label="Sales"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={auditData[variant._id]?.sales || ''}
                                    onChange={handleChange(variant._id, 'sales')}
                                    inputProps={{ min: 0 }}
                                />
                                <hr />
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAudit} color="primary">
                            Save Audit
                        </Button>
                        <Button onClick={toggleDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </div>
    );
};

export default ShowProducts;
