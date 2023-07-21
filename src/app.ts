import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser, { BodyParser } from "body-parser";
import session, { SessionData, SessionOptions } from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

dotenv.config();

import User from "./models/users";
import registerRouter from "./router/register";
import loginRouter from "./router/login";
import pluginRouter from "./router/plugins";
import pluginAPIRouter from "./router/api/plugins";
import themeRouter from "./router/themes";
import themeAPIRouter from "./router/api/themes";
// import siteRouter from "./router/sites";

const app: Express = express();
const PORT: number = 4000;
const environment: string = process.env.NODE_ENV || "development";
const DATABASE_URL: string = environment === "development" ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL;

const databaseURL: string = DATABASE_URL;
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
//NEWIMPORTANTNOTE: after moving things around, i had to explicity set the root path for the views directory
// this way, the app knows where to look for the ejs templates
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

//@ts-ignore
passport.use(new Strategy(User.authenticate()));
//@ts-ignore
passport.serializeUser(User.serializeUser());
//@ts-ignore
passport.deserializeUser(User.deserializeUser());

app.use("/register", registerRouter); //IMPORTANT: include this after (not before) passport initialisation logic
app.use("/login", loginRouter);
app.use("/plugins", pluginRouter);
app.use("/api/plugins", pluginAPIRouter);
app.use("/themes", themeRouter);
app.use("/api/themes", themeAPIRouter);
// app.use("/sites", siteRouter);

(async () => {
    try {
        const connection = await mongoose.connect(databaseURL);
        console.log(`Connected to Database ${connection.connection.db.databaseName} @ Host ${connection.connection.host}`);
    } catch (error) {
        console.error(`Erreur: ${error}`);
    } finally {
        mongoose.set("debug", true);
    }
})();

app.get("/", (request: Request, response: Response) => {
    response.render("index");
});

app.get("/logout", (request: Request, response: Response) => {
    request.logout((err) => {
        if (err) {
            console.error(err);
        }
        response.redirect("/");
    });
});

app.get("/create-plugin", isLoggedIn, (request: Request, response: Response) => {
    response.render("create-plugin");
});

app.get("/create-theme", isLoggedIn, (request: Request, response: Response) => {
    response.render("create-theme");
});

app.get("/create-site", isLoggedIn, (request: Request, response: Response) => {
    response.render("create-site");
});

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    // NOTE: great post that explains source of isAuthenticated() https://stackoverflow.com/questions/65387843/express-request-isauthenticated
    if (req.isAuthenticated()) {
        console.log(req.user);
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
