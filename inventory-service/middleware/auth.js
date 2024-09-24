const { verifyToken } = require("../utils/auth");

const authenticateService = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(' ')[1];
    const isValid = await verifyToken(token);

    if(!isValid) return res.status(401).json({ error: "Invalid token" });
    next();
}

module.exports = authenticateService;