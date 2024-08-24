const userModel = require("../interface/userModel");

module.exports.checkUser = async (req, res, next) => {
  const user = await userModel.findById(decoded.userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  req.user = user;
  next();
};
