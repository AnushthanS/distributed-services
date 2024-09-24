const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
    healthCheck
} = require("./controllers/inventoryController");

const app = express();
const PORT = process.env.PORT || 2002;

app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Inventory Service"
    })
});

app.get("/health", healthCheck);

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