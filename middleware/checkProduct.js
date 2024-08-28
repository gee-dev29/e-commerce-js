import { productModel } from "../interface/productModel.js";

export const checkProduct = async (req, res, next) => {
    try {
        let productId;
        if (req.body.productId) {
            productId = req.body.productId;
        } else {
            productId = req.params.productId;
        }

        if (!productId) {
            return res.status(400).json({ message: "Product Id is required" });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        req.productId = productId;
        req.product = product;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
