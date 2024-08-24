import { checkUser } from "../middleware/checkUser";
import { jwtVerify } from "../middleware/jwtAuthentication";
import { router } from "../utils/routerExport";

const applyMiddleware = [jwtVerify, checkUser];
router.route("/")
    .get(applyMiddleware)
    .post(applyMiddleware)

router.route(":id")
    .delete(applyMiddleware);
