import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Post_GetAllDonations_URL } from 'src/constants/apiURLs';
import { Get, Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';

// Columns
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 40,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 40,
  },
  {
    accessorKey: 'country',
    header: 'Country',
    size: 40,
  },
  {
    accessorKey: 'city',
    header: 'City',
    size: 40,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 40,
  },
  {
    accessorKey: 'donationAmount',
    header: 'Amount',
    size: 40,
  },
];

export default function DonationsSection() {
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

  const getAllDonators = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
        },
        Post_GetAllDonations_URL,
        (resp) => {
          console.log('hjsdfsdfdsf', resp?.data);
          setRows(resp?.data?.donations);
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
    getAllDonators();
  }, []);

  return (
    <>
      <Typography variant='h6' ml={2}>Donations</Typography>

      <MaterialReactTable
        columns={columns}
        data={rows}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
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
      />
    </>
  );
}
