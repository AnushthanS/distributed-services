const axios = require("axios");

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:2000';

const healthCheck = async(req, res) => {
    try{
        const {data: status} =  await axios.get(`${PRODUCT_SERVICE_URL}/health`);
        res.status(200).json(status);
    } catch(err){
        res.status(500).json({
            status: "Error",
            message: err.message
        });
    }
}

module.exports = {
    healthCheck
}