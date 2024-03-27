import { AttachFile, Close, DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import ActionConfirmationDialog from 'src/components/ActionConfrimationDialog';
import {
  Post_AddStartupType_URL,
  Post_DeleteStartupType_URL,
  Post_GetAllStartupTypes_URL,
  Post_UploadImage_URL,
} from 'src/constants/apiURLs';

function AddStartupTypeDialog({ open, onClose }) {
  const [startupName, setStartupName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [startupLogo, setStartupLogo] = useState('');
  const [startupTypes, setStartupTypes] = useState([]);
  const [startupTypeId, setStartupTypeId] = useState();
  const [openDeleteStartupTypeDialog, setOpenDeleteStartupTypeDialog] = useState(false);

  const handleAdd = () => {
    try {
      Post(
        {
          startupName,
          startupLogo,
        },
        Post_AddStartupType_URL,
        (resp) => {
          enqueueSnackbar('Startup added', { variant: 'success' });
          onClose();
          setStartupName('')
          setImagePreview('')
          getAllStartupTypes()
        },
        (error) => {
          enqueueSnackbar('Startup cannot be added', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Somethign went wrong', { variant: 'success' });
    }
  };
  const { enqueueSnackbar } = useSnackbar();
  const getAllStartupTypes = useCallback(() => {
    try {
      Post(
        {},
        Post_GetAllStartupTypes_URL,
        (resp) => {
          console.log('ffee', resp.data);
          setStartupTypes(resp?.data.data);
          // enqueueSnackbar('Startup types loaded', {variant : 'success'})
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
  }, [getAllStartupTypes]);

  const handleDeleteStartupType = () => {
    try {
      Post(
        {
          id: startupTypeId,
        },
        Post_DeleteStartupType_URL,
        (resp) => {
          enqueueSnackbar('Startup type deleted', { variant: 'success' });
          setOpenDeleteStartupTypeDialog(false);
          getAllStartupTypes();
        },
        (error) => {
          enqueueSnackbar('Startup cannot be deleted', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Somethign went wrong', { variant: 'success' });
    }
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
          setStartupLogo(imageName);
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
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle id="form-dialog-title">
          {' '}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Add Startup Type</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="startupName"
            label="Startup Type"
            type="text"
            fullWidth
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
          />
          <br />
          <Box sx={{ width: '100%' }}>
            {/* <UploadImage 
                  onSubmit={(fileName) => setFieldValue('profileImage', fileName)} /> */}
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
                value={imagePreview ? 'Image Selected' : 'Select profile image'}
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
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview ? imagePreview : startupLogo}
                  alt="Uploaded Image Preview"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded Image Preview
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
          <br />

          {startupTypes && (
            <>
              <Typography variant="h6">List of added Startup Types</Typography>
              <Box display="flex" marginTop="15px" marginLeft="1rem">
                <ul style={{ listStyleType: 'square', fontWeight: '600' }}>
                  {startupTypes?.map((type) => {
                    return (
                      <li style={{ paddingBottom: '10px' }}>
                        <Tooltip arrow placement="right" title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setStartupTypeId(type?._id);
                              setOpenDeleteStartupTypeDialog(true);
                            }}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                        {type?.startupName}
                      </li>
                    );
                  })}
                </ul>
              </Box>
            </>
          )}

          <Box display="flex" justifyContent="center">
            <Button
              onClick={handleAdd}
              color="primary"
              sx={{
                backgroundColor: '#04B17C',
                color: 'white',
                padding: '5px',
                '&:hover': {
                  backgroundColor: '#04B17C',
                },
                borderRadius: '5px',
                fontSize: '15px',
                width: '10ch',
              }}
            >
              Add
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ActionConfirmationDialog
        title="Delete Startup Type"
        ActionConfirmationText="Are you sure you want to delete this startup type?"
        actionButtonText="Delete"
        color="red"
        actionCancellationText="Cancel"
        actionPermormingText="Wait ! Deleting . . ."
        open={openDeleteStartupTypeDialog}
        onClose={() => setOpenDeleteStartupTypeDialog(false)}
        onSubmit={() => handleDeleteStartupType()}
      />
    </>
  );
}

export default AddStartupTypeDialog;
