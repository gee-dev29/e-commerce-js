import { wishListModel } from "../model/wishListModel.js";

export const findWishList = async (req, res, next) => {
  try {
    const userId = req.id;
    const productId = req.body.productId;
    const wishList = await wishListModel.findOne({ creatorId: userId });
    if (wishList?.productIds.includes(productId)) {
      return res.status(409).json({
        message: "Product already added to wish list",
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
