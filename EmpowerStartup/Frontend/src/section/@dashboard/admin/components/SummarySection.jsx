import { AssignmentInd, Business, MonetizationOn, People } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';

const iconMap = {
  'Donors': <MonetizationOn fontSize='large' />,
  'Startups': <Business fontSize='large' />,
  'Suppliers': <People fontSize='large' />,
  'Auditors': <AssignmentInd fontSize='large' />,
};
const SummaryCard = ({ title, value }) => {

  return (
    <Box border={1} borderColor="grey.300" borderRadius={2} width="300px" margin="10px" padding="20px">
      <Box display="flex" alignItems="space-between">
        <Typography variant="h4" style={{ marginLeft: 10 }}>{title}</Typography>
        <span style={{ marginLeft: '50px' }}>{iconMap[title]}</span>
      </Box>
      <Box display="flex" alignItems="center" padding={2}>
        <Typography variant="h4">{value}</Typography>
      </Box>
    </Box>
  );
};

const SummarySection = ({ summary }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', flexWrap: true, }}>
      {summary?.map((item, index) => (
        <SummaryCard key={index} {...item} />
      ))}
    </div>
  );
};

export default SummarySection;
