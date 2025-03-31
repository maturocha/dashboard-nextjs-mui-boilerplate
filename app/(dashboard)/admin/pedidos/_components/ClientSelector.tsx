'use client';

import { useState, useEffect } from 'react';
import { 
  Autocomplete, 
  TextField, 
  CircularProgress,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { ClientService } from '@/utils/api/services';
import { Client } from '@/types/clients';

interface ClientSelectorProps {
  value: Client | null;
  onChange: (client: Client | null) => void;
  error?: boolean;
  helperText?: string;
}

export default function ClientSelector({ value, onChange, error, helperText }: ClientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let active = true;

    if (!open) {
      return undefined;
    }

    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await ClientService.getAll({
          search: inputValue,
          perPage: 30,
        });
        
        if (active) {
          setOptions(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        if (active) {
          setOptions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchClients();

    return () => {
      active = false;
    };
  }, [open, inputValue]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open && inputValue) {
        const fetchClients = async () => {
          setLoading(true);
          try {
            const response = await ClientService.getAll({
              search: inputValue,
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
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, open]);

  return (
    <Autocomplete
      id="client-selector"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name || ''}
      options={options}
      loading={loading}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Seleccionar Cliente"
          error={error}
          helperText={helperText}
          required
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
      renderOption={(props, option) => {
        const { key, ...listItemProps } = props;
        return (
          <li key={key} {...listItemProps}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
        );
      }}
    />
  );
} 