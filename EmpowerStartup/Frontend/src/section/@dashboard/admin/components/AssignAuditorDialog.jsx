import React, { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import {
  Post_AssignStartupAudit_URL,
  Post_GetAllAuditsByAuditorId_URL,
  Post_GetAllStartupsWithoutPagination_URL,
  baseURL,
} from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { isUndefined } from 'lodash';

function AssignAuditorDialog({ open, onClose, selectedAuditor, role }) {
  const [selectedStartups, setSelectedStartups] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [startups, setStartups] = useState([]);
  const [startupDates, setStartupDates] = useState({});
  const [assignedAuditor, setAssignedAuditor] = useState(null);
  const isSelected = (startup) => selectedStartups.indexOf(startup) !== -1;

  const handleClose = () => {
    setSelectedStartups([]);
    onClose();
  };

  const handleCheckboxChange = (startupId) => (event) => {
    const isChecked = event.target.checked;
    const newSelectedStartups = isChecked
      ? [...selectedStartups, startupId]
      : selectedStartups.filter((id) => id !== startupId);

    setSelectedStartups(newSelectedStartups);
  };

  const getAllStartups = useCallback(() => {

    try {
      Post(
        { role: 'Admin', status: role === 'Auditor' ? true : false },
        Post_GetAllStartupsWithoutPagination_URL,
        (resp) => {
          console.log('startups', resp?.data?.startups);
          setStartups(resp?.data?.startups);
        },
        (error) => {
          enqueueSnackbar('Failed to load startup types', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, []);

  const getAssignedAudits = useCallback(() => {
    try {
      Post(
        { auditorId: selectedAuditor?._id },
        Post_GetAllAuditsByAuditorId_URL,
        resp => {
          if (isUndefined(resp?.data?.audits?.auditorId)) {
            setAssignedAuditor(null)
          } else {
            setAssignedAuditor(resp?.data?.audits?.auditorId)
          }
        },
        error => {
        }
      )
    } catch (error) {

    }
  }, [selectedAuditor])
  useEffect(() => {
    getAllStartups();
  }, [getAllStartups]);

  useEffect(() => {
    setSelectedStartups([]);
    setStartupDates({});
    getAssignedAudits()
  }, [open]);

  const handleAssignStartup = useCallback(() => {
    try {
      const data = [];
      for (const startupId in startupDates) {
        data.push({ startupTypeId: startupId, date: startupDates[startupId] });
      }
      console.log('dsewr4ere', data);
      Post(
        {
          auditorId: selectedAuditor?._id,
          startups: data,
          status: 'Pending',
        },
        Post_AssignStartupAudit_URL,
        (resp) => {
          enqueueSnackbar('Assigned startup successfully', { variant: 'success' });
          onClose();
        },
        (error) => {
          enqueueSnackbar('Some error occurred while assigning startup', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, [selectedAuditor, startupDates, enqueueSnackbar]);

  const handleDateChange = (startupId, date) => {
    setStartupDates((prevDates) => ({
      ...prevDates,
      [startupId]: date,
    }));
  };

  console.log("jsdgfsdsdfsd", assignedAuditor)
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">Assign Startup</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {console.log('frerewre', startups)}
        <List>
          {startups.length <= 0 && <Typography variant='h6'>No approved startups found</Typography>}
          {startups?.map((startup, index) => (
            <ListItem key={index}>
              <FormControlLabel
                control={<Checkbox checked={isSelected(startup._id)} onChange={handleCheckboxChange(startup._id)} />}
                label={
                  <ListItemText
                    primary={startup.middleName}
                    secondary={`${startup.firstName} ${startup.lastName} - ${startup.startupType}`}
                  />
                }
              />
              {isSelected(startup._id) && (
                <TextField
                  label="Select Date"
                  variant="outlined"
                  id={`date_${startup._id}`}
                  size="small"
                  type="date"
                  fullWidth
                  sx={{ width: '25ch', marginLeft: '8rem' }}
                  name={`date_${startup._id}`}
                  onChange={(e) => handleDateChange(startup._id, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            sx={{
              backgroundColor: '#04B17C',
              color: 'white',
              padding: '5px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              borderRadius: '5px',
              fontSize: '15px',
              width: '16ch',
            }}
            size="small"
            onClick={() => handleAssignStartup()}
          >
            Assign Startup
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AssignAuditorDialog;
