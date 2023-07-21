"use strict";
// const express = require("express");
// const passport = require("passport");
// const router = express.Router();
// const User = require("../models/users");
// router.get("/", (request, response) => {
//     response.render("register");
// });
// router.post("/", async (request, response) => {
//     const newUser = new User({
//         username: request.body.username,
//     });
//     User.register(newUser, request.body.password, (err, user) => {
//         if (err) {
//             console.error(err);
//             return response.redirect("/register");
//         }
//         passport.authenticate("local")(request, response, () => {
//             response.redirect("/plugins");
//         });
//     });
// });
// module.exports = router;
