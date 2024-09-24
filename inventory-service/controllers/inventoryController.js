const prisma = require("../prisma/prisma");

const healthCheck = async(req, res) => {
    try{
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "OK" });
    } catch(err){
        res.json(500).json({ status: "Error", message: err.message });
    }
}

module.exports = {
    healthCheck
}