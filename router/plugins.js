const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Plugin = require("../models/plugins");

router.get("/", async (request, response) => {
    console.log(request.user);
    const plugins = await Plugin.find({});
    response.render("plugins", {
        plugins: plugins,
        user: request.isAuthenticated() ? request.user : null, //NOTE: if there's an authenticated user pass user data, else don't pass anything
    });
});

router.get("/:id", async (request, response) => {
    try {
        const plugin = await Plugin.findOne({ _id: request.params.id }).exec();
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
    const plugin = new Plugin({
        name: request.body.name,
        creator: request.body.creator,
        currentVersion: request.body.currentVersion,
        latestVersion: request.body.pluginVersion,
        isNetworkActive: request.body.pluginNetwork,
        sitesActivated: request.body.sitesActivated,
    });

    console.log(plugin);

    try {
        await Plugin.create(plugin);
        response.redirect(`/plugins/${plugin._id}`);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
