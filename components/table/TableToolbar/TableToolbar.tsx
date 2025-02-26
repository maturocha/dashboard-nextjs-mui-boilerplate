import { useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
    InputLabel,
    FormControl,
    Select,
    IconButton,
    Chip,
    Toolbar,
    Box,
    Typography,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { Search } from './Search';

interface TableToolbarProps {
    exportButton?: string;
    filters?: Record<string, any>;
    onFilter?: (filter: { name: string; value: any }) => void;
    onFilterRemove?: (filter: string) => void;
    onSearch?: (text: string) => void;
    fList?: Array<{
        label: string;
        name: string;
        info?: string;
        options: Array<{ id: number; name: string }>;
    }>;
    hasSearch?: boolean;
    searchTextDefault?: string;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    '& .filter': {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0.5),
    },
    '& .filterName': {
        marginRight: theme.spacing(0.5),
    },
}));

const TableToolbar = ({
    exportButton,
    filters = {},
    onFilter,
    onFilterRemove,
    onSearch,
    fList,
    searchTextDefault = '',
    hasSearch = false,
}: TableToolbarProps) => {
    const [openSearchModal, setOpenSearchModal] = useState(false);
    
    const handleToggleSearchModal = useCallback(() => {
        setOpenSearchModal((prev) => !prev);
    }, []);

    const activeFilters = useMemo(() => {
        return Object.entries(filters)
            .map(([key, value]) => {
                const filterItem = fList?.find((item) => item.name === key);
                const option = filterItem?.options.find((opt) => opt.id === Number(value));
                return filterItem && option ? { key, label: filterItem.label, optionName: option.name } : null;
            })
            .filter(Boolean);
    }, [filters, fList]);

    return (
        <>
            <StyledToolbar>
                <Box display="flex" alignItems="center" gap={1}>
                    {exportButton && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}${exportButton}`, '_blank')}
                        >
                            Exportar a Excel
                        </Button>
                    )}
                    {hasSearch && onSearch && <Search handleSearch={onSearch} searchTextDefault={searchTextDefault} />}
                </Box>
                <IconButton aria-label="Filtrar" onClick={handleToggleSearchModal}>
                    <FilterListIcon />
                </IconButton>
            </StyledToolbar>

            <Dialog open={openSearchModal} onClose={handleToggleSearchModal} aria-labelledby="form-dialog-title">
                <DialogTitle>Filtrado</DialogTitle>
                <DialogContent>
                    {fList?.map((item) => (
                        <Box display="flex" p={1} key={item.name}>
                            <FormControl fullWidth>
                                <InputLabel>{item.label}</InputLabel>
                                <Select
                                    native
                                    defaultValue=""
                                    onChange={(e) => onFilter?.({ name: item.name, value: e.target.value })}
                                >
                                    <option aria-label="None" value="" />
                                    {item.options.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </Select>
                                <FormHelperText>{item.info}</FormHelperText>
                            </FormControl>
                        </Box>
                    ))}
                </DialogContent>
            </Dialog>

            {activeFilters.length > 0 && (
                <StyledToolbar>
                    {activeFilters.map(({ key, label, optionName }) => (
                        <Box key={key} className="filter">
                            <Typography className="filterName">{label}</Typography>
                            <Chip label={optionName} onDelete={() => onFilterRemove?.(key)} />
                        </Box>
                    ))}
                </StyledToolbar>
            )}
        </>
    );
};

export default TableToolbar;
