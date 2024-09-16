import { productModel } from "../model/productModel.js";

export const checkProduct = async (req, res, next) => {
    let productId;
    if (req.params.productId) {
        productId = req.params.productId;
    } else if (req.body.productId) {
        productId = req.body.productId;
    }
    if (!productId) {
        return res.status(400).json({ message: "Product Id is required" });
    }
    const product = await productModel.findById({ _id: productId });
    console.log(product)
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }
    req.productId = productId;
    req.product = product;
    next();
};
