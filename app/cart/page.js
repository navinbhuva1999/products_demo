"use client";

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Stack } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function Cart() {
  const router = useRouter();
  const { authState, logout } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.replace('/login');
    }
  }, [authState.isAuthenticated, router]);

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ padding: 4, maxWidth: '1200px', margin: '80px auto 0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Shopping Cart</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={logout}
        >
          Logout
        </Button>
      </Box>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Your cart is empty</Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            Go to Home
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'contain' }}
                        />
                        <Typography>{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${item.sale_price}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      ${(item.sale_price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
} 