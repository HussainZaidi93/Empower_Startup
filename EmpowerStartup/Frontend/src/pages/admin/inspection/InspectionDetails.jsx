import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Post_GetAllStartupsWithPagination_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { Refresh, RemoveRedEye } from '@mui/icons-material';
import { ViewStartupDetailsDialog } from '..';

// Columns
const columns = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 40,
  },

  {
    accessorKey: 'startupType',
    header: 'Startup Category',
    size: 40,
  },
  {
    accessorKey: 'suggestionByInspection',
    header: 'Team Suggestion',
    size: 40,
  },
  {
    accessorKey: 'status',
    header: 'Startup Status',
    size: 40,
    Cell: ({ cell }) => <Box component="span">{cell.getValue() === true ? 'Approved' : 'Not Approved'}</Box>,
  },
];

function InspectionDetails() {
  const role = localStorage.getItem('role')
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
  const [viewStartupDetails, setViewStartupDetails] = useState(false);
  const [selectedStartupToView, setSelectedStartupToView] = useState(null);
//   const [suggestionText, setSuggestionText] = useState(null);

  const getAllStartups = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
          role: role,
          isInspected: true
        },
        Post_GetAllStartupsWithPagination_URL,
        (resp) => {
          setIsError(false);
          setLoadingData(false);
          setRows(resp?.data?.startups);
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
    getAllStartups();
  }, [getAllStartups]);

  // Add delete button
  return (
    <div>
      {role === 'Inspector' && <Typography variant='h6' m={2}>Inspected Startups</Typography>}
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
        positionToolbarAlertBanner="top"
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
          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Tooltip arrow placement="right" title="View details">
              <IconButton
                color="info"
                onClick={() => {
                  setSelectedStartupToView(row?.original);
                  setViewStartupDetails(true);
                }}
              >
                <RemoveRedEye />
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
        renderTopToolbarCustomActions={() => (
          <Box display='flex' justifyContent='center'>
            <Button
              sx={{
                backgroundColor: '#04B17C',
                color: 'white',
                padding: '10px',
                '&:hover': {
                  backgroundColor: '#04B17C',
                },
                fontSize: '13px',
                width: '20ch',
              }}
              size="small"
              onClick={() => getAllStartups()}
            >
              <Refresh fontSize='small' /> Refresh Data
            </Button>
          </Box>
        )}
      />

      {/* <AddStartupTypeDialog open={openStartupTypeDialog} onClose={() => setOpenStartupTypeDialog(false)} />*/}
      <ViewStartupDetailsDialog
        open={viewStartupDetails}
        onClose={() => setViewStartupDetails(false)}
        startupDetails={selectedStartupToView}
        onStatusImageStatusChange={()=>getAllStartups()}

      /> 

      {/* <ActionConfirmationDialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        title="Approve Startup"
        color='green'
        ActionConfirmationText="Are  you sure , you want to approve this startup?"
        actionButtonText="Yes !"
        actionCancellationText="No"
        onSubmit={() => handleApproveStartup()}
      />
      <ActionConfirmationDialog
        open={openDeleteStartup}
        onClose={() => setOpenDeleteStartup(false)}
        title="Delete Startup"
        color='red'
        ActionConfirmationText="Are  you sure , you want to delete this startup?"
        actionButtonText="Yes"
        actionCancellationText="No"
        onSubmit={() => handleDeleteStartup()}
      />

      <Dialog open={openAddSuggestionDialog} onClose={() => setOpenAddSuggestionDialog(false)}>
        <DialogTitle>Enter Suggestion</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="suggestion"
            label="Suggestion"
            type="text"
            fullWidth
            multiline
            maxRows={4}
            value={suggestionText}
            onChange={e => setSuggestionText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSuggestionDialog(false)} color="primary">
            Cancel
          </Button>
          <Button sx={{
            backgroundColor: '#04B17C',
            color: 'white',
            padding: '10px',
            '&:hover': {
              backgroundColor: '#04B17C',
            },
            fontSize: '13px',
            width: '20ch',
            marginLeft: '1rem'
          }} disabled={!suggestionText} onClick={() => handleSuggestion(suggestionText)} color="info">
            Submit
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}

export default InspectionDetails;
