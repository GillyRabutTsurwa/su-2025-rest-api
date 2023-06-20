const mongoose = require("mongoose");
const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sitesUsingTheme: {
        type: Array,
        default: [],
    },
});

const Theme = mongoose.model("Theme", themeSchema);
module.exports = Theme;
