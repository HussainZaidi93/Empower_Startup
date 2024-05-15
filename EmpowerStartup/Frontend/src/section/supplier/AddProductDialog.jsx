import { AttachFile, Close } from '@mui/icons-material';
import {
  Autocomplete,
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
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Post_AddProduct_URL,
  Post_GetAllStartupTypes_URL,
  Post_UpdateProduct_URL,
  Post_UploadImage_URL,
  baseURL,
} from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { Form, Formik, FieldArray } from 'formik';
import * as Yup from 'yup';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function AddProductDialog({ open, onClose, onProductAdded, editProduct }) {
  const { enqueueSnackbar } = useSnackbar();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [profileImages, setProfileImages] = useState([]);
  const supplierId = localStorage.getItem('userId');
  const [categories, setCategories] = useState([]);
  const [startTypeId, setStartTypeId] = useState();

  const initialValues = {
    id: editProduct ? editProduct?._id : '',
    productName: editProduct ? editProduct?.productName : '',
    variants: editProduct ? editProduct?.variants.map(variant => ({
      size: variant.size,
      quantity: variant.quantity,
      price: variant.price,
      image: variant.image,
    })) : [{ size: '', quantity: '', price: '', image: '' }],
    category: editProduct ? editProduct?.category : '',
    subCategory: editProduct ? editProduct?.subCategory : '',
    productType: editProduct ? editProduct?.productType : '',
  };

  const handleImageChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImagePreviews = [...imagePreviews];
        newImagePreviews[index] = reader.result;
        setImagePreviews(newImagePreviews);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName;
          const newProfileImages = [...profileImages];
          newProfileImages[index] = imageName;
          setProfileImages(newProfileImages);
        } else {
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleAddproduct = async (values, actions) => {
    try {
      const data = {
        ...values,
        variants: values.variants.map((variant, index) => ({
          size: variant.size,
          quantity: parseInt(variant.quantity),
          price: parseFloat(variant.price),
          image: profileImages[index],
        })),
        supplierId,
        startTypeId,
      };

      const endpoint = editProduct ? Post_UpdateProduct_URL : Post_AddProduct_URL;

      const response = await Post(data, endpoint, resp => { }, error => { });

      actions.setSubmitting(false);
      actions.resetForm();
      setImagePreviews([]);
      setProfileImages([]);

      if (!editProduct) {
        enqueueSnackbar('Product added successfully', {
          variant: 'success',
        });
        onProductAdded();
      } else {
        onProductAdded();
        enqueueSnackbar('Product details updated successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Cannot add product', { variant: 'error' });
      onProductAdded();
    }
  };

  const ValidationSchema = Yup.object().shape({
    productName: Yup.string().required('Product name is required'),
    // category: Yup.string().required('Product category is required'),
    // subCategory: Yup.string().required('Product sub category is required'),
    productType: Yup.string().required('Product type is required'),
    variants: Yup.array().of(
      Yup.object().shape({
        size: Yup.string().required('Size is required'),
        quantity: Yup.number().required('Quantity is required'),
        price: Yup.number().required('Price is required'),
      })
    ),
  });

  const getAllStartupTypes = useCallback(() => {
    try {
      Post(
        {},
        Post_GetAllStartupTypes_URL,
        (resp) => {
          setCategories(resp?.data.data);
        },
        (error) => {
          enqueueSnackbar('Failed to load startup types', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, []);

  useEffect(() => {
    getAllStartupTypes();
    if (editProduct) {
      // Populate image previews and profile images arrays with existing images
      const existingImages = editProduct?.variants.map(variant => variant.image);
      setImagePreviews(existingImages);
      setProfileImages(existingImages);
    }
  }, [getAllStartupTypes,editProduct]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">{editProduct ? 'Edit Product' : 'Add Product'}</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <br />
          {editProduct && <Typography variant="h6">Product category : {editProduct?.category}</Typography>}
          <br />
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={ValidationSchema}
            onSubmit={(values, actions) => {
              actions.setSubmitting(true);
              values.supplierId = supplierId;
              values.startTypeId = startTypeId;
              handleAddproduct(values, actions);
            }}
          >
            {({ errors, values, touched, getFieldProps, handleSubmit, isSubmitting, setFieldValue }) => (
              <Form>
                <Grid container spacing={2} width="100%">
                  {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Autocomplete
                      id="category"
                      disabled={editProduct}
                      fullWidth
                      options={categories}
                      getOptionLabel={(option) => option.startupName}
                      onChange={(event, newValue) => {
                        setFieldValue('category', newValue?.startupName);
                        setStartTypeId(newValue?._id);
                      }}
                      renderInput={(params) => (
                        <TextField
                        size='small'
                          {...params}
                          fullWidth
                          label="Select Product Category"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                        />
                      )}
                    />
                  </Grid> */}

                  {/* Other fields like subCategory, productType, productName go here */}
                  {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                    size='small'
                      id="subCategory"
                      name="subCategory"
                      label="Product Sub Category"
                      variant="outlined"
                      fullWidth
                      value={values.subCategory}
                      error={Boolean(touched.subCategory && errors.subCategory)}
                      helperText={touched.subCategory && errors.subCategory}
                      {...getFieldProps('subCategory')}
                    />
                  </Grid>*/}
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                      size='small'
                      label="Product Type"
                      variant="outlined"
                      fullWidth
                      id="productType"
                      name="productType"
                      value={values.productType}
                      error={Boolean(touched.productType && errors.productType)}
                      helperText={touched.productType && errors.productType}
                      {...getFieldProps('productType')}
                    />
                  </Grid> 
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                      size='small'
                      id="productName"
                      name="productName"
                      label="Product Name"
                      variant="outlined"
                      fullWidth
                      value={values.productName}
                      error={Boolean(touched.productName && errors.productName)}
                      helperText={touched.productName && errors.productName}
                      {...getFieldProps('productName')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FieldArray name="variants">
                      {({ push, remove }) => (
                        <>
                          {values.variants.map((_, index) => (
                            <Grid container spacing={2} width="100%" key={index}>
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Autocomplete
                                  size='small'
                                  id={`variants.${index}.size`}
                                  name={`variants.${index}.size`}
                                  fullWidth
                                  options={sizes}
                                  getOptionLabel={(option) => option}
                                  onChange={(event, newValue) => {
                                    setFieldValue(`variants.${index}.size`, newValue);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      size='small'
                                      {...params}
                                      fullWidth
                                      label="Select Size"
                                      variant="outlined"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      error={Boolean(touched.variants?.[index]?.size && errors.variants?.[index]?.size)}
                                      helperText={touched.variants?.[index]?.size && errors.variants?.[index]?.size}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <TextField
                                  size='small'
                                  name={`variants.${index}.quantity`}
                                  label="Quantity"
                                  variant="outlined"
                                  fullWidth
                                  type="number"
                                  value={values.variants[index].quantity}
                                  onChange={(e) => setFieldValue(`variants.${index}.quantity`, e.target.value)}
                                  error={Boolean(touched.variants?.[index]?.quantity && errors.variants?.[index]?.quantity)}
                                  helperText={touched.variants?.[index]?.quantity && errors.variants?.[index]?.quantity}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <TextField
                                  size='small'
                                  name={`variants.${index}.price`}
                                  label="Price"
                                  variant="outlined"
                                  fullWidth
                                  type="number"
                                  value={values.variants[index].price}
                                  onChange={(e) => setFieldValue(`variants.${index}.price`, e.target.value)}
                                  error={Boolean(touched.variants?.[index]?.price && errors.variants?.[index]?.price)}
                                  helperText={touched.variants?.[index]?.price && errors.variants?.[index]?.price}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <input
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  id={`image-upload-${index}`}
                                  type="file"
                                  onChange={(event) => handleImageChange(event, index)}
                                />
                                <label htmlFor={`image-upload-${index}`}>
                                  <TextField
                                    size='small'
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                    value={imagePreviews[index] ? 'Image Selected' : 'Select product image'}
                                    InputProps={{
                                      endAdornment: (
                                        <IconButton color="primary" component="span">
                                          <AttachFile />
                                        </IconButton>
                                      ),
                                    }}
                                  />
                                </label>
                                {imagePreviews[index] && (
                                  <Card sx={{ maxWidth: 400 }}>
                                    <CardMedia
                                      component="img"
                                      height="200"
                                      image={editProduct ? `${baseURL}/uploads/${imagePreviews[index]}` : imagePreviews[index]}
                                      alt="Uploaded Image Preview"
                                    />
                                    <CardContent>
                                      <Typography variant="body2" color="text.secondary">
                                        Uploaded Image Preview
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                )}
                              </Grid>
                              <Grid item xs={12}>
                                <Button variant="outlined" color="error" onClick={() => remove(index)}>
                                  Remove Variant
                                </Button>
                                <br />
                                <br />
                              </Grid>
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Box marginTop="1rem">
                              <Button variant="outlined" onClick={() => push({ size: '', quantity: '', price: '' })}>
                                Add Variant
                              </Button>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </FieldArray>
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="center" marginTop="1rem">
                  <Button
                    sx={{
                      backgroundColor: '#04B17C',
                      color: 'white',
                      padding: '10px',
                      '&:hover': {
                        backgroundColor: '#04B17C',
                      },
                      borderRadius: '20px',
                      fontSize: '15px',
                      width: '13ch',
                    }}
                    size="small"
                    onClick={handleSubmit}
                  >
                    {editProduct ? 'Update' : 'Add'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddProductDialog;
