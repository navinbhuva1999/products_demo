"use client";

import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid2, Typography, Select, MenuItem, FormControl, InputLabel, AppBar, Toolbar, Badge } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from './context/CartContext';

export default function Home() {

  const router = useRouter();
  const { authState, logout } = useAuth()
  const { addToCart, getCartTotal } = useCart();
  
  const [productsList, setProductsList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [itemsPerPage])

  const endIndex = page * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;
  const currentItems = productsList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(productsList.length / itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
  };

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("https://www.jsonkeeper.com/b/K88F").then(res => res.json())
      setIsLoading(false)
      setProductsList(res.products)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    if (authState.isAuthenticated) {
      addToCart(product);
    } else {
      router.replace("/login");
    }
  };

  const handleCartClick = () => {
    if (!authState.isAuthenticated) {
      router.replace("/login");
      return;
    }
    router.push("/cart");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            Shopping
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge 
              badgeContent={getCartTotal()} 
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={handleCartClick}
            >
              <ShoppingCartIcon />
            </Badge>
            
            {authState.isAuthenticated ? (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto', mt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Our Products
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading products...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="items-per-page-label">Items per page</InputLabel>
                <Select
                  labelId="per-page"
                  id="items-page"
                  value={itemsPerPage}
                  label="Items per page"
                  onChange={handleItemsPerPageChange}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid2 container spacing={3}>
              {currentItems.map((product) => (
                <Grid2 size={4} key={product.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                      }
                    }}
                  >
                    <CardMedia
                      sx={{ height: 200, backgroundSize: 'contain' }}
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        ${product.sale_price}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        variant="contained" 
                        size="medium" 
                        onClick={() => handleAddToCart(product)}
                        sx={{ minWidth: '150px' }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid2>
              ))}
            </Grid2>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 4, 
              px: 2 
            }}>
              <Typography>
                Showing {startIndex + 1}-{Math.min(endIndex, productsList.length)} of {productsList.length} items
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined"
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <Typography sx={{ alignSelf: 'center' }}>
                  Page {page} of {totalPages}
                </Typography>
                <Button 
                  variant="outlined"
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
