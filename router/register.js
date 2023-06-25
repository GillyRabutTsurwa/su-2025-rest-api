const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const router = express.Router();

const User = require("../models/users");

router.use(bodyParser.urlencoded({ extended: true }));
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/", (request, response) => {
    response.render("register");
});

router.post("/", async (request, response) => {
    const newUser = new User({
        username: request.body.username,
    });

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

module.exports = router;
