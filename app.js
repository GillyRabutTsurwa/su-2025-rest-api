const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

const databaseURL = "mongodb://127.0.0.1:27017/su2025";
const db = mongoose.connection;

app.use(express.json());
mongoose.connect(databaseURL);
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Successfully connected to the database`));

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
