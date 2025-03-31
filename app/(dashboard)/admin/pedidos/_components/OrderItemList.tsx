'use client';

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { OrderItem } from '@/types/orders';

interface OrderItemListProps {
  items: OrderItem[];
  onUpdateItem: (index: number, item: OrderItem) => void;
  onRemoveItem: (index: number) => void;
}

/**
 * Componente para mostrar y editar la lista de items de un pedido
 */
export default function OrderItemList({ items, onUpdateItem, onRemoveItem }: OrderItemListProps) {
  /**
   * Formatear número como moneda de manera consistente
   */
  const formatCurrency = (value: any) => {
    // Si es undefined o null, devuelve $0.00
    if (value === undefined || value === null || value === '') {
      return '$0.00';
    }
    
    // Convertir a número si es una cadena
    let numValue = 0;
    if (typeof value === 'string') {
      // Si es string, intentar extraer un número
      const matches = value.match(/[0-9]+(\.[0-9]+)?/);
      if (matches) {
        numValue = parseFloat(matches[0]);
      } else {
        numValue = 0;
      }
    } else {
      numValue = Number(value);
    }
    
    // Verificar si es un número válido
    if (isNaN(numValue)) {
      return '$0.00';
    }
    
    // Formatear como moneda
    return `$${numValue.toFixed(2)}`;
  };
  
  /**
   * Manejar cambios en la cantidad de un producto
   */
  const handleQuantityChange = (index: number, newValue: string) => {
    // Convertir a número si es posible
    const quantity = parseInt(newValue, 10) || 1;
    
    // Obtener el precio actual
    const currentItem = items[index];
    const price = typeof currentItem.price === 'string' 
      ? parseFloat(currentItem.price) 
      : Number(currentItem.price || 0);
    
    // Calcular el nuevo subtotal
    const subtotal = quantity * price;
    
    // Crear el item actualizado
    const updatedItem = {
      ...currentItem,
      quantity,
      subtotal
    };
    
    // Actualizar el item
    onUpdateItem(index, updatedItem);
  };
  
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {items.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="tabla de productos">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      sx={{ width: '80px' }}
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      aria-label="eliminar" 
                      onClick={() => onRemoveItem(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          No hay productos agregados al pedido
        </Typography>
      )}
    </Box>
  );
} 