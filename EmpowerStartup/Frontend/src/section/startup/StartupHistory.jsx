
import {  Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Post } from 'src/actions/API/apiActions';
import { Post_GetAllOrderByUserWithPagination_URL } from 'src/constants/apiURLs';

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
    header: 'Startup Status',
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
        Post_GetAllOrderByUserWithPagination_URL,
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
        <title> Startup History | SE </title>
      </Helmet>
      <Typography variant="h4" ml={2}>
        Orders History
      </Typography>
      <MaterialReactTable
        enableGrouping
        columns={columns || {}}
        data={rows || []}
        rowCount={totalCount || 0}
        manualPagination
        onPaginationChange={setPagination}
        manualFiltering
        onGlobalFilterChange={setSearchString}
        state={{
          pagination,
          searchString,
          isLoading: loadingData,
        }}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error Loading Data',
              }
            : undefined
        }

      />
    </div>
  );
}

export default OrderDetails;
