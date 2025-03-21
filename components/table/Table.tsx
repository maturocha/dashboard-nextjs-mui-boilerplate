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
  styled,
  Paper,
} from '@mui/material';
import TableToolbar from './TableToolbar/TableToolbar';
import { TableProps } from '@/types/table';

// Wrapper para scroll horizontal en mobile
const TableWrapper = styled(TableContainer)({
    width: '100%',
    overflowX: 'auto',
    display: 'block', // Asegura que el scroll funcione bien
    
    '& table': {
      minWidth: '800px', // Ajusta el ancho mínimo para que no se comprima
    },
  });
  

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
      <TableRow key={key}>
        {columns.map((column, cellKey) => (
          <TableCell key={cellKey} align={column.numeric ? 'right' : 'left'}>
            {item[column.property] || '-'}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [loading, data, columns]);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>

        
      <TableToolbar
        filters={filters}
        filteredList={filteredList}
        onFilter={onFilter}
        onFilterRemove={onFilterRemove}
        hasSearch={hasSearch}
        onSearch={onSearch}
        searchTextDefault={searchTextDefault}
      />

      <TableWrapper>
        <MuiTable stickyHeader>
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

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                colSpan={columns.length}
                count={total}
                page={page - 1}
                rowsPerPage={perPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </MuiTable>
      </TableWrapper>
    </div>
  );
};

export default Table;
