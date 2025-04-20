import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { InputSearchProps } from "@/types/table";


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
            <TextField
            fullWidth
              size="small"
              placeholder="Buscar..."
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
        </form>
    );
};