import { useState, useCallback, useMemo } from 'react';
import {
    Chip,
    Toolbar,
    Box,
    Button
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import FilterModal from './FilterModal';
import ToolbarActions from './ToolbarActions';
import { ActiveFilter, TableToolbarProps } from '@/types/table';

const ActiveFilterChips = ({ 
    filters, 
    onFilterRemove 
}: { 
    filters: ActiveFilter[], 
    onFilterRemove?: (filter: string) => void 
}) => (
    <Box 
        sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            p: 1 
        }}
    >
        {filters.map(({ key, label, optionName }) => (
            <Chip
                key={key}
                label={`${label}: ${optionName}`}
                onDelete={() => onFilterRemove?.(key)}
                color="primary"
                variant="outlined"
                sx={{ m: 0.5 }}
            />
        ))}
    </Box>
);

const TableToolbar = ({
    exportButton,
    filters,
    onFilter,
    onFilterRemove,
    onSearch,
    filteredList,
    searchTextDefault = '',
    hasSearch = false
}: TableToolbarProps) => {

    const [openSearchModal, setOpenSearchModal] = useState(false);
    
    const handleToggleSearchModal = useCallback(() => {
        setOpenSearchModal((prev) => !prev);
    }, []);

    const handleFilter = useCallback((filterData: { name: string; value: any }) => {
        onFilter?.(filterData);
        setOpenSearchModal(false);
    }, [onFilter]);

    const activeFilters = useMemo((): ActiveFilter[] => {
        if (!filteredList || !filters) return [];
        
        return Object.entries(filters).reduce<ActiveFilter[]>((acc, [key, value]) => {
            if (!value) return acc;
            
            const filterItem = filteredList.find((item) => item.name === key);
            const option = filterItem?.options.find((opt) => opt.id === Number(value));
            
            if (filterItem && option) {
                acc.push({
                    key,
                    label: filterItem.label,
                    optionName: option.name
                });
            }
            return acc;
        }, []);
    }, [filters, filteredList]);

    return (
        <Box>
            <Toolbar>
                <Box sx={{ flex: 1 }}>
                    {activeFilters.length > 0 ? (
                        <ActiveFilterChips 
                            filters={activeFilters} 
                            onFilterRemove={onFilterRemove} 
                        />
                    ) : null}
                </Box>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        ml: 'auto'
                    }}
                >
                    <ToolbarActions 
                        exportButton={exportButton}
                        hasSearch={hasSearch}
                        onSearch={onSearch}
                        searchTextDefault={searchTextDefault}
                    />
                    <Button
                        variant="outlined"
                        
                        disabled={filters ? false : true}
                        startIcon={<TuneIcon />}
                        onClick={handleToggleSearchModal}
                        aria-label="Abrir filtros"
                        sx={{
                            minWidth: 'auto',
                            gap: 1,
                            textTransform: 'none',
                            borderRadius: 1,
                            px: 2
                        }}
                    >
                        Filtros
                    </Button>
                </Box>
            </Toolbar>

            {filters && <FilterModal 
                open={openSearchModal}
                onClose={handleToggleSearchModal}
                filteredList={filteredList}
                filters={filters}
                onFilter={handleFilter}
            />}
        </Box>
    );
};

export default TableToolbar;
