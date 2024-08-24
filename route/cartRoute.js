import { checkUser } from "../middleware/checkUser";
import { jwtVerify } from "../middleware/jwtAuthentication";
import { router } from "../utils/routerExport";

router.route("/")
    .get(jwtVerify, checkUser)
    .post(jwtVerify, checkUser)

router.route(":id")
    .delete(jwtVerify, checkUser);
