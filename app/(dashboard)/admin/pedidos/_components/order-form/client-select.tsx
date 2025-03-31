'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Autocomplete, CircularProgress, Chip } from '@mui/material';
import { ClientService } from '@/utils/api/services';
import { Client } from '@/types/clients';

interface ClientSelectProps {
  onSelect: (client: Client) => void;
  selectedCustomer: Client | null;
}

export default function ClientSelect({ onSelect, selectedCustomer }: ClientSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar clientes desde la API
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await ClientService.getAll({
          search: searchQuery,
          perPage: 30,
        });
        setOptions(response.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchQuery]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      fullWidth
      filterOptions={(x) => x} // Deshabilitar filtrado local, ya que la API maneja la búsqueda
      value={selectedCustomer}
      onChange={(_event, newValue) => {
        if (newValue) {
          onSelect(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar cliente"
          variant="outlined"
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body1">{option.name}</Typography>
              <Chip 
                label={option.type === 'p' ? 'Particular' : 'Mayorista'}
                size="small"
                color={option.type === 'p' ? 'default' : 'primary'}
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
            {option.email && (
              <Typography variant="caption" color="text.secondary">
                {option.email}
              </Typography>
            )}
          </Box>
        </li>
      )}
    />
  );
} 