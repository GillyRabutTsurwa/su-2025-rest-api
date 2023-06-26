const express = require("express");
const router = express.Router();

const Theme = require("../models/themes");

router.get("/", async (request, response) => {
    const themes = await Theme.find();
    response.json(themes);
});

router.get("/:name", async (request, response) => {
    try {
        const plugin = await Theme.findOne({ codebaseName: request.params.name });
        if (!plugin) throw new Error("Theme could not be found");
        response.json(plugin);
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.post("/", async (request, response) => {
    const theme = new Theme({
        name: request.body.name,
        codebaseName: request.body.codebaseName,
        sitesUsingTheme: request.body.sitesUsingTheme,
    });

    const newTheme = await Theme.create(theme);
    console.log(theme);
    response.json(newTheme);
});

module.exports = router;
