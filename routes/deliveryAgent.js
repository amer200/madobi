const express = require("express");
const { registerAgent, loginAgent, getProfile, updateProfile, deleteProfile, getAllAgents, activateAgent, deactivateAgent } = require("../controllers/deliveryAgent");
const deiveryAgentMiddleware = require("../middlewares/deiveryAgent");

const router = express.Router();

router.post("/register", registerAgent);
router.post("/login", loginAgent);
router.get("/get-profile", getProfile);
router.put("/profile", deiveryAgentMiddleware.isAuth, updateProfile);
router.delete("/profile", deiveryAgentMiddleware.isAuth, deleteProfile);
router.get("/all", deiveryAgentMiddleware.isAuth, getAllAgents);
router.put("/activate/:agentId", deiveryAgentMiddleware.isAuth, activateAgent);
router.put("/deactivate/:agentId", deiveryAgentMiddleware.isAuth, deactivateAgent);


module.exports = router;