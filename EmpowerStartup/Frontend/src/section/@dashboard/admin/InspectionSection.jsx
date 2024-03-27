import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { AccountCircleOutlined, AssignmentInd, Delete, Edit, NoAccounts } from '@mui/icons-material';
import AssignAuditorDialog from './components/AssignAuditorDialog';
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
  const [openAssignAuditorDialog, setOpenAssignAuditorDialog] = useState(false);


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
  const [openAddAuditorDialog, setOpenAddAuditorDialog] = useState(false);
  const [editAuditorDetails, setEditAuditorDetails] = useState(null);
  const [openDeleteAuditor, setOpenDeleteAuditor] = useState(false);
  const [deleteAuditor, setDeleteAuditor] = useState(null);
  const [selectedAuditor, setSelectedAuditor] = useState(null);

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

  const handleAddAuditor = (values, actions) => {
    values.role = 'Inspector';
    if (!editAuditorDetails) {
      values.isAdminApproved = true
      values.isVarified = true
    }
    try {
      Post(
        values,
        editAuditorDetails ? Post_UpdateUser_URL : Post_RegisterUser_URL,
        (resp) => {
          // getRoleBasedUsers();
          actions.setSubmitting(false);
          actions.resetForm();
          getRoleBasedUsers();
          setOpenAddAuditorDialog(false);
          if (editAuditorDetails) {
            actions.resetForm();
            enqueueSnackbar('Auditor details updated successfully', { variant: 'success' });
          } else {
            enqueueSnackbar('Auditor Added', {
              variant: 'success',
            });
          }
        },
        (error) => {
          console.log('errr', error);
          setOpenAddAuditorDialog(false);
          actions.setSubmitting(false);

          enqueueSnackbar('Can not add auditor', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const handleDeleteAuditor = () => {
    try {
      Post(
        { id: deleteAuditor?._id },
        Post_DeleteUser_URL,
        (resp) => {
          getRoleBasedUsers();
          setOpenDeleteAuditor(false);
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
    console.log("user", user);
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
                  setEditAuditorDetails(row?.original);
                  setOpenAddAuditorDialog(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  setDeleteAuditor(row?.original);
                  setOpenDeleteAuditor(true);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Assign Startup">
              <IconButton color="error" onClick={() => {
                setSelectedAuditor(row?.original)
                setOpenAssignAuditorDialog(true)
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
              setEditAuditorDetails(null);
              setOpenAddAuditorDialog(true);
            }}
          >
           Add Inspector
          </Button>
        )}
      />

      <AssignAuditorDialog open={openAssignAuditorDialog} onClose={() => setOpenAssignAuditorDialog(false)}
        selectedAuditor={selectedAuditor}
      />

      <UpsertUserDetailsDialog
        open={openAddAuditorDialog}
        onClose={() => setOpenAddAuditorDialog(false)}
        onSubmit={(values, actions) => handleAddAuditor(values, actions)}
        editUser={editAuditorDetails}
        role='Inspector'
      />

      <ActionConfirmationDialog
        open={openDeleteAuditor}
        onClose={() => setOpenDeleteAuditor(false)}
        title="Delete Inspector"
        color='red'
        ActionConfirmationText="Are  you sure , you want to delete this Inspector?"
        actionButtonText="Yes delete !"
        actionCancellationText="No"
        onSubmit={() => handleDeleteAuditor()}
      />
    </>
  );
}
