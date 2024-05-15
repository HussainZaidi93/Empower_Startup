import { CircularProgress, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Post } from 'src/actions/API/apiActions';
import { Post_GetAllStartUpSalesAuditsWithPagination_URL } from 'src/constants/apiURLs';

function PlaceAudit(props) {
  // Columns
  const columns = [
    {
      accessorKey: 'startupId.firstName',
      header: 'Fisrt Name',
      size: 40,
    },
    {
      accessorKey: 'startupId.lastName',
      header: 'Last Name',
      size: 40,
    },
    {
      accessorKey: 'startupId.startupType',
      header: 'Startup Name',
      size: 40,
    },
    {
      accessorKey: 'startupId.address',
      header: 'Owner Name',
      size: 40,
    },
    {
      accessorKey: 'auditorFeedback',
      header: 'Feedback',
      size: 40,
    },
    {
      accessorKey: 'auditDate',
      header: 'Audit Date',
      size: 40,
    },
  ];
  const userId = localStorage.getItem('userId');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [data, setData] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const getAllPlacedAudits = useCallback(() => {

    setLoadingData(true);
    try {
      Post(
        {
          auditorId: userId,
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
        },
        Post_GetAllStartUpSalesAuditsWithPagination_URL,
        (resp) => {
          setData(resp?.data?.audits);
          setTotalRowCount(resp?.data?.totalCount);
        },
        (error) => {
          console.error(error);
        },
        () => {
          setLoadingData(false);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }, [pagination, searchString, userId]);

  useEffect(() => {
    getAllPlacedAudits();
  }
    , [getAllPlacedAudits]);
  return (
    <div>
      <Helmet>
        <title> Place Audit | SE</title>
      </Helmet>
      <br />
      <Typography variant="h4" gutterBottom>
        Placed Audit
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={data}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        // enableRowActions
        rowCount={totalRowCount}
        manualPagination
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearch={(searchString) => setSearchString(searchString)}
        state={{
          pagination,
        }}
        positionToolbarAlertBanner="bottom"
      // renderRowActions={({ row, table }) => (
      //   <Box sx={{ display: 'flex', gap: '1rem' }}>
      //     <Tooltip arrow placement="left" title="Edit">
      //       <IconButton color='info' onClick={() => {}}>
      //         <Edit />
      //       </IconButton>
      //     </Tooltip>
      //     <Tooltip arrow placement="right" title="Delete">
      //       <IconButton color="error" onClick={() => {}}>
      //         <Delete />
      //       </IconButton>
      //     </Tooltip>
      //   </Box>
      // )}
      // renderTopToolbarCustomActions={() => (
      //   <Button variant='contained'>
      //     Add New Donor
      //   </Button>
      // )}
      />
    </div>
  );
}

export default PlaceAudit;
