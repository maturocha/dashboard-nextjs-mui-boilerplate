"use client";

import React, { useCallback, useMemo } from 'react';
import {
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
  Skeleton,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import TableFilters from './TableFilters';
import { TableProps } from '@/types/table';

  
const SkeletonRow = ({ columns }: { columns: number }) => (
  <TableRow>
    {Array.from({ length: columns }).map((_, index) => (
      <TableCell key={index}>
        <Skeleton variant="text" />
      </TableCell>
    ))}
  </TableRow>
);

const Table = ({
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
  onSearch,
  searchTextDefault,
  onFilter,
  onFilterRemove,
  filteredList,
  hasSearch,
  loading,
}: TableProps) => {

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    onChangePage(newPage + 1);
  }, [onChangePage]);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChangePerPage(parseInt(event.target.value, 10), 1);
  }, [onChangePerPage]);

  const renderRows = useMemo(() => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonRow key={index} columns={columns.length} />
      ));
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No hay datos disponibles
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item, key) => (
      <TableRow
        hover
        key={key}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          transition: "background-color 0.2s",
        }}
      >
        {columns.map((column, cellKey) => (
          <TableCell key={cellKey} align={column.numeric ? 'right' : 'left'}>
            {item[column.property] || '-'}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [loading, data, columns]);

  return (
    <>
      <TableFilters
        filters={filters}
        filteredList={filteredList}
        onFilter={onFilter}
        onFilterRemove={onFilterRemove}
        hasSearch={hasSearch}
        onSearch={onSearch}
        searchTextDefault={searchTextDefault}
      />

      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            borderRadius: 3,
            border:
              theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ overflowX: "auto", width: "100%" }}>
            <MuiTable stickyHeader aria-label="tabla de inventario">
              <TableHead>
                <TableRow>
                  {columns.map((column, key) => (
                    <TableCell
                      key={key}
                      onClick={() => column.sort && headerCellClicked(column.property)}
                      align={column.numeric ? 'right' : 'left'}
                    >
                      {column.sort ? (
                        <Tooltip title={sortType === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'}>
                          <TableSortLabel
                            active={sortBy === column.property}
                            direction={sortType === 'asc' ? 'asc' : 'desc'}
                          >
                            {column.name}
                          </TableSortLabel>
                        </Tooltip>
                      ) : (
                        column.name
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {renderRows}
              </TableBody>

              {data.length > 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
                          borderTop:
                            theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            pl: 2, 
                            py: 1,
                            display: { xs: "none", sm: "block" } 
                          }}
                        >
                          Total: {data.length} items
                        </Typography>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 20, 50, 100]}
                          colSpan={columns.length}
                          count={total}
                          page={page - 1}
                          rowsPerPage={perPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          labelRowsPerPage={isTablet ? "Filas:" : "Filas por página:"}
                          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                          sx={{
                            border: 0,
                            '& .MuiTablePagination-selectLabel': {
                              mt: 0.5,
                            },
                            '& .MuiTablePagination-displayedRows': {
                              mt: 0.5,
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </MuiTable>
          </Box>
        </TableContainer>
      </Box>
    </>
  );
};

export default Table;
