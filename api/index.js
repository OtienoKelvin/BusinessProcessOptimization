const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db");
const authRoutes = require("./routes/users");
const businessRoutes = require("./routes/business");
const inventoryRoutes = require("./routes/inventory");


const app = express();

//middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//db connection
db.connect((err) => {
    if(err) {
        console.log("Error connecting to database" + err)
    } else {
        console.log("Connected to database")
    }
})


//routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/inventory", inventoryRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})