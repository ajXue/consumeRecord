const KoaRouter = require("koa-router");
const router = new KoaRouter();

const User = require("../controller/UserController");
const Consume = require("../controller/consumeController");
const checkToken = require("../token/checkToken");

router.get("/login", User.Login);
router.get("/addUser", User.AddUser);
router.get("/delUser", User.DelUser);

router.get("/addConsume", checkToken, Consume.AddConsume);
router.get("/getMonConsume", checkToken, Consume.GetMonData);
router.get("/deleteConsume", checkToken, Consume.DeleteConsume);

module.exports = router;
