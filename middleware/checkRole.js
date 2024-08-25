import { Role } from "../enums/role.js";
const adminRoleCheck = async (req, res, next) => {
    try {
        const user = req.data;
        if (user.role !== Role.ADMIN) {
            //   return ('', res);
        }
        next();
    } catch (error) {
        next(err);
    }
};

const superAdminRoleCheck = async (req, res, next) => {
    try {
        const user = req.data;
        if (user.role !== Role.SUPER_ADMIN) {
        }
        next();
    } catch (error) {
        next(err);
    }
};

export { adminRoleCheck, superAdminRoleCheck };
