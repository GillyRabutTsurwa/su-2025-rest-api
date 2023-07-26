import express, { Express, Request, Response, Router, NextFunction } from "express";
import bodyParser, { BodyParser } from "body-parser";
import Plugin from "../models/plugins";

const router: Router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async (request: Request, response: Response) => {
    console.log(request.user);
    const plugins = await Plugin.find({});
    response.render("plugins", {
        plugins: plugins,
        user: request.isAuthenticated() ? request.user : null, //NOTE: if there's an authenticated user pass user data, else don't pass anything
    });
});

router.get("/:name", async (request: Request, response: Response) => {
    try {
        const plugin = await Plugin.findOne({ codebaseName: request.params.name }).exec();
        if (!plugin) throw new Error("Plugin could not be found");
        // response.json(plugin); // will do this in the /api/plugin/:name route
        response.render("plugin", {
            plugin: plugin,
        });
    } catch (error: any) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.post("/", async (request: Request, response: Response) => {
    const plugin = new Plugin({
        name: request.body.name,
        creator: request.body.creator,
        description: request.body.description,
        currentVersion: request.body.currentVersion,
        latestVersion: request.body.pluginVersion,
        isNetworkActive: request.body.pluginNetwork,
        sitesActivated: request.body.sitesActivated,
    });

    console.log(plugin);

    try {
        await Plugin.create(plugin);
        response.redirect(`/plugins/${plugin.codebaseName}`);
    } catch (error) {
        console.error(error);
    }
});

export default router;
