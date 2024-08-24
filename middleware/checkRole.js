const Role = require("../enums/role");

module.exports.admin = async (req, res, next) => {
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

module.exports.superAdmin = async (req, res, next) => {
  try {
    const user = req.data;
    if (user.role !== Role.SUPER_ADMIN) {
    //   return errorHandler('', res);
    }
    next();
  } catch (error) {
    next(err);
  }
};
