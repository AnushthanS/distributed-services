const prisma = require("../prisma/prisma");

const getAllProducts = async(req, res) => {
    try{
        const products = await prisma.product.findMany();
        res.json(products);
    } catch(err){
        res.status(500).json({ error: "Error fetching products" });
    }
};

const getProductById = async (req, res) => {
    try{
        const product = await prisma.product.findUnique(
            {
                where: { id: parseInt(req.params.id) },
            }
        );

        if(product){
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    }  catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

const createProduct = async(req, res) => {
    try{
        const newProduct = await prisma.product.create(
            {
                data: req.body
            }
        );
        res.status(201).json(newProduct);
    } catch(error){
        res.status(400).json({ error: "Error creating product" });
    }
};

const updateProduct = async(req, res) => {
    try{
        const updatedProduct = await prisma.product.update(
            {
                where: { id: parseInt(req.params.id) },
                data: req.body
            }
        );
        res.json(updatedProduct);
    } catch(error){
        console.error(error);
        res.status(400).json({ error: "Error updating product"} );
    }
};

const deleteProduct = async (req, res) => {
    try{
        const deletedProduct = await prisma.product.delete({
            where: {id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch(error){
        console.error(error);
        res.status(400).json({ error: "Error deleting product"} );
    }
};

const stockCheck = async(req, res) => {
    try{
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            select: { id: true, name: true, stockQuantity: true },
        });

        if(!product) return res.status(404).json({ error: "Product not found" });

        res.json({
            id: product.id,
            name: product.name,
            inStock: product.stockQuantity > 0,
            stockQuantity: product.stockQuantity
        });
    } catch(error){
        res.status(500).json({ error: "Error checking stock"} );
    }
};

const healthCheck = async (req, res) => {
    try{
        await prisma.$queryRaw`SELECT 1;`;
        res.status(200).json({ status: "OK" });
    } catch(error){
        res.status(500).json({ status: 'Error', message: error.message});
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    stockCheck,
    healthCheck
};