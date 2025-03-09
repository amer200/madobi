const express = require("express");
const { registerAgent, loginAgent, getProfile, updateProfile, deleteProfile, getAllAgents, activateAgent, deactivateAgent } = require("../controllers/deliveryAgent");
const deliveryAgentMiddleware = require("../middlewares/deliveryAgent");

const router = express.Router();

router.post("/register", registerAgent);
router.post("/login", loginAgent);
router.get("/get-profile",deliveryAgentMiddleware.isAuth, getProfile);
router.put("/profile", deliveryAgentMiddleware.isAuth, updateProfile);
router.delete("/profile", deliveryAgentMiddleware.isAuth, deleteProfile);
// router.get("/all", deliveryAgentMiddleware.isAuth, getAllAgents);
router.put("/activate/:agentId", deliveryAgentMiddleware.isAuth, activateAgent);
router.put("/deactivate/:agentId", deliveryAgentMiddleware.isAuth, deactivateAgent);


module.exports = router;