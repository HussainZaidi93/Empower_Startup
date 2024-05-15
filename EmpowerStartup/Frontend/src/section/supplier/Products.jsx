import { Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Post } from 'src/actions/API/apiActions';
import ActionConfirmationDialog from 'src/components/ActionConfrimationDialog';
import { Post_DeleteProductById_URL, Post_GetAllProductsBySupplierWithPagination_URL, baseURL } from 'src/constants/apiURLs';

// Columns
const columns = [
  {
    accessorKey: 'productName',
    header: 'Product Name',
    size: 40,
  },
  {
    accessorKey: 'productType',
    header: 'Product Type',
    size: 40,
  },
];

function SupplierProducts(props) {
  const { enqueueSnackbar } = useSnackbar();

  // table State
  const [rows, setRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [deleteProduct, setDeleteProduct] = useState(null);
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
        Post_GetAllProductsBySupplierWithPagination_URL,
        (resp) => {
          setRows(resp.data.products);
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

  const handleDeleteProduct = () => {
    try {
      Post(
        { id: deleteProduct },
        Post_DeleteProductById_URL,
        (resp) => {
          getSupplierOrders();
          setOpenDeleteProductDialog(false);
          enqueueSnackbar('Product deleted successfully', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Product can not be deleted', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  return (
    <div>
      <Helmet>
        <title> Products | SE</title>
      </Helmet>
      <Typography variant="h4" ml={2}>
        Products
      </Typography>
      <br/>
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
            <Tooltip arrow title="Delete" placement='top'>
              <IconButton
                color="error"
                onClick={() => {
                  setDeleteProduct(row?.original)
                  setOpenDeleteProductDialog(true)
                }}
              >
                <Delete />
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
      />
      <Dialog open={openOrderDialog} onClose={()=>setOpenOrderDialog(false)}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Products:</Typography>
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
                      <Typography variant="body2" color="text.secondary">
                        Variants:
                        {product?.variants?.map((variant, vIndex) => (
                          <Box key={vIndex} component="div">
                            {variant?.quantity !== 0 && < Typography > Quantity: {variant?.quantity}, Price: {variant?.price}</Typography>}
                          </Box>
                        ))}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenOrderDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


      <ActionConfirmationDialog
          open={openDeleteProductDialog}
          color="red"
          onClose={() => setOpenDeleteProductDialog(false)}
          title="Delete Product"
          ActionConfirmationText="Are  you sure , you want to delete this product?"
          actionButtonText="Yes delete !"
          actionCancellationText="No"
          onSubmit={() => handleDeleteProduct()}
        />
    </div>
  );
}

export default SupplierProducts;
