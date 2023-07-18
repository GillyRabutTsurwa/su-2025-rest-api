const express = require("express");
//NEW
const { Octokit, App } = require("octokit");

const router = express.Router();

const Theme = require("../models/themes");

//NEW
const octokit = new Octokit({
    auth: "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",
});

// async function fetchContent() {
//     const content = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
//         owner: "ShenandoahU",
//         repo: "ssmt",
//         path: "wp-content/themes/su-ssmt",
//     });

//     content.data.forEach(async (currentAsset) => {
//         if (currentAsset.type === "dir") {
//             const x = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
//                 owner: "ShenandoahU",
//                 repo: "ssmt",
//                 path: `${currentAsset.path}`,
//             });

//             // const xd = x.data;
//             // console.log({ ...currentAsset, xd });
//         }
//     });

//     return x4;
// }

async function fetchContent(path) {
    const result = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "ShenandoahU",
        // repo: "ssmt",
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
        const initialPath = "wp-content/themes/su-performs";
        const files = await fetchContent(initialPath);
        // console.log(files);
        response.render("theme", {
            theme: theme,
            files: await fetchContent(initialPath),
        });
    } catch (error) {
        response.json({ message: error.message });
    } finally {
        console.log("Data retrieval completed");
    }
});

router.post("/", async (request, response) => {
    const theme = new Theme({
        name: request.body.name,
        codebaseName: request.body.codebaseName,
        sitesUsingTheme: request.body.sitesUsingTheme,
    });

    const newTheme = await Theme.create(theme);
    console.log(theme);
    response.json(newTheme);
});

module.exports = router;
