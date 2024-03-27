import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import React from 'react';

const TableHeader = ({
    order,
    orderBy,
    onRequestSort,
    rowCount,
    columns,
    enableCheckbox,
    numSelected,
    onSelectAllClick,
  }) => {

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
        <TableRow>
            {enableCheckbox && (
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
            )}
            {columns?.map((column) => (
                <TableCell 
                    key={column.id}>
                    <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={createSortHandler(column.id)}
                    >
                        {column.label}
                    </TableSortLabel>
                    </TableCell>
            ))}
        </TableRow>

    </TableHead>
  );
};

export default TableHeader;
