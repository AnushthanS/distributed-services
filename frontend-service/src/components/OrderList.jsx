import { getOrders, updateOrderStatus } from "../lib/api";
import { useState, useEffect } from "react";

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders at OrderList: ", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh the order list
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="border rounded-md p-4 shadow-sm">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-600">Total: ${order.totalAmount}</p>
                    <p className="text-gray-600">Status: {order.status}</p>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="mt-2 p-2 border rounded"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                </div>
            ))}
        </div>
    );
}

export default OrderList;