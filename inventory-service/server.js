const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
    healthCheck,
    inventoryCheck,
    inventoryChange
} = require("./controllers/inventoryController");

const errorHandler = require("./middleware/error");

const app = express();
const PORT = process.env.PORT || 2002;

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        message: "Inventory Service"
    })
});

app.get("/health", healthCheck);
app.post("/inventory", inventoryCheck);
app.put("/inventory/:id", inventoryChange);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

if(require.main === module) {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

module.exports = app;