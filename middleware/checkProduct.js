import { productModel } from "../model/productModel.js";
import { entity } from "../utils/entity.js";

export const checkProduct = async (req, res, next) => {
  let productId = req.params.productId || req.body.productId
  // if (req.params?.productId) {
  //   productId = req.params?.productId;
  // } else if (req.body?.productId) {
  //   productId = req.body?.productId;
  // }


  if (!entity.isValidUUID(productId)) {
    return res.status(400).json({ message: "Product Id is required" });
  }
  const product = await entity.getAllFilteredData(productModel, {
    _id: productId,
  });
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  req.productId = productId;
  req.product = product[0];
  next();
};
