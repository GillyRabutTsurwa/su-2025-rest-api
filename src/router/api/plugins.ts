import express, { Request, Response, Router } from "express";
import Plugin from "../../models/plugins";
const router: Router = express.Router();

router.get("/", async (request: Request, response: Response) => {
    const plugins = await Plugin.find();
    response.json(plugins);
});

export default router;
