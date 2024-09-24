require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    healthCheck
} = require("./controllers/orderController");
const prisma = require("./prisma/prisma");
const errorHandler = require("./middleware/error");

const app = express();
const port = process.env.PORT || 2001;

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.get("/", (req, res) =>{
    res.json({
        message: "Order Service"
    });
});

app.get("/orders", getAllOrders);
app.get("/orders/:id", getOrderById);
app.post("/orders", createOrder);
app.put("/orders/:id", updateOrder);
app.delete("/orders/:id", deleteOrder);
app.get("/health", healthCheck);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

if(require.main === module){
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = app;