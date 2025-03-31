'use client';

import { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Grid,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Chip,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PercentIcon from '@mui/icons-material/Percent';
import { ProductService } from '@/utils/api/services';
import { Product } from '@/types/products';

interface ProductSelectProps {
  onAddProduct: (product: any) => void;
  customerType: 'p' | 'm';
}

export default function ProductSelect({ onAddProduct, customerType }: ProductSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [errors, setErrors] = useState<{quantity?: string, discount?: string}>({});
  const [loading, setLoading] = useState(false);

  // Obtener el precio apropiado según el tipo de cliente
  const getPrice = (product: Product | null) => {
    if (!product) return 0;
    // Aquí se podría implementar lógica para precios diferentes según tipo de cliente
    // si la API lo soporta
    return product.price || 0;
  };

  // Calcular precio final
  const calculateFinalPrice = () => {
    if (!selectedProduct) return 0;
    const basePrice = getPrice(selectedProduct) * quantity;
    const discountAmount = basePrice * (discount / 100);
    return basePrice - discountAmount;
  };

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAll({
          search: searchQuery,
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
  }, [searchQuery]);

  const handleAddProduct = () => {
    const newErrors: {quantity?: string, discount?: string} = {};
    
    if (quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor que 0';
    }
    
    if (discount < 0 || discount > 100) {
      newErrors.discount = 'El descuento debe estar entre 0 y 100';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0 && selectedProduct) {
      const finalPrice = calculateFinalPrice();
      
      const productToAdd = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        quantity: quantity,
        price_unit: getPrice(selectedProduct),
        price_final: finalPrice,
        discount: discount,
        type_product: selectedProduct.category_id ? 'u' : 'w', // Ajustar según la estructura real
      };
      
      onAddProduct(productToAdd);
      setSelectedProduct(null);
      setQuantity(1);
      setDiscount(0);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Agregar producto
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar producto"
                  variant="outlined"
                  fullWidth
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
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description || option.sku || ''}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" fontWeight="bold">
                      ${option.price} 
                    </Typography>
                    {option.sku && (
                      <Chip
                        label={`SKU: ${option.sku}`}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </li>
              )}
              onChange={(_event, newValue) => {
                setSelectedProduct(newValue);
                // Reset quantity and discount when product changes
                setQuantity(1);
                setDiscount(0);
                setErrors({});
              }}
              value={selectedProduct}
            />
          </Grid>
          
          {selectedProduct && (
            <>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth error={!!errors.quantity}>
                  <InputLabel htmlFor="quantity">Cantidad</InputLabel>
                  <OutlinedInput
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    endAdornment={
                      <InputAdornment position="end">
                        u
                      </InputAdornment>
                    }
                    inputProps={{ min: 0.1, step: 1 }}
                    label="Cantidad"
                  />
                  {errors.quantity && <FormHelperText>{errors.quantity}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={6} md={2}>
                <FormControl fullWidth error={!!errors.discount}>
                  <InputLabel htmlFor="discount">Descuento</InputLabel>
                  <OutlinedInput
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    endAdornment={
                      <InputAdornment position="end">
                        <PercentIcon fontSize="small" />
                      </InputAdornment>
                    }
                    inputProps={{ min: 0, max: 100 }}
                    label="Descuento"
                  />
                  {errors.discount && <FormHelperText>{errors.discount}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography variant="body1">
                    Precio: ${getPrice(selectedProduct)} × {quantity} 
                    {discount > 0 && ` - ${discount}%`}
                  </Typography>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ display: 'inline' }}>
                      Total: ${calculateFinalPrice().toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddProduct}
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      Agregar
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
} 