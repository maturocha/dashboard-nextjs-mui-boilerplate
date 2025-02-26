import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface SearchProps {
    handleSearch: (value: string) => void;
    searchTextDefault: string;
}

export const Search = ({ handleSearch, searchTextDefault }: SearchProps) => {
    const [searchText, setSearchText] = useState(searchTextDefault || '');

    useEffect(() => {
        setSearchText(searchTextDefault || '');
    }, [searchTextDefault]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchText);
    };

    const handleClear = () => {
        setSearchText('');
        handleSearch('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                id="table-search"
                size="small"
                placeholder="Buscar..."
                type="search"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                    endAdornment: searchText && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClear} size="small" aria-label="limpiar búsqueda">
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ 
                    width: '250px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                    }
                }}
            />
        </form>
    );
};