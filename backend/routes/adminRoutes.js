const express = require("express");
const router = express.Router();

const {
  addAdmins,
  getAllAdmins,
  deleteAdmin,
  getAllUsersAdmin,
  adminLogout,
  changeAdminPassword,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.post("/add-admin", addAdmins);
router.get("/get-all-admins", getAllAdmins);
router.delete("/delete", deleteAdmin);
router.patch(
  "/change-password",
  authMiddleware,
  adminMiddleware,
  changeAdminPassword,
);
router.put("/logout", authMiddleware, adminMiddleware, adminLogout);
// for getting users of an admin
router.get("/admin-users", authMiddleware, adminMiddleware, getAllUsersAdmin);
module.exports = router;
