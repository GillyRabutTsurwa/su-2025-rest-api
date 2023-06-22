require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const Site = require("./models/sites");
const Plugin = require("./models/plugins");
const Theme = require("./models/themes");

const app = express();
const PORT = 4000;
const environment = process.env.NODE_ENV;
const DATABASE_URL = environment === "development" ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL;

const databaseURL = DATABASE_URL;
const db = mongoose.connection;

console.log(process.env.NODE_ENV);

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

// Requests for Theme Data
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

app.post("/themes", async (request, response) => {
    const theme = new Theme({
        name: request.body.name,
        codebaseName: request.body.codebaseName,
        sitesUsingTheme: request.body.sitesUsingTheme,
    });

    const newTheme = await Theme.create(theme);
    console.log(theme);
    response.json(newTheme);
});

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
