"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const themeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    codebaseName: {
        type: String,
        required: false,
        default: function () {
            // NOTE: taking the name value above and formatting it. Gilbert Rabut Tsurwa becomes "gilbert-rabut-tsurwa"
            return this.name.split(" ").join("-").toLowerCase();
        },
    },
    sitesUsingTheme: {
        type: Array,
        default: [],
    },
});
const Theme = mongoose_1.default.model("Theme", themeSchema);
exports.default = Theme;
