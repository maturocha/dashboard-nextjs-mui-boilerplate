'use client';

import { IconButton, Tooltip, styled } from '@mui/material';
import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
} from '@mui/icons-material';

const StyledPaginationActions = styled('div')(({ theme }) => ({
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
}));

const TablePaginationActions = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    direction = 'ltr'
}: {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    direction?: 'ltr' | 'rtl';
}) => {
    const lastPage = Math.ceil(count / rowsPerPage) - 1;

    const handleFirstPageClick = () => {
        onPageChange(0);
    };

    const handlePreviousPageClick = () => {
        onPageChange(page - 1);
    };

    const handleNextPageClick = () => {
        onPageChange(page + 1);
    };

    const handleLastPageClick = () => {
        onPageChange(lastPage);
    };

    return (
        <StyledPaginationActions>
            <Tooltip title="Primera página">
                <span>
                    <IconButton
                        onClick={handleFirstPageClick}
                        disabled={page === 0}
                        aria-label="primera página"
                        size="small"
                    >
                        {direction === 'rtl' ? <LastPage /> : <FirstPage />}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title="Página anterior">
                <span>
                    <IconButton
                        onClick={handlePreviousPageClick}
                        disabled={page === 0}
                        aria-label="página anterior"
                        size="small"
                    >
                        {direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title="Página siguiente">
                <span>
                    <IconButton
                        onClick={handleNextPageClick}
                        disabled={page >= lastPage}
                        aria-label="página siguiente"
                        size="small"
                    >
                        {direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title="Última página">
                <span>
                    <IconButton
                        onClick={handleLastPageClick}
                        disabled={page >= lastPage}
                        aria-label="última página"
                        size="small"
                    >
                        {direction === 'rtl' ? <FirstPage /> : <LastPage />}
                    </IconButton>
                </span>
            </Tooltip>
        </StyledPaginationActions>
    );
};

export default TablePaginationActions;
