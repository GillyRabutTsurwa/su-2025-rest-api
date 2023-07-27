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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
dotenv.config();
const users_1 = __importDefault(require("./models/users"));
const register_1 = __importDefault(require("./router/register"));
const login_1 = __importDefault(require("./router/login"));
const plugins_1 = __importDefault(require("./router/plugins"));
const plugins_2 = __importDefault(require("./router/api/plugins"));
const themes_1 = __importDefault(require("./router/themes"));
const themes_2 = __importDefault(require("./router/api/themes"));
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
    store: connect_mongo_1.default.create({
        mongoUrl: DATABASE_URL,
    }),
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mongoose_1.default.connect(databaseURL);
        console.log(`Connected to Database ${connection.connection.db.databaseName} @ Host ${connection.connection.host}`);
    }
    catch (error) {
        console.error(`Erreur: ${error}`);
    }
    finally {
        mongoose_1.default.set("debug", true);
    }
}))();
app.use(express_1.default.json());
app.use(secretSession);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express_1.default.static(__dirname + "/public"));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.Strategy(users_1.default.authenticate()));
passport_1.default.serializeUser(users_1.default.serializeUser());
passport_1.default.deserializeUser(users_1.default.deserializeUser());
app.use("/register", register_1.default);
app.use("/login", login_1.default);
app.use("/plugins", plugins_1.default);
app.use("/api/plugins", plugins_2.default);
app.use("/themes", themes_1.default);
app.use("/api/themes", themes_2.default);
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
    if (req.isAuthenticated()) {
        console.log(req.user);
        return next();
    }
    res.redirect("/login");
}
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
