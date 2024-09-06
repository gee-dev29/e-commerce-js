import { shippingModel } from "../interface/shippingModel.js";

export const checkShippingInfo = async (req, res, next) => {
    try {
        let shippingId;
        if (!req.body.shippingId) {
            shippingId = req.params.shippingId;
        } else {
            shippingId = req.body.shippingId;
        }

        const shippingInfo = await shippingModel.findById(shippingId);
        if (!shippingInfo) {
            return res.status(404).json({
                message: "shipping Info not found",
            });
        }
        req.shippingInfo = shippingInfo;
        req.shippingId = shippingId;
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
