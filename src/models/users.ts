// import mongoose, { Schema } from "mongoose";
// import passportLocalMongoose from "passport-local-mongoose";

// interface IUser {
//     username: string;
//     password: string;
// }

// const UserSchema: Schema = new mongoose.Schema<IUser>(
//     {
//         username: {
//             type: String,
//             required: true,
//         },
//         password: {
//             type: String,
//             required: false, //NOTE: passport-local-mongoose takes care of this. do not define it when making a new user
//         },
//     },
//     {
//         collection: "admins",
//     }
// );

// UserSchema.plugin(passportLocalMongoose);
// const User = mongoose.model<IUser>("User", UserSchema);

// module.exports = User;
