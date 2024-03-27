import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { AccountCircleOutlined, Delete, Edit, NoAccounts } from '@mui/icons-material';
import {
  Post_ChangeUserStatus_URL,
  Post_DeleteUser_URL,
  Post_GetRoleBasedUser_URL,
  Post_RegisterUser_URL,
  Post_UpdateUser_URL,
} from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';
import ActionConfirmationDialog from 'src/components/ActionConfrimationDialog';
import { UpsertUserDetailsDialog } from '.';

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
    accessorKey: 'email',
    header: 'Email',
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

export default function SupplierSection() {
  const [openSuuplierDialog, setOpenSupplierDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [rows, setRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [openDeleteSupplierDialog, setOpenDeleteSupplierDialog] = useState(false);
  const [selectedSupplierToDelete, setSelectedSupplierToDelete] = useState(null);
  const [editSupplier, setEditSupplier] = useState(null);

  const getRoleBasedUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
          role: 'Supplier',
        },
        Post_GetRoleBasedUser_URL,
        (resp) => {
          console.log('supplierfdf', resp.data);
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

  const handleAddSupplier = (values, actions) => {
    values.role = 'Supplier';
    if (!editSupplier) {
      values.isAdminApproved = true
      values.isVarified = true
    }
    Post(
      values,
      editSupplier ? Post_UpdateUser_URL : Post_RegisterUser_URL,
      (resp) => {
        getRoleBasedUsers();
        actions.setSubmitting(false);
        actions.resetForm();
        setOpenSupplierDialog(false);
        if (editSupplier) {
          actions.resetForm();
          enqueueSnackbar('Supplier details updated successfully', { variant: 'success' });
        } else {
          enqueueSnackbar('Supplier Added', {
            variant: 'success',
          });
        }
      },
      (error) => {
        console.log('errr', error);
        setOpenSupplierDialog(false);
        actions.setSubmitting(false);
        if (error?.message?.includes('409')) {
          enqueueSnackbar('No more then one admin is allowed', { variant: 'error' });
        } else {
          enqueueSnackbar(error?.response?.data?.message || 'Cannot register supplier', { variant: 'error' });
        }
      }
    );
  };

  const handleDeleteSupplier = () => {
    try {
      Post(
        { id: selectedSupplierToDelete?._id },
        Post_DeleteUser_URL,
        (resp) => {
          getRoleBasedUsers();
          setOpenDeleteSupplierDialog(false);
          enqueueSnackbar('Supplier deleted successfully', { variant: 'success' });
        },
        (error) => {
          enqueueSnackbar('Supplier can not be deleted, May be user was not found', { variant: 'error' });
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
            enqueueSnackbar('User activated', { variant: 'success' });
          } else {
            enqueueSnackbar('User deactivated', { variant: 'success' });
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                color="info"
                onClick={() => {
                  setEditSupplier(row?.original);
                  setOpenSupplierDialog(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedSupplierToDelete(row?.original);
                  setOpenDeleteSupplierDialog(true);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            {row.original.isAdminApproved === true? (
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
            size="small"
            onClick={() => {
              setEditSupplier(null);
              setOpenSupplierDialog(true);
            }}
          >
            Add Supplier
          </Button>
        )}
      />

      <br />
      <UpsertUserDetailsDialog
        open={openSuuplierDialog}
        onClose={() => setOpenSupplierDialog(false)}
        onSubmit={(values, actions) => handleAddSupplier(values, actions)}
        editUser={editSupplier}
        role="Supplier"
      />

      <ActionConfirmationDialog
        open={openDeleteSupplierDialog}
        onClose={() => setOpenDeleteSupplierDialog(false)}
        title="Delete Supplier"
        color="red"
        ActionConfirmationText="Are  you sure , you want to delete this supplier?"
        actionButtonText="Yes delete !"
        actionCancellationText="No"
        onSubmit={() => handleDeleteSupplier()}
      />
    </>
  );
}
