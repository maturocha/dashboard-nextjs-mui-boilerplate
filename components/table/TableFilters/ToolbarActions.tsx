import { Box, Button } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { InputSearch } from './InputSearch';

interface ToolbarActionsProps {
    exportButton?: string;
    hasSearch?: boolean;
    onSearch?: (text: string) => void;
    searchTextDefault?: string;
}

const ToolbarActions = ({ exportButton, hasSearch, onSearch, searchTextDefault = '' }: ToolbarActionsProps) => (
    <Box display="flex" alignItems="center">
        {exportButton && (
            <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}${exportButton}`, '_blank')}
                startIcon={<FileDownloadIcon />}
            >
                Exportar a Excel
            </Button>
        )}
        {hasSearch && onSearch && (
            <InputSearch 
                handleSearch={onSearch}
                searchTextDefault={searchTextDefault}
            />
        )}
    </Box>
);

export default ToolbarActions; 