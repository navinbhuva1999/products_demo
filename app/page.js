"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";



export default function Home() {

  const router = useRouter();
  const {authState} = useAuth()
  const [productsList, setProductsList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const isUser = authState.currentUser ? JSON.parse(authState.currentUser) : null
  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("https://www.jsonkeeper.com/b/K88F").then(res => res.json())
      setIsLoading(false)
      setProductsList(res.products)
      setTotalCount(res.count)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleAddCount = () => {
    if(authState.isAuthenticated){
      setTotalCount((prev) => prev + 1)
    }
    else {
      router.replace("/login")
    }
  }

  console.log("count..", totalCount)
  return (
    <div>
      <Box>
        <Grid2 container spacing={2}>
        {productsList.slice(0, 10).map((product) => {
          return (
            <Grid2 size={4}  key={product.id} >
            <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={product.image}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Price : {product.sale_price}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleAddCount}>Add to Count</Button>
            </CardActions>
          </Card>
          </Grid2>
          )
        })}
        </Grid2>
      </Box>
    </div>
  );
}
