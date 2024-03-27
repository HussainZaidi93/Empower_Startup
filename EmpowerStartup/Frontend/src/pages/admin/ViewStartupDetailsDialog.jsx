import { Close } from '@mui/icons-material';
import { Backdrop, Box, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, Grid, IconButton, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { baseURL } from 'src/constants/apiURLs';

function ViewStartupDetailsDialog({ open, onClose, startupDetails }) {
  console.log('details', startupDetails);
  const [expandedImage, setExpandedImage] = useState(null);

  const handleImageClick = (image) => {
    setExpandedImage(image);
  };

  const handleCloseModal = () => {
    setExpandedImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">Startup Details</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography variant="h5">
            <strong>Innovator Name:</strong> {startupDetails?.firstName} {startupDetails?.lastName}
          </Typography>
          <Typography variant="h5">
            <strong>Innovator Country:</strong> {startupDetails?.country}
          </Typography>
          <Typography variant="h5">
            <strong>Innovator City:</strong> {startupDetails?.city}
          </Typography>
          <Typography variant="h5">
            <strong>Innovator Address:</strong> {startupDetails?.address}
          </Typography>
          <Typography variant="h5">
            <strong>Requested Startup Type:</strong> {startupDetails?.startupType}
          </Typography>
          <Typography variant="h5">
            <strong>Startup Short Description:</strong> {startupDetails?.shortDescription}
          </Typography>
          <Typography variant="h5">
            <strong>Startup Detailed Description:</strong> {startupDetails?.detailedDescription}
          </Typography>
          <Typography variant="h5">
            <strong>Attached documents:</strong>
          </Typography>
          <br />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {startupDetails?.cnicFront && (
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${baseURL}/uploads/${startupDetails.cnicFront}`}
                    alt="CNINC Front side preview"
                    onClick={() => handleImageClick(`${baseURL}/uploads/${startupDetails.cnicFront}`)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      CNINC Front side preview
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {startupDetails?.cnicBack && (
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${baseURL}/uploads/${startupDetails.cnicBack}`}
                    alt="CNINC Back side preview"
                    onClick={() => handleImageClick(`${baseURL}/uploads/${startupDetails.cnicBack}`)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      CNINC Back side preview
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {startupDetails?.elctircityBill && (
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${baseURL}/uploads/${startupDetails.elctircityBill}`}
                    alt="Electricity Bill preview"
                    onClick={() => handleImageClick(`${baseURL}/uploads/${startupDetails.elctircityBill}`)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Electricity Bill preview
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {startupDetails?.utilityBill && (
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${baseURL}/uploads/${startupDetails.utilityBill}`}
                    alt="Utility bill preview"
                    onClick={() => handleImageClick(`${baseURL}/uploads/${startupDetails.utilityBill}`)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Utility bill preview
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {startupDetails?.recentImage && (
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${baseURL}/uploads/${startupDetails.recentImage}`}
                    alt="Recent image preview"
                    onClick={() => handleImageClick(`${baseURL}/uploads/${startupDetails.recentImage}`)}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Recent image preview
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
        <Modal
          open={!!expandedImage}
          onClose={handleCloseModal}
          aria-labelledby="expanded-image-modal"
          aria-describedby="expanded-image-modal-description"
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={handleCloseModal}
          >
            <img
              src={expandedImage}
              alt="Expanded Image"
              style={{ width: '100%', height: '80%', objectFit: 'contain' }}
            />
          </div>
        </Modal>
      </DialogContent>
    </Dialog>
  );
}

export default ViewStartupDetailsDialog;
