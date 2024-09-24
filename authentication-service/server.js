require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./prisma/prisma");

const {
    registerService,
    verifyService,
    refreshAuth,
    getTokens
} = require("./controllers/authController");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 2020;

app.post("/auth/register", registerService);
app.post("/auth/verify", verifyService);
app.post("/auth/token", getTokens);
app.post("/auth/token/refresh", refreshAuth);

if(require.main === module) {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = app;