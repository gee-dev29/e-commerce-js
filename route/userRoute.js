const { registerUser, viewAllUsers } = require("../controllers/userController");
const { router } = require("../utils/routerExport");

router.route("/").get(viewAllUsers).post(checkUser, registerUser);
router
    .route("/:id")
    .get(checkUser, viewSingleUser)
    .delete(checkUser, deleteUser);
