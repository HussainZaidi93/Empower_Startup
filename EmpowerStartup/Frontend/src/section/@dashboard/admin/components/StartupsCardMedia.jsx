import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Get, Post } from 'src/actions/API/apiActions';
import { Get_SalesPerStartup_URL, Post_MakeAdminSuggestion_URL } from 'src/constants/apiURLs';
import { BarChartComponent } from 'src/sections/startup';
import { useSnackbar } from 'notistack';

function StartupsCardMedia() {
    const [startupSales, setStartupSales] = useState([]);
    const [suggestionText, setSuggestionText] = useState('');
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const getSalesPerStartup = useCallback(() => {
        try {
            Get(
                {},
                Get_SalesPerStartup_URL,
                resp => {
                    setStartupSales(resp?.data);
                },
                error => {

                }
            )
        } catch (error) {

        }
    }, []);

    useEffect(() => { getSalesPerStartup() }, [getSalesPerStartup]);

    const handleSuggestion = (startupId, suggestion) => {
        console.log("jdsfsdfdfd", startupId)
        try {
            Post(
                {
                    startupId: startupId,
                    suggestion: suggestion
                },
                Post_MakeAdminSuggestion_URL,
                resp => {
                    enqueueSnackbar("Your valuable suggestion is made. Thanks", { variant: 'success' });
                    handleClose();
                },
                error => {
                    enqueueSnackbar("We encountered an error! Please try again later", { variant: 'error' });
                }
            )
        } catch (error) {
            enqueueSnackbar("We encountered an error! Please try again later", { variant: 'error' });
        }
    };

    const handleClickOpen = (startupId) => {
        console.log("jdsfsdfdfd", startupId)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSuggestionText('');
    };

    return (
        <Grid container spacing={3} m={2}>
            {startupSales?.map((startup, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                    <Card style={{ maxWidth: '300px' }}>
                        {console.log("hjsdfdsfsdf", startup)}
                        {/* Pass the reports data of the respective startup */}
                        <BarChartComponent salesData={startup?.reports} type="line" />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {startup?.startupInfo[0]?.startupType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Owner: {`${startup?.userInfo[0]?.firstName} ${startup?.userInfo[0]?.lastName}`}
                            </Typography>
                            {/* Assuming currentSale is also coming from the API */}
                            <Typography variant="body2" color="text.secondary">
                                Current Sale: {startup?.currentSale}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleClickOpen(startup)}
                                style={{ marginTop: '10px' }}
                            >
                                Make a Suggestion
                            </Button>

                        </CardContent>
                    </Card>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Enter Suggestion</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="suggestion"
                                label="Suggestion"
                                type="text"
                                fullWidth
                                multiline
                                maxRows={4}
                                value={suggestionText}
                                onChange={e => setSuggestionText(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => handleSuggestion(startup?.startupInfo[0]?._id, suggestionText)} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            ))}
        </Grid>
    );
}

export default StartupsCardMedia;
