const mongoose = require("mongoose");
const siteSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        activeTheme: {
            type: String,
            required: true,
        },
        activePlugins: {
            type: Array,
            required: true,
            default: ["test"],
        },
    },
    {
        collection: "subsites",
    }
);

const Site = mongoose.model("Site", siteSchema);
module.exports = Site;
