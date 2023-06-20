const mongoose = require("mongoose");
const pluginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    },
    relatedPlugins: {
        type: Array,
        default: [],
    },
});

const Plugin = mongoose.model("Plugin", pluginSchema);
module.exports = Plugin;
