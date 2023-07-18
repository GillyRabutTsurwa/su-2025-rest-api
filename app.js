require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

//NOTE: no longer using these in this file. will delete in next commit
const Site = require("./models/sites");
const Plugin = require("./models/plugins");
const Theme = require("./models/themes");

const User = require("./models/users");

const registerRouter = require("./router/register");
const loginRouter = require("./router/login");
const pluginRouter = require("./router/plugins");
const pluginAPIRouter = require("./router/api/plugins");
const themeRouter = require("./router/themes");
const siteRouter = require("./router/sites");

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
app.use(bodyParser.json());
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
app.use("/sites", siteRouter);

mongoose.connect(databaseURL);
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Successfully connected to the database`));

app.get("/", (request, response) => {
    response.render("index");
});

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

app.get("/create-theme", isLoggedIn, (request, response) => {
    response.render("create-theme");
});

app.get("/create-site", isLoggedIn, (request, response) => {
    response.render("create-site");
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

/*
 <% files.forEach((currentFile) => { %>
     <li><%= currentFile.name %></li>
     <% if (currentFile.type === "dir") { %>
        <li>
            <%= currentFilename.name %>i
            
        </li>

     <% } %>
    <% }) %>
 */
