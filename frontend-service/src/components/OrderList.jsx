import { getOrders } from "../lib/api";
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

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="border rounded-md p-4 shadow-sm">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-600">Total: ${order.totalAmount}</p>
                    <p className="text-gray-600">Status: {order.status}</p>
                </div>
            ))}
        </div>
    );
}

export default OrderList;