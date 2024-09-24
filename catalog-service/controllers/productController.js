const prisma = require("../prisma/prisma");

const redisClient = require("../redis/redisClient");

const getAllProducts = async(req, res) => {
    try{
        const cachedData = await redisClient.get('allProducts');
        if(cachedData){
            console.log('Cached data fetched');
            return res.json(JSON.parse(cachedData));
        }

        const products = await prisma.product.findMany();
        await redisClient.set('allProducts', JSON.stringify(products), 'EX', 3600);

        res.json(products);
    } catch(err){
        res.status(500).json({ error: "Error fetching products" });
    }
};

const getProductById = async (req, res) => {
    try{
        const productId = parseInt(req.params.id);
        const cachedData = await redisClient.get(`product:${productId}`);
        if(cachedData){
            console.log('Cached data fetched');
            return res.json(JSON.parse(cachedData));
        }

        const product = await prisma.product.findUnique(
            {
                where: { id:  productId },
            }
        );

        if(product){
            await redisClient.set(`product:${productId}`, JSON.stringify(product), 'EX', 3600);
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

        await redisClient.del('allProducts');
        await redisClient.set(`product:${newProduct.id}`, JSON.stringify(newProduct), 'EX', 3600);

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
        await redisClient.del('allProducts');
        await redisClient.set(`product:${updatedProduct.id}`, JSON.stringify(updatedProduct), 'EX', 3600);

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
        await redisClient.del('allProducts');
        await redisClient.del(`product:${deletedProduct.id}`);

        res.status(204).send();
    } catch(error){
        console.error(error);
        res.status(400).json({ error: "Error deleting product"} );
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
    healthCheck
};