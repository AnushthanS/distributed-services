const axios = require('axios');
const jwt = require('jsonwebtoken');

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:2020';
const serviceId = process.env.SERVICE_ID;
const serviceSecret = process.env.SERVICE_SECRET;

let tokenCache = null;

async function getToken() {
    if(tokenCache && jwt.decode(tokenCache).exp > Date.now()/1000) return tokenCache;

    try{
        const response = await axios.post(`${authServiceUrl}/auth/token`, {
            serviceId: serviceId,
            secret: serviceSecret
        });
        console.log("Token generated: ", response.data);
        tokenCache = response.data.accessToken;
        console.log("Token fetched: ", tokenCache);
        return tokenCache;
    } catch(err){
        console.error(err.message);
        throw err;
    }
}

async function verifyToken(token) {
    try{
        const response = await axios.post(`${authServiceUrl}/auth/verify`, null, {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data.valid;
    } catch(err){
        console.error(err.message);
        return false;
    }
}

module.exports = { getToken, verifyToken }; 