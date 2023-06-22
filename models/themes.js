const mongoose = require("mongoose");
const themeSchema = new mongoose.Schema({
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

const Theme = mongoose.model("Theme", themeSchema);
module.exports = Theme;
