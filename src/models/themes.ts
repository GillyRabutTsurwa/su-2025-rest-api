import mongoose, { Schema } from "mongoose";

interface ITheme {
    name: string;
    codebaseName: string;
    sitesUsingTheme: any; //NOTE: for now
}

const themeSchema: Schema = new mongoose.Schema<ITheme>({
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

const Theme = mongoose.model<ITheme>("Theme", themeSchema);
export default Theme;
