import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { InputSearchProps } from "@/types/table";

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.2s'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const InputSearch = ({ handleSearch, searchTextDefault }: InputSearchProps) => {
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
            <SearchWrapper>
                <StyledTextField
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
                />
            </SearchWrapper>
        </form>
    );
};