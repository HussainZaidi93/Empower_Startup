import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Close, NaturePeople } from '@mui/icons-material';
import { Post_AddPhasesToStartup_URL, Post_GetAllStartupsWithPagination_URL } from 'src/constants/apiURLs';
import { Get, Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';
import { StartupsCardMedia } from './components';

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
    accessorKey: 'country',
    header: 'Country',
    size: 40,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 40,
  },
  // {
  //   accessorKey: 'startupType',
  //   header: 'Startup',
  //   size: 40,
  // },
];

export default function DonationsSection() {
  const { enqueueSnackbar } = useSnackbar();
  // table State
  const [rows, setRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStartup, setSelectedStartup] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchString, setSearchString] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [phases, setPhases] = useState([{ deadline: '', targetSale: '' }, { deadline: '', targetSale: '' }, { deadline: '', targetSale: '' }]);

  const getAllStartupsWithPagination = useCallback(async () => {
    setLoadingData(true);
    try {
      Post(
        {
          pageSize: pagination?.pageSize,
          pageNumber: pagination?.pageIndex,
          searchString: searchString,
          role: "Admin"
        },
        Post_GetAllStartupsWithPagination_URL,
        (resp) => {
          setRows(resp?.data?.startups);
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
    getAllStartupsWithPagination();
  }, [getAllStartupsWithPagination]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handlePhaseChange = (index, field, value) => {
    const updatedPhases = phases.map((phase, i) => {
      if (i === index) {
        return { ...phase, [field]: value };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };
  
  const handleSubmitPhases = () => {
    const formattedPhases = phases.map((phase, index) => ({
      phaseNumber: index + 1,
      deadline: new Date(phase.deadline),
      targetSale: parseInt(phase.targetSale),
    }));
    try {
      Post(
        {
          startupId: selectedStartup?._id,
          phases: formattedPhases
        },
        Post_AddPhasesToStartup_URL,
        resp => {
          enqueueSnackbar("Phases Created Succefully", { variant: 'success' })
          getAllStartupsWithPagination()
          setOpenDialog(false)
        },
        error => {
          enqueueSnackbar("Phases couldn't be created", { variant: 'error' })
          setOpenDialog(false)
        }
      )
    } catch (error) {
      enqueueSnackbar("Phases couldn't be created", { variant: 'error' })
      setOpenDialog(false)
    }


  };

  return (
    <>
      <StartupsCardMedia />
      <Typography variant='h6' ml={2}>Monitor Startup</Typography>
      <MaterialReactTable
        columns={columns}
        data={rows}
        // displayColumnDefOptions={{
        //   'mrt-row-actions': {
        //     muiTableHeadCellProps: {
        //       align: 'center',
        //     },
        //     size: 100,
        //   },
        // }}
        // enableRowActions
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
        // renderRowActions={({ row, table }) => {
        //   return (
        //     <Box display="flex" justifyContent="center" alignItems="center">
        //       <Tooltip title="Create phases">
        //         <IconButton
        //           color="success"
        //           onClick={() => {
        //             setSelectedStartup(row.original);
        //             handleOpenDialog();
        //           }}
        //         >
        //           <NaturePeople />
        //         </IconButton>
        //       </Tooltip>
        //       <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        //         <DialogTitle>
        //           <Box display="flex" justifyContent="space-between">
        //             <Typography variant="h4">Create Phases </Typography>
        //             <IconButton onClick={() => setOpenDialog(false)}>
        //               <Close />
        //             </IconButton>
        //           </Box>
        //         </DialogTitle>
        //         <DialogContent>
        //           {phases.map((phase, index) => (
        //             <Box key={index} mb={2}>
        //               <Typography variant="subtitle1">Phase {index + 1}</Typography>
        //               <TextField
        //                 size="small"
        //                 label="Target Sale"
        //                 type="number"
        //                 value={phases[index].targetSale}
        //                 onChange={(e) => handlePhaseChange(index, 'targetSale', e.target.value)}
        //                 fullWidth
        //                 margin="normal"
        //               />

        //               <TextField
        //                 size="small"
        //                 label="Deadline"
        //                 type="date"
        //                 value={phases[index].deadline}
        //                 onChange={(e) => handlePhaseChange(index, 'deadline', e.target.value)}
        //                 InputLabelProps={{
        //                   shrink: true,
        //                 }}
        //                 fullWidth
        //                 margin="normal"
        //               />
        //             </Box>
        //           ))}
        //         </DialogContent>
        //         <Box display="flex" justifyContent="center">
        //           <Button
        //             onClick={handleSubmitPhases}
        //             sx={{
        //               backgroundColor: '#04B17C',
        //               color: 'white',
        //               padding: '5px',
        //               '&:hover': {
        //                 backgroundColor: '#04B17C',
        //               },
        //               borderRadius: '5px',
        //               fontSize: '15px',
        //               width: '10ch',
        //               marginBottom: '1rem',
        //             }}
        //           >
        //             Submit
        //           </Button>
        //         </Box>
        //       </Dialog>
        //     </Box>
        //   );
        // }}
      />
    </>
  );
}
