import { Close, OfflinePin, RemoveRedEye, Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Post } from 'src/actions/API/apiActions';
import { Post_GetAllOrderBySupplierWithPagination_URL, baseURL } from 'src/constants/apiURLs';

// Columns
const columns = [
  {
    accessorKey: 'user.firstName',
    header: 'First Name',
    size: 40,
  },
  {
    accessorKey: 'user.lastName',
    header: 'Last Name',
    size: 40,
  },

  {
    accessorKey: 'user.phone',
    header: 'Phone',
    size: 40,
  },
  {
    accessorKey: 'totalPayment',
    header: 'Payment',
    size: 40,
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
    size: 40,
    // Cell: ({ cell }) => <Box component="span">{cell.getValue() === true ? 'Approved' : 'Not Approved'}</Box>,
  },
];

function OrderDetails(props) {
  const { enqueueSnackbar } = useSnackbar();

  // table State
  const [rows, setRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const getSupplierOrders = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
          _id: localStorage.getItem('userId'),
        },
        Post_GetAllOrderBySupplierWithPagination_URL,
        (resp) => {
          console.log('hjsdfsdfdsf', resp.data);
          setRows(resp.data.orders);
          setIsError(false);
          setLoadingData(false);
          setTotalCount(resp?.data.totalCount);
        },
        (error) => {
          setLoadingData(false);
          setIsError(true);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        }
      );
    } catch (error) {
      setLoadingData(false);
      setIsError(true);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }, [pagination.pageSize, pagination.pageIndex, searchString, enqueueSnackbar]);

  useEffect(() => {
    getSupplierOrders();
  }, []);

  return (
    <div>
      <Helmet>
        <title> Order Details | SE</title>
      </Helmet>
      <Typography variant="h4" ml={2}>
        Orders Details
      </Typography>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 100,
          },
        }}
        enableRowActions
        enableGrouping
        //   initialState={{ columnPinning: { left: ['companyName'], right: ['mrt-row-actions'] }, density: 'compact', grouping: [`companyName`], expanded: true }}
        columns={columns || {}}
        data={rows || []}
        rowCount={totalCount || 0}
        //   positionToolbarAlertBanner="top"
        manualPagination
        onPaginationChange={setPagination}
        manualFiltering
        onGlobalFilterChange={setSearchString}
        state={{
          pagination,
          searchString,
          isLoading: loadingData,
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="right" title="View order details">
              <IconButton
                color="success"
                onClick={() => {
                  setSelectedOrder(row?.original);
                  setOpenOrderDialog(true);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error Loading Data',
              }
            : undefined
        }
        // renderTopToolbarCustomActions={() => (
        //   <>
        //     {/* <Button
        //     sx={{
        //       backgroundColor: '#04B17C',
        //       color: 'white',
        //       padding: '10px',
        //       '&:hover': {
        //         backgroundColor: '#04B17C',
        //       },
        //       fontSize: '13px',
        //       width: '20ch',
        //     }}
        //     size="small"
        //     onClick={() => setOpenStartupTypeDialog(true)}
        //   >
        //     Add Startup Type
        //   </Button> */}
        //   </>
        // )}
      />
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">Ordered Product details </Typography>
            <IconButton onClick={() => setOpenOrderDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Products:</Typography>
                {console.log('kjsfsdfdf', selectedOrder)}
                {selectedOrder?.products?.map((product, index) => (
                  <Card key={index} sx={{ maxWidth: 400 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${baseURL}/uploads/${product?.variants[0]?.image}`}
                      alt={product?.productName}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {product?.productName}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Variants {`(${product?.variants?.length} variants ordered)`}:
                        <br />
                        <ol>
                          {product?.variants?.map((variant, vIndex) => (
                            <li key={vIndex}>
                              {variant?.orderedQuantity !== 0 && (
                                <>
                                  <Typography variant="subtitle1">Size: {variant?.size}</Typography>
                                  <Typography variant="subtitle1">
                                    Ordered Quantity: {variant?.orderedQuantity}
                                  </Typography>
                                  <Typography variant="subtitle1">Price (per unit): {variant?.variantPrice}</Typography>
                                </>
                              )}
                            </li>
                          ))}
                        </ol>
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderDetails;
