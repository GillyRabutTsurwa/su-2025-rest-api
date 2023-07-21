import express, { Express, Request, Response, Router, NextFunction } from "express";
import passport from "passport";
import User from "../models/users";

const router: Router = express.Router();

router.get("/", (request: Request, response: Response) => {
    response.render("register");
});

router.post("/", async (request: Request, response: Response) => {
    const newUser = new User({
        username: request.body.username,
    });

    //NOTE: for now
    //@ts-ignore
    User.register(newUser, request.body.password, (err, user) => {
        if (err) {
            console.error(err);
            return response.redirect("/register");
        }
        passport.authenticate("local")(request, response, () => {
            response.redirect("/plugins");
        });
    });
});

export default router;
