import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import { Post_ListSuppliersForUser_URL } from 'src/constants/apiURLs';
import { logoImage } from 'src/images';
import OrderProducts from './OrderProducts';

export const SupplierContext = createContext()
function PlaceOrder(props) {
  const userId = localStorage.getItem("userId")
  const [suppliers, setSuppliers] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const getSuppliersForUser = useCallback(() => {
    try {
      Post(
        { userId },
        Post_ListSuppliersForUser_URL,
        resp => {
          setSuppliers(resp?.data)
        },
        error => {
          enqueueSnackbar("cannot load suppliers", { variant: "error" })
        }
      )
    } catch (error) {
      enqueueSnackbar("cannot load suppliers", { variant: "error" })
    }
  }, [userId])

  useEffect(() => { getSuppliersForUser() }, [getSuppliersForUser])

  const handleSelectedSupplier = (supplier) => {
    setSelectedSupplier(supplier)
  }
  return (
    <div>
      <Typography variant="h4"> Suppliers found for your Business  </Typography>
      {!selectedSupplier &&
        <Grid container spacing={2} justifyContent="space-around">
          {suppliers.map(supplier => (
            <Grid key={supplier?.authToken} item xs={12} sm={12} md={3} lg={3}>
              <Card sx={{ border: '1px solid #ccc' }}>
                <CardMedia component="img" alt="Sample Image" height="200" image={logoImage} />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ marginLeft: '100px' }}>
                    {`${supplier?.firstName} ${supplier?.lastName}`}
                  </Typography>
                  <Box marginTop="15px" display="flex" justifyContent="center">
                    <Button
                      sx={{
                        backgroundColor: '#04B17C',
                        color: 'white',
                        padding: '5px',
                        '&:hover': {
                          backgroundColor: '#04B17C',
                        },
                        width: '14ch',
                        fontSize: '12px',
                        marginLeft: '30px',
                      }}
                      size="small"
                      onClick={() => handleSelectedSupplier(supplier)}
                    >
                      Select
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      }
      {selectedSupplier &&
        <SupplierContext.Provider value={selectedSupplier}>
          <OrderProducts supplierId={selectedSupplier?._id} />
        </SupplierContext.Provider>
      }
    </div>
  );
}
export default PlaceOrder;