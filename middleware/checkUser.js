import { UserStatus } from "../enums/statusEnum.js";
import { userModel } from "../model/userModel.js";

export const checkUser = async (req, res, next) => {
  try {
    const userId = req.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      user.UserStatus == UserStatus.SUSPENDED ||
      user.UserStatus == UserStatus.DELETED
    ) {
      return res.status(401).json({
        message: "User has been suspended. Contact Admin",
      });
    }
    req.user = user;
    req.role = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};
 