const express = require("express");
const router = express.Router();
const { flushAllCache, flushDBCache} = require("../middleware/redis");

router.post("/flush/all", flushAllCache);
router.post("/flush/db", flushDBCache);

module.exports = router