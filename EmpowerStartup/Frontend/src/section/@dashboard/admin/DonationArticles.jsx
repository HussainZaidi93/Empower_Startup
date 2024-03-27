import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Tooltip, IconButton } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Post } from "src/actions/API/apiActions";
import { Post_GetAllArcticles_URL } from "src/constants/apiURLs";
import { ArticleFormDialog } from "./components";
import { Delete } from "@mui/icons-material";

// Columns
const columns = [
    {
        accessorKey: 'Date',
        header: 'Date',
        size: 40,
    },
    {
        accessorKey: 'startupName',
        header: 'Title',
        size: 40,
    },
    {
        accessorKey: 'articleContent',
        header: 'Content',
        size: 40,
        // Custom Cell Renderer to Show Full Content in Dialog
        Cell: ({ cell }) => {
            const [openDialog, setOpenDialog] = useState(false);
            const trimmedContent = cell.getValue()?.split(' ').slice(0, 10).join(' ');

            return (
                <>
                    <div
                        onClick={() => setOpenDialog(true)}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', cursor: 'pointer' }}
                    >
                        {trimmedContent}.{trimmedContent !== cell.getValue() && '...'}
                    </div>
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Full Content</DialogTitle>
                        <DialogContent>
                            {cell.getValue()}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </>
            );
        }
    },
];

function DonationArticles() {
    const { enqueueSnackbar } = useSnackbar();
    // table State
    const [rows, setRows] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [isError, setIsError] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchString, setSearchString] = useState('');
    const [openArticleDialog, setOpenArticleDialog] = useState(false);
    const getAllDonators = useCallback(() => {
        setLoadingData(true);
        try {
            Post(
                {
                    pageSize: pagination?.pageSize,
                    pageNumber: pagination?.pageIndex,
                    searchString: searchString,
                },
                Post_GetAllArcticles_URL,
                (resp) => {
                    console.log('hjsdfsdfdsf', resp?.data);
                    setRows(resp?.data?.articles);
                    setIsError(false);
                    setLoadingData(false);
                    setTotalCount(resp?.data.totalCount);
                },
                (error) => {
                    setLoadingData(false);
                    setIsError(true);
                    enqueueSnackbar('Something went wrong', { variant: 'error' });
                }
            );
        } catch (error) {
            setLoadingData(false);
            setIsError(true);
            enqueueSnackbar('Something went wrong', { variant: 'error' });
        }
    }, [pagination.pageSize, pagination.pageIndex, searchString, enqueueSnackbar]);

    useEffect(() => {
        getAllDonators();
    }, []);

    return (
        <>
            <Typography variant='h6' ml={2}>Donation Articles</Typography>

            <MaterialReactTable
                columns={columns}
                data={rows}
                rowCount={totalCount}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                manualPagination
                onPaginationChange={setPagination}
                manualFiltering
                onGlobalFilterChange={setSearchString}
                state={{
                    pagination,
                    searchString,
                    isLoading: loadingData,
                }}
                positionToolbarAlertBanner="bottom"
                renderTopToolbarCustomActions={() => (
                    <Button
                        sx={{
                            backgroundColor: '#04B17C',
                            color: 'white',
                            padding: '10px',
                            '&:hover': {
                                backgroundColor: '#04B17C',
                            },
                            fontSize: '13px',
                            width: '20ch',
                        }}
                        size="small"
                        onClick={() => setOpenArticleDialog(true)}
                    >
                        Add Article
                    </Button>
                )}
            // renderRowActions={(row) => (
            //     <Box>
            //         {/* add delete icon for article delete */}
            //         <Tooltip title="Delete Article">
            //             <IconButton color="error" onClick={() => { }}>
            //                 <Delete />

            //             </IconButton>
            //         </Tooltip>
            //     </Box>
            // )}

            />
            <ArticleFormDialog open={openArticleDialog} onClose={() => setOpenArticleDialog(false)} onSubmit={() => getAllDonators()} />
        </>
    );
}
export default DonationArticles;