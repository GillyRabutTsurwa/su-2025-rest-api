const express = require("express");
const router = express.Router();

const Plugin = require("../../models/plugins");

router.get("/", async (request, response) => {
    const plugins = await Plugin.find();
    response.json(plugins);
});

module.exports = router;
