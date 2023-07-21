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
const octokit_1 = require("octokit");
const themes_1 = __importDefault(require("../models/themes"));
const router = express_1.default.Router();
const octokit = new octokit_1.Octokit({
    auth: process.env.GITHUB_OCTOKIT_KEY,
});
function fetchContent(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
            owner: "ShenandoahU",
            repo: "www.su.edu",
            path: path,
        });
        const files = [];
        for (const currentAsset of result.data) {
            if (currentAsset.type === "dir") {
                const subDirectoryFiles = yield fetchContent(currentAsset.path);
                files.push({ type: "dir", name: currentAsset.name, html_url: currentAsset.html_url, files: subDirectoryFiles });
            }
            else {
                files.push({ type: "file", name: currentAsset.name, html_url: currentAsset.html_url });
            }
        }
        return files;
    });
}
router.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const themes = yield themes_1.default.find();
    response.render("themes", {
        themes: themes,
        user: request.isAuthenticated() ? request.user : null,
    });
}));
router.get("/:name", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theme = yield themes_1.default.findOne({ codebaseName: request.params.name });
        if (!theme)
            throw new Error("Theme could not be found");
        const initialPath = `wp-content/themes/${request.params.name}`;
        const files = yield fetchContent(initialPath);
        console.log(theme, files);
        response.render("theme", {
            theme: theme,
            files: files,
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
    const theme = new themes_1.default({
        name: request.body.name,
        codebaseName: request.body.codebaseName,
        sitesUsingTheme: request.body.sitesUsingTheme,
    });
    const newTheme = yield themes_1.default.create(theme);
    console.log("New Theme Added");
    console.log(theme);
    response.json(newTheme);
}));
exports.default = router;
