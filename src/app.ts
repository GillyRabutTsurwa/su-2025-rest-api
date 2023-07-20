import * as dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser, { BodyParser } from "body-parser";
import session, { SessionData, SessionOptions } from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

dotenv.config();

// import User from "./models/users";
// import registerRouter from "./router/register";
// import loginRouter from "./router/login";
import pluginRouter from "./router/plugins";
import pluginAPIRouter from "./router/api/plugins";
// import themeRouter from "./router/themes";
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
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new Strategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use("/register", registerRouter); //IMPORTANT: include this after (not before) passport initialisation logic
// app.use("/login", loginRouter);
app.use("/plugins", pluginRouter);
app.use("/api/plugins", pluginAPIRouter);
app.use("/api/themes", themeAPIRouter);
// app.use("/themes", themeRouter);
// app.use("/sites", siteRouter);

(() => {
    try {
        mongoose.connect(databaseURL);
        db.once("open", () => console.log(`Successfully connected to the database`));
    } catch (error) {
        db.on("error", (error) => console.error(error));
    } finally {
        console.log("Connection Attempt Complete. Turning On Debug Mode");
        mongoose.set("debug", true);
    }
})();

app.get("/", (request: Request, response: Response) => {
    response.send("hello world");
});

// app.get("/", (request: Request, response: Response) => {
//     response.render("index");
// });

// app.get("/logout", (request: Request, response: Response) => {
//     request.logout((err) => {
//         if (err) {
//             console.error(err);
//         }
//         response.redirect("/");
//     });
// });

// app.get("/create-plugin", isLoggedIn, (request: Request, response: Response) => {
//     response.render("create-plugin");
// });

// app.get("/create-theme", isLoggedIn, (request: Request, response: Response) => {
//     response.render("create-theme");
// });

// app.get("/create-site", isLoggedIn, (request: Request, response: Response) => {
//     response.render("create-site");
// });

// function isLoggedIn(req: Request, res: Response, next: NextFunction) {
//     // NOTE: great post that explains source of isAuthenticated() https://stackoverflow.com/questions/65387843/express-request-isauthenticated
//     if (req.isAuthenticated()) {
//         console.log(req.user);
//         return next();
//     }
//     res.redirect("/login");
// }

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
