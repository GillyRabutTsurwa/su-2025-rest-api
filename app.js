require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const Site = require("./models/sites");
const Plugin = require("./models/plugins");
const Theme = require("./models/themes");
const User = require("./models/users");

const registerRouter = require("./router/register");
const loginRouter = require("./router/login");
const pluginRouter = require("./router/plugins");
const pluginAPIRouter = require("./router/api/plugins");
const themeRouter = require("./router/themes");

const app = express();
const PORT = 4000;
const environment = process.env.NODE_ENV;
const DATABASE_URL = environment === "development" ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL;

const databaseURL = DATABASE_URL;
const db = mongoose.connection;
const secretSession = session({
    secret: "susecret",
    resave: false,
    saveUninitialized: false,
});

app.use(express.json());
app.use(secretSession);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/register", registerRouter); //IMPORTANT: include this after passport initialisation logic
app.use("/login", loginRouter);
app.use("/plugins", pluginRouter);
app.use("/api/plugins", pluginAPIRouter);
app.use("/themes", themeRouter);

mongoose.connect(databaseURL);
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Successfully connected to the database`));

app.get("/", (request, response) => {
    response.redirect("/login");
});

// app.get("/sites", async (request, response) => {
//     try {
//         const sites = await Site.find();
//         response.json(sites);
//     } catch (error) {
//         response.json({ message: error.message });
//     } finally {
//         console.log("Data retrieval completed");
//     }
// });

// app.get("/sites/:name", async (request, response) => {
//     try {
//         const site = await Site.findOne({ name: request.params.name });
//         if (!site) throw new Error("Site could not be found"); // if name parametre doesn't return site data
//         response.json(site);
//     } catch (error) {
//         response.json({ message: error.message });
//     } finally {
//         console.log("Data retrieval completed");
//     }
// });

app.get("/logout", (request, response) => {
    request.logout((err) => {
        if (err) {
            console.error(err);
        }
        response.redirect("/");
    });
});

app.get("/create-plugin", isLoggedIn, (request, response) => {
    response.render("create-plugin");
});

function isLoggedIn(req, res, next) {
    // NOTE: great post that explains source of isAuthenticated() https://stackoverflow.com/questions/65387843/express-request-isauthenticated
    if (req.isAuthenticated()) {
        console.log(req.user);
        return next();
    }
    res.redirect("/login");
}

// middleware to not show the login page and redirect to plugin if user is already logged in
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect("/plugins");
//     }
//     return next();
// }

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
