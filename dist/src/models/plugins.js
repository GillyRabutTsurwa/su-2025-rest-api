"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pluginSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    codebaseName: {
        type: String,
        required: false,
        default: function () {
            // NOTE: initially made this in themes.js and then copied it here
            return this.name.split(" ").join("-").toLowerCase();
        },
    },
    creator: {
        type: String,
        required: true,
    },
    currentVersion: {
        type: String,
        required: true,
    },
    latestVersion: {
        type: Boolean,
        // required: true,
        required: false,
    },
    isNetworkActive: {
        type: Boolean,
        // required: true,
        required: false,
    },
    sitesActivated: {
        type: Array,
        required: function () {
            return this.isNetworkActive ? false : true;
        },
        default: function () {
            return ["test"];
        },
    },
}, {
    collection: "plugins",
});
const Plugin = mongoose_1.default.model("Plugin", pluginSchema);
exports.default = Plugin;
