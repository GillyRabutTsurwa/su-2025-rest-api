const mongoose = require("mongoose");
const pluginSchema = new mongoose.Schema(
    {
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
            required: true,
        },
        isNetworkActive: {
            type: Boolean,
            required: true,
        },
        sitesActivated: {
            type: Array,
            required: function () {
                return this.isNetworkActive ? false : true;
            },
        },
    },
    {
        collection: "plugins",
    }
);

const Plugin = mongoose.model("Plugin", pluginSchema);
module.exports = Plugin;
