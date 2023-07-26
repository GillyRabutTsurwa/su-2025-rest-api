import mongoose, { Schema } from "mongoose";

interface IPlugin {
    name: string;
    codebaseName: string;
    creator: string;
    description: string;
    currentVersion: string;
    latestVersion: boolean;
    isNetworkActive: boolean;
    sitesActivated: any; //For Now
}
const pluginSchema: Schema = new mongoose.Schema<IPlugin>(
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
        description: {
            type: String,
            required: false,
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
            required: function (): boolean {
                return this.isNetworkActive ? false : true;
            },
            default: function () {
                return ["test"];
            },
        },
    },
    {
        collection: "plugins",
    }
);

const Plugin = mongoose.model<IPlugin>("Plugin", pluginSchema);
export default Plugin;
