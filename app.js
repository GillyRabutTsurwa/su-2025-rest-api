const express = require("express");
const mongoose = require("mongoose");

const Site = require("./models/sites");
const Plugin = require("./models/plugins");
const Theme = require("./models/themes");

const app = express();
const PORT = 4000;

const databaseURL = "mongodb://127.0.0.1:27017/su2025";
const db = mongoose.connection;

app.use(express.json());
mongoose.connect(databaseURL);
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Successfully connected to the database`));

app.get("/", (request, response) => {
    response.send("<h2>Might make this a full stack app later. On va voir</h2>");
});

app.get("/sites", async (request, response) => {
    try {
        const sites = await Site.find();
        response.json(sites);
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

app.get("/sites/:name", async (request, response) => {
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

app.get("/plugins", async (request, response) => {
    const plugins = await Plugin.find();
    response.json(plugins);
});

app.get("/plugins/:name", async (request, response) => {
    try {
        const plugin = await Plugin.findOne({ name: request.params.name });
        if (!plugin) throw new Error("Plugin could not be found");
        response.json(plugin);
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

app.get("/themes", async (request, response) => {
    const themes = await Theme.find();
    response.json(themes);
});

app.get("/themes/:name", async (request, response) => {
    try {
        const plugin = await Plugin.findOne({ name: request.params.name });
        if (!plugin) throw new Error("Plugin could not be found");
        response.json(plugin);
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
