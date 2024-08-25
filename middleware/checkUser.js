import { userModel } from "../interface/userModel.js";

export const checkUser = async (req, res, next) => {
    let userId;
    if (req.params.id) {
        userId = req.params.id;
    } else {
        userId = req.id;
    }
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
};
