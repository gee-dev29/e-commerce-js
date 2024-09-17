import { userModel } from "../model/userModel.js";
import { entity } from "../utils/entity.js";
import { loginField } from "../utils/inputFields.js";

export const findUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const checkFields = entity.checkMissingFieldsInput(["email"], req.body);
        console.log(checkFields);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        const {password, otp, ...others} = user._doc
        req.user = others;
        req.password = password
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
