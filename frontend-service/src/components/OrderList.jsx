import { getOrders } from "../services/api";
import { VStack, Box, Text } from "@chakra-ui/react";

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async() => {
        try{
            const data = await getOrders();
            setOrders(data);
        } catch(error) {
            console.error("Error fetching orders at OrderList: ", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <VStack spacing={4} align="stretch">
            {orders.map((order) => {
                <Box key={order.id} p={4} borderWidth={1} borderRadius="md">
                    <Text fontWeight="bold">Order #{order.id}</Text>
                    <Text>Total: ${order.totalAmount}</Text>
                    <Text>Status: {order.status}</Text>
                </Box>
            })}
        </VStack>
    );
}

export default OrderList;