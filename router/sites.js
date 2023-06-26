const express = require("express");
const router = express.Router();

const Site = require("../models/sites");

router.get("/", async (request, response) => {
    try {
        const sites = await Site.find();
        response.json(sites);
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.get("/:name", async (request, response) => {
    try {
        const site = await Site.findOne({ name: request.params.name });
        if (!site) throw new Error("Site could not be found"); // if name parametre doesn't return site data
        response.json(site);
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.post("/", async (request, response) => {
    console.log(request.body);
    const site = new Site({
        name: request.body.name,
        activeTheme: request.body.activeTheme,
    });

    try {
        const newSite = await Site.create(site);
        console.log(newSite);
    } catch (error) {
        //
    }
});
