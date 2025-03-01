const Store = require("../models/store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.registerStore = async (req, res) => {
    try {
        const { name, phone, password, category } = req.body;

        const existingStore = await Store.findOne({ "contact.phone": phone });
        if (existingStore) {
            return res.status(400).json({ success: false, message: "رقم الهاتف مسجل بالفعل" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStore = new Store({ name, password: hashedPassword, category, contact: { phone } });
        await newStore.save();

        res.status(201).json({ success: true, message: "تم تسجيل المحل بنجاح" });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء التسجيل", error: error.message });
    }
};

exports.loginStore = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const store = await Store.findOne({ "contact.phone": phone });
        if (!store) {
            return res.status(400).json({ success: false, message: "المحل غير موجود" });
        }

        const isMatch = await bcrypt.compare(password, store.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "كلمة المرور غير صحيحة" });
        }

        const token = jwt.sign({ storeId: store._id }, "SECRET_KEY", { expiresIn: "7d" });

        res.json({ success: true, message: "تم تسجيل الدخول بنجاح", token, store });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء تسجيل الدخول", error: error.message });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.store.id.toString() !== id) {
            console.log(req.store)
            return res.status(403).json({ success: false, message: "غير مصرح لك بتحديث هذا المحل" });
        }

        if (req.body.contact?.phone) {
            const existingPhone = await Store.findOne({ "contact.phone": req.body.contact.phone, _id: { $ne: id } });
            if (existingPhone) {
                return res.status(400).json({ success: false, message: "رقم الهاتف مستخدم بالفعل" });
            }
        }

        const updatedStore = await Store.findByIdAndUpdate(id, req.body, { new: true });

        res.json({ success: true, message: "تم تحديث بيانات المحل", store: updatedStore });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء التحديث", error: error.message });
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.store.id.toString() !== id) {
            return res.status(403).json({ success: false, message: "غير مصرح لك بحذف هذا المحل" });
        }

        await Store.findByIdAndDelete(id);
        res.json({ success: true, message: "تم حذف المحل بنجاح" });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء الحذف", error: error.message });
    }
};
exports.getAllActiveStores = async (req, res) => {
    try {
        const stores = await Store.find({ isActive: true });

        res.json({ success: true, stores });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء جلب المحلات", error: error.message });
    }
};
exports.getAllStores = async (req, res) =>{
    try {
        const stores = await Store.find();

        res.json({ success: true, stores });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء جلب المحلات", error: error.message });
    }
}
exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;

        const store = await Store.findById(id);

        if (!store) {
            return res.status(404).json({ success: false, message: "المحل غير موجود" });
        }

        res.json({ success: true, store });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء جلب بيانات المحل", error: error.message });
    }
};
exports.activateStore = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedStore = await Store.findByIdAndUpdate(id, { isActive: true }, { new: true });

        if (!updatedStore) {
            return res.status(404).json({ success: false, message: "المحل غير موجود" });
        }

        res.json({ success: true, message: "تم تفعيل المحل بنجاح", store: updatedStore });
    } catch (error) {
        res.status(500).json({ success: false, message: "حدث خطأ أثناء تفعيل المحل", error: error.message });
    }
};