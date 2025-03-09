const DeliveryAgent = require("../models/deliveryAgent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerAgent = async (req, res) => {
    try {
        const { name, phone, email, password, vehicleType, vehicleNumber } = req.body;
        const { agentPhoto, vehiclePhoto, vehicleLicense, driverLicense } = req.files; // استقبال الصور
        const existingAgent = await DeliveryAgent.findOne({ phone });
        if (existingAgent) return res.status(400).json({ message: "رقم الهاتف مستخدم بالفعل" });

        if (!agentPhoto) {
            return res.status(400).json({ message: "يجب رفع صورة المندوب" });
        }

        if (vehicleType !== "bicycle") {
            if (!vehiclePhoto || !vehicleLicense || !driverLicense) {
                return res.status(400).json({ message: "يجب رفع صور المركبة والرخصة" });
            }
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء الحساب
        const agent = new DeliveryAgent({
            name,
            phone,
            email,
            password: hashedPassword,
            vehicleType,
            vehicleNumber: vehicleType === "bicycle" ? null : vehicleNumber,
            agentPhoto: agentPhoto[0].path,
            vehiclePhoto: vehicleType !== "bicycle" ? vehiclePhoto[0].path : null,
            vehicleLicense: vehicleType !== "bicycle" ? vehicleLicense[0].path : null,
            driverLicense: vehicleType !== "bicycle" ? driverLicense[0].path : null
        });

        await agent.save();
        res.status(201).json({ message: "تم التسجيل بنجاح، انتظر تفعيل الحساب من الأدمن" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "خطأ في السيرفر", error: error });
    }
};
exports.loginAgent = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const agent = await DeliveryAgent.findOne({ phone });

        if (!agent) return res.status(404).json({ message: "المستخدم غير موجود" });

        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) return res.status(401).json({ message: "كلمة المرور غير صحيحة" });

        if (!agent.isActive) return res.status(403).json({ message: "الحساب غير مفعل، يرجى انتظار موافقة الأدمن" });

        const token = jwt.sign({ id: agent._id, role: "agent" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "تم تسجيل الدخول بنجاح", token });

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const agent = await DeliveryAgent.findById(req.user.id).select("-password");
        if (!agent) return res.status(404).json({ message: "المندوب غير موجود" });

        res.status(200).json(agent);

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.isActive;

        const updatedAgent = await DeliveryAgent.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");

        res.status(200).json({ message: "تم تحديث البيانات بنجاح", updatedAgent });

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await DeliveryAgent.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: "تم حذف الحساب بنجاح" });

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};

exports.getAllAgents = async (req, res) => {
    try {
        const agents = await DeliveryAgent.find().select("-password");
        res.status(200).json(agents);

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};

exports.activateAgent = async (req, res) => {
    try {
        const { agentId } = req.params;
        const agent = await DeliveryAgent.findByIdAndUpdate(agentId, { isActive: true }, { new: true }).select("-password");

        if (!agent) return res.status(404).json({ message: "المندوب غير موجود" });

        res.status(200).json({ message: "تم تفعيل الحساب بنجاح", agent });

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};

// تعطيل حساب المندوب (للأدمن فقط)
exports.deactivateAgent = async (req, res) => {
    try {
        const { agentId } = req.params;
        const agent = await DeliveryAgent.findByIdAndUpdate(agentId, { isActive: false }, { new: true }).select("-password");

        if (!agent) return res.status(404).json({ message: "المندوب غير موجود" });

        res.status(200).json({ message: "تم تعطيل الحساب بنجاح", agent });

    } catch (error) {
        res.status(500).json({ message: "خطأ في السيرفر", error });
    }
};