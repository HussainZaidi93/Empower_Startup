import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { logoImage } from 'src/images';

function RecentStartups({ recentStartups }) {
    return (
        <Grid container spacing={2} m={5}>
            <Grid item xs={12}>
                <Typography variant='h4'>Recent Startups</Typography>
            </Grid>
            {recentStartups?.map((startup, index) => (
                <Grid item xs={6} key={index}>
                    <Paper style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                        <img src={logoImage} alt={startup.startupType} style={{ width: '100px', height: '100px', border: '1px solid', borderRadius: '20%', marginRight: '10px' }} />
                        <div>
                            <Typography variant="h4">{startup.startupType}</Typography>
                            <Typography variant="body2">{startup.shortDescription}</Typography>
                        </div>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}

export default RecentStartups;