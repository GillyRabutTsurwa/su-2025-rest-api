"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/", ensureAuthenticated, (request, response) => {
    console.log(request.session.messages);
    response.render("login", {
        error: request.session.messages,
    });
});
router.post("/", passport_1.default.authenticate("local", {
    successRedirect: "/plugins",
    failureRedirect: "/login",
    failureMessage: "Login failed. Verify credentials and retry",
}));
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/plugins");
    }
    return next();
}
exports.default = router;
