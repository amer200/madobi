const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: ".env" });
const { dbConnection } = require("./db/mongoose");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const app = express();

///////////////////////////////////////////
app.set("view engine", "ejs");
app.use(morgan("combined"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//////////////////////////////////////////
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({ storage: storage });
app.post("/api/stores/menu/add-item", upload.single("img"));
app.put("/api/stores/menu/edit-item", upload.single("img"));
app.post("/api/delivery-agent/register", upload.fields([
    { name: "agentPhoto", maxCount: 1 },
    { name: "vehiclePhoto", maxCount: 1 },
    { name: "vehicleLicense", maxCount: 1 },
    { name: "driverLicense", maxCount: 1 },
]))
app.put("/api/delivery-agent", upload.fields([
    { name: "agentPhoto", maxCount: 1 },
    { name: "vehiclePhoto", maxCount: 1 },
    { name: "vehicleLicense", maxCount: 1 },
    { name: "driverLicense", maxCount: 1 },
]))
//////////////////////////////////////////
//routes
const clientRoutes = require("./routes/client");
const storeRoutes = require("./routes/store");
const deliveryAgentRoutes = require("./routes/deliveryAgent");
app.use("/api/clients", clientRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/delivery-agent", deliveryAgentRoutes);
//db onnection
dbConnection();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});