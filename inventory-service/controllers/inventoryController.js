const axios = require("axios");

const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:2000';
const { getToken } = require("../utils/auth");
const authenticateService = require("../middleware/auth");

const healthCheck = [authenticateService, async(req, res) => {
    try{
        const token = getToken();
        const {data: status} =  await axios.get(`${productServiceUrl}/health`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.status(200).json(status);
    } catch(err){
        res.status(500).json({
            status: "Error",
            message: err.message
        });
    }
}]

const inventoryCheck = [authenticateService, async(req, res) => {
    try{
        const {id, requiredQuantity} = req.body;
        const token = getToken();
        const { data: product } = await axios.get(`${productServiceUrl}/products/${id}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if(!product) return res.status(404).json({
            error: "Product not found!"
        });

        res.json({
            inStock: product.stockQuantity > 0,
            canOrder: product.stockQuantity >= requiredQuantity
        });
    } catch(err){
        res.status(500).json({
            from: "inventoryCheck",
            error: err.message
        });
    }
}]

const inventoryChange = [authenticateService, async(req, res) => {
    try{
        const id = parseInt(req.params.id);
        const {quantity} = req.body;
        const token = getToken();

        await axios.put(`${productServiceUrl}/products/${id}`, {
            stockQuantity: {
                decrement: quantity
            }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.status(201).json({
            status: "success"
        });
    } catch(err){
        res.status(500).json({
            error: err.message
        });
    }
}]


module.exports = {
    healthCheck,
    inventoryCheck,
    inventoryChange
}