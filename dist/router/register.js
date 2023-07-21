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
const passport_1 = __importDefault(require("passport"));
const users_1 = __importDefault(require("../models/users"));
const router = express_1.default.Router();
router.get("/", (request, response) => {
    response.render("register");
});
router.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new users_1.default({
        username: request.body.username,
    });
    users_1.default.register(newUser, request.body.password, (err, user) => {
        if (err) {
            console.error(err);
            return response.redirect("/register");
        }
        passport_1.default.authenticate("local")(request, response, () => {
            response.redirect("/plugins");
        });
    });
}));
exports.default = router;
