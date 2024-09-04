const express = require("express");
const app = express();
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const connectedDB = require("./configure/db");
require("dotenv").config();
connectedDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", userRoutes);


const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
});
