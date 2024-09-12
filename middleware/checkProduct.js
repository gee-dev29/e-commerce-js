import { productModel } from "../model/productModel.js";

export const checkProduct = async (req, res, next) => {
    // Check if product ID exists in params or body
    let productId;
    if (req.params && req.params.productId) {
        productId = req.params.productId;
    } else if (req.body && req.body.productId) {
        productId = req.body.productId;
    }

    // Handle missing product ID
    if (!productId) {
        return res.status(400).json({ message: "Product Id is required" });
    }

    // Find the product using productModel
    const product = await productModel.findById({ _id: productId });

    // Handle product not found
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }

    // Assign product to request object
    req.productId = productId;
    req.product = product;
    next();
};
