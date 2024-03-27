import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";

export default function ActionConfirmationDialog({ open, onClose, onSubmit, title, ActionConfirmationText,isActionPerforming, actionPermormingText,actionButtonText,actionCancellationText , color}) {

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle><Typography variant="h5">{title}</Typography></DialogTitle>
      <DialogContent>
        {isActionPerforming ? (
          <>
            <Box sx={{ display: 'flex' }}>
              {actionPermormingText} <CircularProgress />
            </Box>
          </>
        ) : (
          <DialogContentText style={{color:color}}><Typography variant="h6">{ActionConfirmationText}</Typography></DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined" sx={{width : '12ch'}}>
          {actionCancellationText?actionCancellationText:"Cancel"}
        </Button>
        <Button onClick={onSubmit} color="primary" autoFocus      sx={{
              backgroundColor: '#04B17C',
              color: 'white',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C',
              },
              fontSize: '13px',
              width: '13ch',
            }}>
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}