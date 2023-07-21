"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
dotenv.config();
// import User from "./models/users";
// import registerRouter from "./router/register";
// import loginRouter from "./router/login";
const plugins_1 = __importDefault(require("./router/plugins"));
const plugins_2 = __importDefault(require("./router/api/plugins"));
// import themeRouter from "./router/themes";
const themes_1 = __importDefault(require("./router/api/themes"));
// import siteRouter from "./router/sites";
const app = (0, express_1.default)();
const PORT = 4000;
const environment = process.env.NODE_ENV || "development";
const DATABASE_URL = environment === "development" ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL;
const databaseURL = DATABASE_URL;
const db = mongoose_1.default.connection;
const secretSession = (0, express_session_1.default)({
    secret: "susecret",
    resave: false,
    saveUninitialized: false,
});
app.use(express_1.default.json());
app.use(secretSession);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.set("view engine", "ejs");
app.use(express_1.default.static(__dirname + "/public"));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// passport.use(new Strategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use("/register", registerRouter); //IMPORTANT: include this after (not before) passport initialisation logic
// app.use("/login", loginRouter);
app.use("/plugins", plugins_1.default);
app.use("/api/plugins", plugins_2.default);
app.use("/api/themes", themes_1.default);
// app.use("/themes", themeRouter);
// app.use("/sites", siteRouter);
(() => {
    try {
        mongoose_1.default.connect(databaseURL);
        db.once("open", () => console.log(`Successfully connected to the database`));
    }
    catch (error) {
        db.on("error", (error) => console.error(error));
    }
    finally {
        console.log("Connection Attempt Complete. Turning On Debug Mode");
        mongoose_1.default.set("debug", true);
    }
})();
app.get("/", (request, response) => {
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
