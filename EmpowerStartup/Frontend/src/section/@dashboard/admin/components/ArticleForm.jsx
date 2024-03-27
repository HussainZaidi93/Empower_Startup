import React, { useState } from 'react';
import { TextField, Typography, Grid, Card, CardMedia, CardContent, IconButton, Button, Box, Dialog, DialogContent } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Post_AddArticle_URL, Post_UploadImage_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';

const ArticleFormDialog = ({open, onClose,onSubmit}) => {
  const [startupName, setStartupName] = useState('');
  const [articleContent, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [articleImage, setArticleImage] = useState('')
  const handleStartupNameChange = (event) => {
    setStartupName(event.target.value);
  };
  const { enqueueSnackbar } = useSnackbar()
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

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
          const imageName = responseData.serverFileName; // Replace 'imageName' with the actual key in your API response
          setArticleImage(imageName);
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

  const handleSubmitArticle = () => {
    try {
      Post(
        {
          startupName,
          articleContent,
          articleImage
        },
        Post_AddArticle_URL,
        resp => {
          enqueueSnackbar("Article Posted", { variant: 'success' })
          setStartupName('')
          setArticleImage(null)
          setDescription('')
          onSubmit()
        },
        error => {
          enqueueSnackbar("Couldn't Add Article", { variant: 'error' })
        }
      )
    } catch (error) {

    }
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth>
      <DialogContent>
          <Grid container spacing={2} width="100%">
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Donation Article
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Startup Name"
                variant="outlined"
                fullWidth
                value={startupName}
                onChange={handleStartupNameChange}
              />
            </Grid>
            <Grid item xs={12}>
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
                  value={imagePreview ? 'Image Selected' : 'Select Article Image'}
                  InputProps={{
                    endAdornment: (
                      <IconButton color="primary" component="span">
                        <AttachFileIcon />
                      </IconButton>
                    ),
                  }}
                />
              </label>
            </Grid>
            {imagePreview && (
              <Grid item xs={12}>
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia component="img" height="200" image={imagePreview} alt="Uploaded Image Preview" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded Image Preview
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Article Content"
                variant="outlined"
                fullWidth
                multiline
                rows={12}
                value={articleContent}
                onChange={handleDescriptionChange}
              />
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
              onClick={() => handleSubmitArticle()}
            >
              Submit
            </Button>
          </Box>
      </DialogContent>
    </Dialog>

  );
};

export default ArticleFormDialog;
