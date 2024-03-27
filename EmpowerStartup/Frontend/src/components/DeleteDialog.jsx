import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function DeleteDialog({ open, onClose, onSubmit, title, message,isDeleting }) {

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {isDeleting ? (
          <>
            <Box sx={{ display: 'flex' }}>
              Deleting <CircularProgress />
            </Box>
          </>
        ) : (
          <DialogContentText color="red">{message}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}