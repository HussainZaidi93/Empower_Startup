import { HourglassEmptyOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    icon: {
        fontSize: "3rem"
    },
    text: {}

}));


const EmptyData = () => {
    const classes = useStyles()

    return (
        <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <HourglassEmptyOutlined className={classes.icon} />
            <Typography className={classes.text} variant="h4">Hmmmm . . . No Data</Typography>
        </Box>
    );
}

export default EmptyData
