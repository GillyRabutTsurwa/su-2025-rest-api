const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: false, //NOTE: passport-local-mongoose takes care of this. do not define it when making a new user
        },
    },
    {
        collection: "admins",
    }
);

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);

module.exports = User;
