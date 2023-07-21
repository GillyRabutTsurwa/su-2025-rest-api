import express, { Request, Response, Router } from "express";
import Theme from "../../models/themes";
const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
    const plugins = await Theme.find();
    response.json(plugins);
});

export default router;
