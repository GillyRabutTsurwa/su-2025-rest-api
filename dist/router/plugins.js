"use strict";
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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const plugins_1 = __importDefault(require("../models/plugins"));
const router = express_1.default.Router();
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(body_parser_1.default.json());
router.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(request.user);
    const plugins = yield plugins_1.default.find({});
    response.render("plugins", {
        plugins: plugins,
        user: request.isAuthenticated() ? request.user : null,
    });
}));
router.get("/:name", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plugin = yield plugins_1.default.findOne({ codebaseName: request.params.name }).exec();
        if (!plugin)
            throw new Error("Plugin could not be found");
        response.render("plugin", {
            plugin: plugin,
        });
    }
    catch (error) {
        response.json({ message: error.message });
    }
    finally {
        console.log("Data retrieval completed");
    }
}));
router.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const plugin = new plugins_1.default({
        name: request.body.name,
        creator: request.body.creator,
        currentVersion: request.body.currentVersion,
        latestVersion: request.body.pluginVersion,
        isNetworkActive: request.body.pluginNetwork,
        sitesActivated: request.body.sitesActivated,
    });
    console.log(plugin);
    try {
        yield plugins_1.default.create(plugin);
        response.redirect(`/plugins/${plugin.codebaseName}`);
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
