'use client';

import { useState } from 'react';
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  IconButton,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';

import ClientSelect from './client-select';
import ProductSelect from './product-select';

export default function OrderForm() {
  const [expanded, setExpanded] = useState<string | false>('customer');
  const [customer, setCustomer] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [order, setOrder] = useState({
    total_bruto: 0,
    total: 0,
    delivery_cost: 0,
    discount: 0,
    payment_method: "",
    notes: "",
  });

  const handleChangePanel = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (!customer && panel !== 'customer') {
      // Mostrar error - se requiere elegir cliente primero
      return;
    }
    setExpanded(isExpanded ? panel : false);
  };

  const handleCustomerSelect = (selectedCustomer: any) => {
    setCustomer(selectedCustomer);
    setExpanded('items');
  };

  const handleAddProduct = (product: any) => {
    setItems([...items, product]);
    calculateTotal(true);
  };

  const handleRemoveProduct = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    calculateTotal(true);
  };

  const handleOrderFieldChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name as string]: value,
    });

    if (name === 'discount' || name === 'delivery_cost') {
      calculateTotal(false);
    }
  };

  const calculateTotal = (calculateDeliveryCost = true) => {
    // Cálculo total bruto basado en items
    const brutoTotal = items.reduce((sum, item) => sum + Number(item.price_final || 0), 0);
    
    // Cálculo de descuento
    let discountAmount = 0;
    if (order.discount > 0) {
      discountAmount = (order.discount * brutoTotal) / 100;
    }
    
    // Cálculo de costo de envío (si es necesario)
    let deliveryCost = Number(order.delivery_cost);
    if (calculateDeliveryCost) {
      deliveryCost = (brutoTotal > 0 && brutoTotal < 1500 && customer?.type === 'p') ? 150 : 0;
    }
    
    // Cálculo del total final
    const finalTotal = brutoTotal - discountAmount + deliveryCost;
    
    setOrder({
      ...order,
      total_bruto: brutoTotal,
      total: finalTotal,
      delivery_cost: deliveryCost,
    });
  };

  const handleSubmit = async () => {
    // Implementar lógica para guardar la orden
    console.log('Guardando orden:', { customer, items, ...order });
  };

  return (
    <div>
      {/* Panel Cliente */}
      <Accordion 
        expanded={expanded === 'customer'} 
        onChange={handleChangePanel('customer')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center">
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {customer ? `${customer.name} (${customer.type.toUpperCase()})` : 'Cliente'}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <ClientSelect onSelect={handleCustomerSelect} selectedCustomer={customer} />
        </AccordionDetails>
      </Accordion>

      {/* Panel Productos */}
      <Accordion 
        expanded={expanded === 'items'} 
        onChange={handleChangePanel('items')}
        disabled={!customer}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center">
            <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Productos (${order.total_bruto.toFixed(2)})
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* Lista de productos */}
          {items.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {items.map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} x ${item.price_unit} 
                      {item.discount > 0 && ` (-${item.discount}%)`}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" fontWeight="bold" sx={{ mr: 2 }}>
                      ${item.price_final}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No hay productos en esta orden
            </Typography>
          )}

          {/* Selector de productos */}
          <ProductSelect 
            onAddProduct={handleAddProduct} 
            customerType={customer?.type || 'p'}
          />
        </AccordionDetails>
      </Accordion>

      {/* Panel Extras */}
      <Accordion 
        expanded={expanded === 'extras'} 
        onChange={handleChangePanel('extras')}
        disabled={!customer}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center">
            <AddShoppingCartIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Extras (${((order.discount > 0 ? -((order.discount * order.total_bruto) / 100) : 0) + order.delivery_cost).toFixed(2)})
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Método de pago</InputLabel>
                <Select
                  labelId="payment-method-label"
                  name="payment_method"
                  value={order.payment_method}
                  onChange={handleOrderFieldChange}
                  label="Método de pago"
                >
                  <MenuItem value="">No definido</MenuItem>
                  <MenuItem value="ef">Efectivo</MenuItem>
                  <MenuItem value="trans">Transferencia</MenuItem>
                  <MenuItem value="mp">Mercado Pago</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Descuento (%)"
                name="discount"
                type="number"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0, max: 100 }
                }}
                value={order.discount}
                onChange={handleOrderFieldChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Costo de envío"
                name="delivery_cost"
                type="number"
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                value={order.delivery_cost}
                onChange={handleOrderFieldChange}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Panel Notas */}
      <Accordion 
        expanded={expanded === 'notes'} 
        onChange={handleChangePanel('notes')}
        disabled={!customer}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center">
            <InsertCommentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Notas del pedido</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            name="notes"
            label="Notas"
            multiline
            rows={4}
            value={order.notes}
            onChange={handleOrderFieldChange}
          />
        </AccordionDetails>
      </Accordion>

      {/* Panel Total */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'success.light',
          borderRadius: 1,
          mb: 2
        }}
      >
        <Box display="flex" alignItems="center">
          <AttachMoneyIcon sx={{ color: 'success.dark', mr: 1 }} />
          <Typography variant="h5" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
            Total pedido: ${order.total.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={!customer || items.length === 0}
        >
          Guardar Pedido
        </Button>
      </Box>
    </div>
  );
} 