import { useEffect, useState } from "react";
import { getProducts, checkINventory, createOrder } from "../lib/api";
import { Box, Button, VStack, Text } from "@chakra-ui/react";

const Catalog = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async() => {
        try{
            const data = await getProducts();
            setProducts(data);
        } catch(error) {
            console.error("Error fetching products at Catalog page: ", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleBuy = async(product) => {
        try{
            const inventoryCheck = await checkInventory(product.id);
            if(inventoryCheck.canOrder){
                const order = await createOrder({
                    userId: 1,
                    orderItems: [{ productId: product.id, quantity: 1, price: product.price}]
                });

                console.log("Order created: ", order);
                alert("Order placed successfully");
            } else {
                alert("Product is out of stock");
            }
        } catch(error) {
            console.error("Error placing order: ", error);
            alert("Failed to place order");
        }
    };

    return (
        <VStack spacing={4} align="stretch">
            {products.map((product) => {
                <Box key={product.id} p={4} borderWidth={1} borderRadius="md">
                    <Text fontWeight="bold">{product.name}</Text>
                    <Text>${product.price}</Text>
                    <Button onClick={() => handleBuy(product)} colorScheme="blue" size="sm" mt={2}>
                        Buy
                    </Button>
                </Box>
            })}
        </VStack>
    );
}

export default Catalog;