import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { Get, Post } from 'src/actions/API/apiActions';
import { Post_GetAllAuditorStartups_URL } from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Delete, Edit, Verified } from '@mui/icons-material';
import { AuditProductsDialog, PlaceAuditDialog } from '.';

function AuditorHomeSection(props) {
  const userId = localStorage.getItem('userId');
  const { enqueueSnackbar } = useSnackbar();
  // table State
  const [loadingData, setLoadingData] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [startups, setStartups] = useState([]);
  const [openPlaceAuditDialog, setOpenPlaceAuditDialog] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [allStartups, setAllStartups] = useState([]);

  const columns = [
    {
      accessorKey: 'startupType',
      header: 'Startup Name',
      size: 40,
    },
    {
      accessorKey: 'fullName',
      header: 'Owner Name',
      size: 40,
    },
    {
      accessorKey: 'address',
      header: 'Location',
      size: 40,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 40,
    },
  ];

  // Get all audits
  const getAudits = useCallback(() => {
    setLoadingData(true);
    try {
      Post(
        {
          auditorId: userId,
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
        },
        Post_GetAllAuditorStartups_URL,
        (resp) => {
          setAllStartups(resp?.data?.startups)
          const data = resp?.data.startups.map((startup) => ({
            startupType: startup?.startupInfo?.middleName,
            fullName: `${startup?.startupInfo?.firstName} ${startup?.startupInfo?.lastName}`,
            address: `${startup?.startupInfo?.city}, ${startup?.startupInfo?.address}`,
            date: startup?.date,
            userId: `${startup?.startupInfo?.userId}`,
            startupId: `${startup?.startupInfo?._id}`
          }));
          setStartups(data);
          setIsError(false);
          setLoadingData(false);
          setTotalCount(resp?.data?.totalCount);
        },
        (error) => {
          setLoadingData(false);
          setIsError(true);
          enqueueSnackbar(error?.response?.data?.message || 'No startups found', { variant: 'error' });
        }
      );
    } catch (error) {
      setLoadingData(false);
      setIsError(true);
      enqueueSnackbar('Something went wrong at the server', { variant: 'error' });
    }
  }, [userId, pagination, searchString]);


  useEffect(() => {
    getAudits();
  }, [getAudits]);
  console.log('startups', selectedStartup, startups)
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Auditor Home
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={startups}
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
        onPaginationChange={setPagination}
        manualFiltering
        rowCount={totalCount}
        onGlobalFilterChange={setSearchString}
        positionToolbarAlertBanner="bottom"
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Place Audit">
              <IconButton color="info" onClick={() => {
                setSelectedStartup(row?.original)
                setOpenPlaceAuditDialog(true)
              }}>
                <Verified />
              </IconButton>
            </Tooltip>
            {/* <Tooltip arrow placement="left" title="Edit">
              <IconButton color="info" onClick={() => { }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => { }}>
                <Delete />
              </IconButton>
            </Tooltip> */}
          </Box>
        )}
      />
      {
        openPlaceAuditDialog &&
        <AuditProductsDialog
          open={openPlaceAuditDialog}
          onClose={() => setOpenPlaceAuditDialog(false)}
          userId={selectedStartup !== 'undefined' && selectedStartup?.userId}
          startupId={selectedStartup !== 'undefined' && selectedStartup?.startupId}
        />
      }

      {/* <AuditProductsDialog/> */}
    </div>
  );
}

export default AuditorHomeSection;
