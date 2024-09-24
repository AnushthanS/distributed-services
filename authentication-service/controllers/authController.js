const prisma = require("../prisma/prisma");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateAccessToken = (serviceId) => {
    return jwt.sign({ serviceId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m"
    })
}

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
}

const registerService = async (req, res) => {
    const { serviceId, secret } = req.body;
    try {
        const existingService = await prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (existingService) return res.status(400).json({ error: "Service already exists" });

        const hashedSecret = await bcrypt.hash(secret, 10);
        const newService = await prisma.service.create({
            data: {
                id: serviceId,
                secret: hashedSecret
            }
        });

        res.status(201).json({
            message: 'Service registered successfully',
            serviceId: newService.id
        });
    } catch (err) {
        return res.status(500).json(
            {
                status: "ERROR",
                message: res.err.message ? res.err.message : err.message
            }
        );
    }
}

const verifyService = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
        error: "No token provided!"
    });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, serviceId: decoded.serviceId });
    } catch (error) {
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
}

const refreshService = async(req, res) => {
    const { refreshToken } = req.body;
    try{
        const savedToken = await prisma.refreshToken.findUnique(
            {
                where: { token: refreshToken}
            }
        );
    } catch(err){

    }
}


module.exports = {
    registerService,
    verifyService
}