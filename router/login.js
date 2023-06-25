const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", ensureAuthenticated, (request, response) => {
    console.log(request.session.messages); // NEW: is an array
    response.render("login", {
        error: request.session.messages,
    });
});

router.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/plugins",
        failureRedirect: "/login",
        failureMessage: "Login failed. Verify credentials and retry", // NOTE: this message is available in our login route above app.get("/login")
    })
);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/plugins");
    }
    return next();
}

module.exports = router;
