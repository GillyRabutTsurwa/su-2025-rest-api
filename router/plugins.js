const express = require("express");
const router = express.Router();

const Plugin = require("../models/plugins");

router.get("/", async (request, response) => {
    console.log(request.user);
    const plugins = await Plugin.find({});
    response.render("plugins", {
        plugins: plugins,
        user: request.isAuthenticated() ? request.user : null, //NOTE: if there's an authenticated user pass user data, else don't pass anything
    });
});

router.get("/:name", async (request, response) => {
    try {
        const plugin = await Plugin.findOne({ codebaseName: request.params.name });
        if (!plugin) throw new Error("Plugin could not be found");
        // response.json(plugin); // will do this in the /api/plugin/:name route
        response.render("plugin", {
            plugin: plugin,
        });
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.post("/", async (request, response) => {
    console.log(request.body);
    const plugin = new Plugin({
        name: request.body.name,
        creator: request.body.creator,
        currentVersion: request.body.currentVersion,
        latestVersion: request.body.latestVersion,
        isNetworkActive: request.body.isNetworkActive,
        sitesActivated: request.body.sitesActivated,
    });

    try {
        const newPlugin = await Plugin.create(plugin);
        console.log(newPlugin);
    } catch (error) {
        //
    }
});

module.exports = router;
