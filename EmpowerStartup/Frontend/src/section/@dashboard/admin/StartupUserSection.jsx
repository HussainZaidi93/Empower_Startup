import React, { useCallback, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
// import { Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Post_ChangeUserStatus_URL, Post_DeleteUser_URL, Post_GetRoleBasedUser_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { StartupsPage } from 'src/pages/admin';
import { AccountCircleOutlined, Delete, Edit, NoAccounts } from '@mui/icons-material';
import { UpsertUserDetailsDialog } from '.';
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
    accessorKey: 'startupType',
    header: 'Startup Category',
    size: 40,
  },
  {
    accessorKey: 'phase',
    header: 'Phase',
    size: 40,
  },
  {
    accessorKey: 'auditReport',
    header: 'Audit Report',
    size: 40,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    size: 40,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 40,
  },
];

export default function StartupUserSection() {
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
  const [toggleState, setToggleState] = useState('startups');
  const [editSupplier, setEditSupplier] = useState(null);
  const [selectedSupplierToDelete, setSelectedSupplierToDelete] = useState(null);
  const [openDeleteSupplierDialog, setOpenDeleteSupplierDialog] = useState(false);
  const [openSuuplierDialog, setOpenSupplierDialog] = useState(false);


  //   const [openStartupTypeDialog, setOpenStartupTypeDialog] = useState(false);
  const getAllStartupUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
          role: 'User'
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
    getAllStartupUsers();
  }, [getAllStartupUsers]);

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

  const handleDeleteSupplier = () => {
    try {
      Post(
        { id: selectedSupplierToDelete?._id },
        Post_DeleteUser_URL,
        (resp) => {
          getAllStartupUsers();
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

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" m={2}>
        <ToggleButtonGroup
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
          size="small"
          color="primary"
          value={toggleState}
          exclusive
          onChange={(event, newState) => {
            if (newState === null || typeof newState === 'undefined') {
              setToggleState('startups');
            } else {
              setToggleState(newState);
            }
          }}
          aria-label="Platform"
        >
          <ToggleButton
            value="startups"
            style={{
              backgroundColor: toggleState === 'startups' ? '#04B17C' : '#82fcd8',
              color: toggleState === 'startups' ? 'white' : 'black',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              fontSize: '13px',
              width: '15ch',
            }}
          >
            Startups
          </ToggleButton>
          <ToggleButton
            value="startupsUsers"
            style={{
              backgroundColor: toggleState === 'startupsUsers' ? '#04B17C' : '#82fcd8',
              color: toggleState === 'startupsUsers' ? 'white' : 'black',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              fontSize: '13px',
              width: '15ch',
            }}
          >
            Innovators
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <br />
      {
        toggleState === 'startupsUsers' ?
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
          />
          :
          <StartupsPage role='Inspector' />
      }

      <UpsertUserDetailsDialog
        open={openSuuplierDialog}
        onClose={() => setOpenSupplierDialog(false)}
        onSubmit={(values, actions) => { }}
        editUser={editSupplier}
        role="User"
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
