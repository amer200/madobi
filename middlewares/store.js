const jwt = require("jsonwebtoken");
const Store = require("../models/store");

exports.isAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "غير مصرح لك، لم يتم إرسال التوكن" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, "SECRET_KEY");

        const store = await Store.findById(decoded.storeId);
        if (!store) {
            return res.status(401).json({ success: false, message: "مصادقة غير صحيحة" });
        }

        req.store = { id: store._id };
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: "توكن غير صالح أو انتهت صلاحيته" });
    }
};
