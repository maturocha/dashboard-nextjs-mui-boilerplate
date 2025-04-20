import { FilterModalProps } from '@/types/table';
import { Box, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';

const FilterModal = ({ open, onClose, filteredList, filters, onFilter }: FilterModalProps) => (
    <Dialog 
        open={open} 
        onClose={onClose} 
        aria-labelledby="filter-dialog-title"
        maxWidth="sm"
        fullWidth
    >
        <DialogTitle id="filter-dialog-title">Filtros</DialogTitle>
        <DialogContent>
            {filteredList?.map((item) => (
                <Box display="flex" p={1} key={item.name}>
                    <FormControl fullWidth>
                        <InputLabel id={`filter-label-${item.name}`}>{item.label}</InputLabel>
                        <Select
                            labelId={`filter-label-${item.name}`}
                            id={`filter-select-${item.name}`}
                            native
                            value={filters[item.name] || ''}
                            onChange={(e) => onFilter({ name: item.name, value: e.target.value })}
                            aria-describedby={item.info ? `helper-text-${item.name}` : undefined}
                        >
                            <option aria-label="Ninguno" value="">Seleccionar...</option>
                            {item.options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </Select>
                        {item.info && (
                            <FormHelperText id={`helper-text-${item.name}`}>
                                {item.info}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Box>
            ))}
        </DialogContent>
    </Dialog>
);

export default FilterModal; 