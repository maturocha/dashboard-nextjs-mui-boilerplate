'use client';

import { useState, useEffect } from 'react';
import { 
  Autocomplete, 
  TextField, 
  CircularProgress,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import { ProductService } from '@/utils/api/services';
import { Product } from '@/types/products';

interface ProductSelectorProps {
  value: Product | null;
  onChange: (product: Product | null) => void;
  disabled?: boolean;
}

export default function ProductSelector({ value, onChange, disabled = false }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let active = true;

    if (!open) {
      return undefined;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAll({
          search: inputValue,
          perPage: 50,
        });
        
        if (active) {
          setOptions(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (active) {
          setOptions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [open, inputValue]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open && inputValue) {
        const fetchProducts = async () => {
          setLoading(true);
          try {
            const response = await ProductService.getAll({
              search: inputValue,
              perPage: 50,
            });
            setOptions(response.data || []);
          } catch (error) {
            console.error('Error fetching products:', error);
            setOptions([]);
          } finally {
            setLoading(false);
          }
        };

        fetchProducts();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, open]);

  // Format currency - Mostrar exactamente como viene del backend
  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') {
      return '$0.00';
    }
    
    // Si es un string y ya tiene $, mostrarlo tal cual
    if (typeof value === 'string') {
      return value.startsWith('$') ? value : `$${value}`;
    }
    
    // Si es un número, solo agregar el signo $
    return `$${value}`;
  };

  return (
    <Autocomplete
      id="product-selector"
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
      disabled={disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Agregar Producto"
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
        // Extraer la key del objeto props
        const { key, ...otherProps } = props;
        
        return (
          <li key={key} {...otherProps}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {/* Mostrar precio tal como viene del backend */}
                  {`$${option.price_min || option.price_unit || option.price || 0}`}
                </Typography>
              </Box>
              {option.sku && (
                <Typography variant="caption" color="text.secondary">
                  SKU: {option.sku}
                </Typography>
              )}
              {option.code_miyi && (
                <Typography variant="caption" color="text.secondary">
                  Código: {option.code_miyi}
                </Typography>
              )}
            </Box>
          </li>
        );
      }}
    />
  );
} 