const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    healthCheck
} = require("./controllers/orderController");

const app = express();
const port = process.env.PORT || 2001;

app.use(cors());
app.use(express.json());

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

module.exports = app;