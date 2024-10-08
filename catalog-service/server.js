const express =  require("express");
const cors = require("cors");
require("dotenv").config();
const prisma = require("./prisma/prisma");

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    healthCheck
} = require("./controllers/productController");

const errorHandler = require("./middleware/error");

const app = express();
const port = process.env.PORT || 2000;


const redisRouter = require("./router/redisRouter");

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.get("/", (req, res) => {
   res.json({
    message: "Product Catalog Service"
   }); 
});

app.use('/cache', redisRouter);

app.get("/products", getAllProducts);
app.get("/products/:id", getProductById);
app.post("/products", createProduct);
app.put("/products/:id", updateProduct);
app.delete("/products/:id", deleteProduct);
app.get("/health", healthCheck);


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