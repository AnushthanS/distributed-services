const prisma = require('../prisma/prisma');
const inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:2002';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:2000';
const axios = require("axios");

const { getToken } = require('../utils/auth');
const authenticateService = require('../middleware/auth');

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { orderItems: true }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { orderItems: true }
        });
        if (order) res.json(order);
        else res.status(404).json({ error: "Order not found" });
    } catch (error) {
        res.status(500).json({ error: "Error fetching order" });
    }
};

const createOrder =  [authenticateService, async (req, res) => {
    try {
        const { userId, orderItems } = req.body;
        const token = await getToken();

        for (const item of orderItems) {
            const { data: stockInfo } = await axios.post(`${inventoryServiceUrl}/inventory`, {
                id: item.productId,
                requiredQuantity: item.quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!stockInfo.inStock || !stockInfo.canOrder) {
                return res.status(400).json({ error: `Insufficient stock for product ${item.name}` });
            }
        }

        let totalAmount = 0;
        for (const item of orderItems) {
            const { data: product } = await axios.get(`${productServiceUrl}/products/${item.productId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            totalAmount += product.price * item.quantity;
        }

        const newOrder = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: "PENDING",
                orderItems: {
                    create: orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    })),
                },
            },
            include: { orderItems: true },
        });

        for (const item of orderItems) {
            await axios.put(`${inventoryServiceUrl}/inventory/${item.productId}`, {
                quantity: item.quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creating order: ", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error creating order", details: error.response ? error.response.data : error.message });
    }
}];

const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
            include: { orderItems: true }
        });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: "Error updating order" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await prisma.orderItem.deleteMany({
            where: { orderId: parseInt(req.params.id) }
        });

        await prisma.order.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: "Error deleting order" });
    }
};

const healthCheck = async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "OK" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    healthCheck
};