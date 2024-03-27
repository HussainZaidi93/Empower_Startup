import { AddCircleOutline, DeleteOutline, Edit, Search } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import React from "react";
// Create Button
export const CreateButton = ({ onClick, title, children }) => {
    return (
        <Button
            size="small"
            variant="contained"
            onClick={onClick}
        >{title}
            <AddCircleOutline />
            {children}
        </Button>
        //   <IconButton aria-label="delete" className={classes.deleteButton}>
        //   <MessageIcon fontSize="small" />
        // </IconButton>
    );
};


// Delete Button
export const DeleteButton = ({ onClick }) => {
    return (
        <IconButton  onClick={onClick}>
            <DeleteOutline fontSize="small" />
        </IconButton>
    );
};


// Edit Button
export const EditButton = ({ onClick }) => {
    return (
        <IconButton  onClick={onClick}>
            <Edit fontSize="small" />
        </IconButton>
    );
}



export const SearchBar = (props) => {
  // const styleClasses = useStyles();
  const { name, label, value, onChange } = props;
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      size="small"
      placeholder="Search"
      name={name}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};

export const SendMail=({onClick})=>{
  return(
    <IconButton onClick={onClick}>
      <EmailIcon fontSize="small" />
    </IconButton>
  )
}