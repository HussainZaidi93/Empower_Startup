import { Delete, Visibility } from "@mui/icons-material";
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Tooltip, IconButton } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Post } from "src/actions/API/apiActions";
import { Post_GetAllArcticles_URL, Post_GetAllOrders_URL, baseURL } from "src/constants/apiURLs";

// Columns
// Columns
const columns = [
    // {
    //     accessorKey: '_id',
    //     header: 'Order ID',
    //     size: 40,
    // },
    {
        accessorKey: 'orderDate',
        header: 'Order Date',
        size: 40,
    },
    {
        accessorKey: 'user.email',
        header: 'User Email',
        size: 40,
    },
    {
        accessorKey: 'supplier.email',
        header: 'Supplier Email',
        size: 40,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        size: 40,
    },
    {
        accessorKey: 'totalPayment',
        header: 'Total Payment',
        size: 40,
    },
    {
        accessorKey: 'address',
        header: 'Address',
        size: 40,
    },
    // {
    //     accessorKey: 'recieptImage',
    //     header: 'Receipt Image',
    //     size: 40,
    //     Cell: ({ cell }) => (
    //         <img src={`${baseURL}$/uploads/${cell.getValue()}`} alt="Receipt" style={{ width: '50px', height: '50px' }} />
    //     )
    // },
];

// Rest of the component remains the same


function Orders() {
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

    const openOrderDetailsDialog = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetailsDialog = () => {
        setSelectedOrder(null);
    };

    const getAllDonators = useCallback(() => {
        setLoadingData(true);
        try {
            Post(
                {
                    pageSize: pagination?.pageSize,
                    pageNumber: pagination?.pageIndex,
                    searchString: searchString,
                },
                Post_GetAllOrders_URL,
                (resp) => {
                    setRows(resp?.data?.orders);
                    setIsError(false);
                    setLoadingData(false);
                    setTotalCount(resp?.data?.totalCount);
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
        getAllDonators();
    }, []);

    return (
        <>
            <Typography variant='h6' ml={2}>Orders</Typography>

            <MaterialReactTable
                columns={columns}
                data={rows}
                rowCount={totalCount}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                enableRowActions
                manualPagination
                onPaginationChange={setPagination}
                manualFiltering
                onGlobalFilterChange={setSearchString}
                state={{
                    pagination,
                    searchString,
                    isLoading: loadingData,
                }}
                positionToolbarAlertBanner="bottom"
                renderRowActions={({row}) => (
                    <Box>
                        {/* add delete icon for article delete */}
                        <Tooltip title="View Order Details">
                            <IconButton onClick={() => openOrderDetailsDialog(row.original)}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
                }
            />

<Dialog
        open={selectedOrder !== null}
        onClose={closeOrderDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography variant="h6">Order ID: {selectedOrder?._id}</Typography>
              <Typography variant="body1">Order Date: {selectedOrder?.orderDate}</Typography>
              <Typography variant="body1">Total Payment: {selectedOrder?.totalPayment}</Typography>
              <Typography variant="body1">Status: {selectedOrder?.status}</Typography>
              <Typography variant="body1">Address: {selectedOrder?.address}</Typography>
              {/* Render products and their variants */}
              {selectedOrder?.products?.map((product) => (
                <div key={product?._id?._id}>
                  <Typography variant="subtitle1">Product: {product?._id?.productName}</Typography>
                  {product?.variants?.map((variant) => (
                    <div key={variant?._id}>
                      <Typography variant="body2">
                        Variant: {variant?.size} - Ordered Quantity: {variant?.orderedQuantity}
                      </Typography>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOrderDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </>
    );
}
export default Orders;
