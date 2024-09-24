const redisClient = require("../redis/redisClient");

const flushAllCache = async(req, res) => {
    try{
        await redisClient.flushall();
        res.status(200).json({
            message: "Cache successfully flushed"
        });
    } catch(err){
        console.error("Error flushing cache: ", error);
        res.status(500).json({ error: 'Error flushing cache' });
    }
}

const flushDBCache = async(req, res) => {
    try{
        await redisClient.flushdb();
        res.status(200).json({
            message: "Current DB cache successfully flushed"
        });
    } catch(err) {
        console.error("Error flushing DB cache: ", error);
        res.status(500).json({ error: 'Error flushing DB cache' });
    }
}

module.exports = {
    flushAllCache,
    flushDBCache
}