import express, { Express, Request, Response, Router } from "express";
import { Octokit } from "octokit";
import { OctokitResponse } from "@octokit/types";
import Theme from "../models/themes";

const router: Router = express.Router();

//NEW
const octokit: Octokit = new Octokit({
    auth: process.env.GITHUB_OCTOKIT_KEY,
});

async function fetchContent(path: string): Promise<any[]> {
    const result: any = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "ShenandoahU",
        repo: "www.su.edu",
        path: path,
    });

    const files = [];

    for (const currentAsset of result.data) {
        if (currentAsset.type === "dir") {
            const subDirectoryFiles = await fetchContent(currentAsset.path);
            // files.push(...subDirectoryFiles);
            files.push({ type: "dir", name: currentAsset.name, html_url: currentAsset.html_url, files: subDirectoryFiles });
        } else {
            // files.push(currentAsset);
            files.push({ type: "file", name: currentAsset.name, html_url: currentAsset.html_url });
        }
        // console.log(currentAsset);
    }

    return files;
} // ================================================================

router.get("/", async (request, response) => {
    const themes = await Theme.find();
    response.render("themes", {
        themes: themes,
        user: request.isAuthenticated() ? request.user : null,
    });
});

router.get("/:name", async (request, response) => {
    //TESTING
    try {
        const theme = await Theme.findOne({ codebaseName: request.params.name });
        if (!theme) throw new Error("Theme could not be found");
        const initialPath = `wp-content/themes/${request.params.name}`;
        const files = await fetchContent(initialPath);

        console.log(theme, files);

        response.render("theme", {
            theme: theme,
            files: files,
        });
    } catch (error: any) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.post("/", async (request, response) => {
    const theme = new Theme({
        name: request.body.name,
        codebaseName: request.body.codebaseName,
        description: request.body.description,
        sitesUsingTheme: request.body.sitesUsingTheme,
    });

    try {
        await Theme.create(theme);
        response.redirect(`/themes/${theme.codebaseName}`);
    } catch (error) {
        console.error(error);
    }
});

export default router;
