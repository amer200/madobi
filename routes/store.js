const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store");
const storeMiddleware = require("../middlewares/store");

router.post("/signup", storeController.registerStore);
router.post("/login", storeController.loginStore);
router.put("/edit/:id", storeMiddleware.isAuth, storeController.updateStore);
router.delete("/delete/:id", storeMiddleware.isAuth, storeController.deleteStore);
router.get("/get-all/", storeController.getAllStores);
router.get("/get-all-active/", storeController.getAllActiveStores);
router.get("/get-by-id/:id", storeController.getStoreById);
router.patch("/active/:id", storeController.activateStore);

module.exports = router;