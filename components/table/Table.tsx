import React, { useCallback, useMemo } from 'react';
import {
    Paper,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    styled,
    CircularProgress,
    Box,
} from '@mui/material';

import TableToolbar from './TableToolbar/TableToolbar';
import TablePaginationActions from './TablePaginationActions';

// Tipos
interface TableProps {
    exportButton?: boolean;
    columns: Array<{
        name: string;
        property: string;
        sort?: boolean;
        numeric?: boolean;
    }>;
    data: Array<any>;
    total: number;
    sortType?: 'asc' | 'desc';
    sortBy?: string;
    headerCellClicked: (property: string) => void;
    page: number;
    perPage: number;
    onChangePage: (page: number) => void;
    onChangePerPage: (perPage: number, page: number) => void;
    filters?: Record<string, any>;
    selectFilter?: Record<string, any>;
    onFilter?: (filter: any) => void;
    onFilterRemove?: (filter: string) => void;
    fList?: Array<any>;
    hasSearch?: boolean;
    onSearch?: (text: string) => void;
    searchTextDefault?: string;
    loading?: boolean;
}

// Estilos
const LoadingOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    marginTop: theme.spacing(2),
    minHeight: '75vh',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid',
    borderColor: theme.palette.divider,
}));

const TableWrapper = styled('div')({
    overflowX: 'auto',
    '::-webkit-scrollbar': {
        height: '6px',
    },
    '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '3px',
    },
});

const StyledTable = styled(MuiTable)(({ theme }) => ({
    minWidth: 500,
    '& .MuiTableCell-head': {
        fontWeight: 600,
        fontSize: '0.875rem',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),
        whiteSpace: 'nowrap',
    },
    '& .MuiTableCell-body': {
        padding: theme.spacing(2),
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
    },
    '& .MuiTableRow-root': {
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        transition: 'background-color 0.2s ease',
    },
    '& .MuiTableRow-root:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
    },
    '& .MuiTableSortLabel-root.Mui-active': {
        color: theme.palette.primary.main,
    },
    '& .MuiTablePagination-root': {
        borderTop: `1px solid ${theme.palette.divider}`,
    },
}));

const Table = ({
    exportButton,
    columns,
    data,
    total,
    sortType,
    sortBy,
    headerCellClicked,
    page,
    perPage,
    onChangePage,
    onChangePerPage,
    filters,
    selectFilter,
    onSearch,
    searchTextDefault,
    onFilter,
    onFilterRemove,
    fList,
    hasSearch,
    loading,
}: TableProps) => {

    // Maneja el cambio de página
    const handleChangePage = useCallback((_: unknown, newPage: number) => {
        onChangePage(newPage + 1);
    }, [onChangePage]);

    // Maneja el cambio de filas por página
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChangePerPage(parseInt(event.target.value, 10), 1);
    }, [onChangePerPage]);

    // Renderiza las filas de la tabla
    const renderRows = useMemo(() => {
        return data.map((item, key) => (
            <TableRow key={key}>
                {columns.map((column, cellKey) => (
                    <TableCell
                        key={cellKey}
                        component={cellKey === 0 ? 'th' : undefined}
                        scope={cellKey === 0 ? 'row' : undefined}
                        align={column.numeric ? 'right' : 'left'}
                    >
                        {item[column.property]}
                    </TableCell>
                ))}
            </TableRow>
        ));
    }, [data, columns]);

    // Renderiza las celdas vacías si no hay suficientes datos
    const renderEmptyRows = useMemo(() => {
        return null;
    }, []);

    return (
        <StyledPaper>
            {loading && (
                <LoadingOverlay>
                    <CircularProgress />
                </LoadingOverlay>
            )}
            
            <TableToolbar
                filters={filters}
                fList={fList}
                onFilter={onFilter}
                onFilterRemove={onFilterRemove}
                hasSearch={hasSearch}
                onSearch={onSearch}
                searchTextDefault={searchTextDefault}
            />

            <TableWrapper>
                <TableContainer>
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, key) => (
                                    <TableCell
                                        key={key}
                                        onClick={() => column.sort && headerCellClicked(column.property)}
                                        align={column.numeric ? 'right' : 'left'}
                                    >
                                        {!column.sort ? (
                                            column.name
                                        ) : (
                                            <Tooltip
                                                title={sortType === 'asc' ? 'DESC' : 'ASC'}
                                                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                                enterDelay={300}
                                            >
                                                <TableSortLabel
                                                    active={sortBy === column.property}
                                                    direction={sortType}
                                                >
                                                    {column.name}
                                                </TableSortLabel>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {renderRows}
                            {renderEmptyRows}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                                    colSpan={columns.length}
                                    count={total}
                                    page={page - 1}
                                    rowsPerPage={perPage}
                                    defaultValue={20}
                                    labelRowsPerPage="Por página"
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </StyledTable>
                </TableContainer>
            </TableWrapper>
        </StyledPaper>
    );
};

export default Table;