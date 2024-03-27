import { Formik } from 'formik';
import { MaterialReactTable } from 'material-react-table';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

function PlaceAudit(props) {
  // Columns
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 40,
    },
    {
      accessorKey: 'startup',
      header: 'Startup Name',
      size: 40,
    },
    {
      accessorKey: 'fullName',
      header: 'Owner Name',
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
  const generateDummyData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        startup: `Startup ${i + 1}`,
        fullName: `User ${i + 1}`,
        phone: '123456789',
        address: 'Address',
      });
    }
    return data;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of rows per page
  const [totalRowCount] = useState(50); // Total number of rows

  // Calculate start and end indices for pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRowCount);

  // Generate dummy data for the current page
  const data = generateDummyData(endIndex - startIndex);

  return (
    <div>
      {/* <Formik
        initialValues={{
          auditorId: '',
          startupTypeIds: '',
          date: '',
          result: '',
          revenue: '',
          status: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            await axios.post('/api/auditstartup', values);
            resetForm();
            fetchAuditStartups();
          } catch (error) {
            console.error('Error creating audit startup:', error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="auditorId"
              type="text"
              label="Auditor ID"
              as={TextField}
              fullWidth
              margin="normal"
            />
      
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Create Audit Startup
            </Button>
          </Form>
        )}
      </Formik> */}
      <Helmet>
        <title> Place Audit | SE</title>
      </Helmet>
      <br />
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
        manualPagination
        rowCount={totalRowCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(newPage) => setCurrentPage(newPage)}
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
