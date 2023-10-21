const {
  login,
  register,
  getAllUsers,
  logOut,
  selectService,
  getServeiceUser,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);
router.post("/selectservice",selectService);
router.get("/service/:key", getServeiceUser);

module.exports = router;
