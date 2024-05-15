import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { AccountCircleOutlined, AssignmentInd, Delete, Edit, NoAccounts } from '@mui/icons-material';
import { UpsertUserDetailsDialog } from '.';
import {
  Post_ChangeUserStatus_URL,
  Post_DeleteUser_URL,
  Post_GetRoleBasedUser_URL,
  Post_RegisterUser_URL,
  Post_UpdateUser_URL,
} from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';
import { Post } from 'src/actions/API/apiActions';
import ActionConfirmationDialog from 'src/components/ActionConfrimationDialog';
import AssignInspectorDialog from './components/AssignInspectorDialog';

// Columns
const columns = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 40,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 40,
  },

  {
    accessorKey: 'phone',
    header: 'Phone',
    size: 40,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    size: 40,
  },
  {
    accessorKey: 'isAdminApproved',
    header: 'Status',
    size: 40,
    Cell: ({ cell }) => <Box component="span">{cell.getValue() === true ? 'Activated' : 'Deactivated'}</Box>,
  }
];

export default function InspectionSection() {
  const { enqueueSnackbar } = useSnackbar();
  // const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of rows per page
  const [totalRowCount] = useState(50); // Total number of rows
  const [openAssignInspectorDialog, setOpenAssignInspectorDialog] = useState(false);


  //table states
  const [rows, setRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [openAddInspectorDialog, setOpenAddInspectorDialog] = useState(false);
  const [editInspectorDetails, setEditInspectorDetails] = useState(null);
  const [openDeleteInspector, setOpenDeleteInspector] = useState(false);
  const [deleteInspector, setDeleteInspector] = useState(null);
  const [selectedInspector, setSelectedInspector] = useState(null);

  const getRoleBasedUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
          role: 'Inspector',
        },
        Post_GetRoleBasedUser_URL,
        (resp) => {
          setIsError(false);
          setLoadingData(false);
          setRows(resp?.data?.users);
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
    getRoleBasedUsers();
  }, [getRoleBasedUsers]);

  const handleAddInspector = (values, actions) => {
    values.role = 'Inspector';
    if (!editInspectorDetails) {
      values.isAdminApproved = true
      values.isVarified = true
    }
    try {
      Post(
        values,
        editInspectorDetails ? Post_UpdateUser_URL : Post_RegisterUser_URL,
        (resp) => {
          // getRoleBasedUsers();
          actions.setSubmitting(false);
          actions.resetForm();
          getRoleBasedUsers();
          setOpenAddInspectorDialog(false);
          if (editInspectorDetails) {
            actions.resetForm();
            enqueueSnackbar('Inspector details updated successfully', { variant: 'success' });
          } else {
            enqueueSnackbar('Inspector Added', {
              variant: 'success',
            });
          }
        },
        (error) => {
          setOpenAddInspectorDialog(false);
          actions.setSubmitting(false);

          enqueueSnackbar('Can not add Inspector', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const handleDeleteInspector = () => {
    try {
      Post(
        { id: deleteInspector?._id },
        Post_DeleteUser_URL,
        (resp) => {
          getRoleBasedUsers();
          setOpenDeleteInspector(false);
          enqueueSnackbar('Inspector deleted !', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Inspector can not be deleted, May be user was not found', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const handleUserStatusToggle = (user, status) => {
    try {
      Post(
        { userId: user, status: status },
        Post_ChangeUserStatus_URL,
        (resp) => {
          // Update the icon button based on the returned status
          const newStatus = resp.data.status;
          const updatedData = [...rows]; // Assuming you have some data array
          const index = updatedData.findIndex(item => item._id === user);
          updatedData[index].isAdminApproved = newStatus;
          setRows(updatedData); // Assuming you're using React state
          if (newStatus === true) {
            enqueueSnackbar('User activate', { variant: 'success' });
          } else {
            enqueueSnackbar('User deactivate', { variant: 'success' });
          }
        },
        (error) => {
          enqueueSnackbar('Can not change user status', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={rows}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 100,
          },
        }}
        enableRowActions
        manualPagination
        rowCount={totalRowCount}
        // currentPage={currentPage}
        pageSize={pageSize}
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
        // onPageChange={(newPage) => setCurrentPage(newPage)}
        positionToolbarAlertBanner="top"
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                color="info"
                onClick={() => {
                  setEditInspectorDetails(row?.original);
                  setOpenAddInspectorDialog(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  setDeleteInspector(row?.original);
                  setOpenDeleteInspector(true);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Assign Startup">
              <IconButton color="error" onClick={() => {
                setSelectedInspector(row?.original)
                setOpenAssignInspectorDialog(true)
              }}>
                <AssignmentInd />
              </IconButton>
            </Tooltip>
            {row.original.isAdminApproved === true ? (
              <Tooltip arrow placement="right" title="Deactivate">
                <IconButton color="secondary" onClick={() => handleUserStatusToggle(row.original._id, false)}>
                  <AccountCircleOutlined />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip arrow placement="right" title="Activate">
                <IconButton color="primary" onClick={() => handleUserStatusToggle(row.original._id, true)}>
                  <NoAccounts />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#04B17C',
              color: 'white',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              fontSize: '13px',
              width: '13ch',
            }}
            onClick={() => {
              setEditInspectorDetails(null);
              setOpenAddInspectorDialog(true);
            }}
          >
            Add Inspector
          </Button>
        )}
      />

      {openAssignInspectorDialog && <AssignInspectorDialog open={openAssignInspectorDialog} onClose={() => setOpenAssignInspectorDialog(false)}
        selectedInspector={selectedInspector}
      />}

      <UpsertUserDetailsDialog
        open={openAddInspectorDialog}
        onClose={() => setOpenAddInspectorDialog(false)}
        onSubmit={(values, actions) => handleAddInspector(values, actions)}
        editUser={editInspectorDetails}
        role='Inspector'
      />

      <ActionConfirmationDialog
        open={openDeleteInspector}
        onClose={() => setOpenDeleteInspector(false)}
        title="Delete Inspector"
        color='red'
        ActionConfirmationText="Are  you sure , you want to delete this Inspector?"
        actionButtonText="Yes delete !"
        actionCancellationText="No"
        onSubmit={() => handleDeleteInspector()}
      />
    </>
  );
}
