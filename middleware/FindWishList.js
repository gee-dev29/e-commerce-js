import { wishListModel } from "../interface/wishListModel";

export const findWishList = async (req, res, next) => {
    try {
        const wishListId = req.params.wishListId;
        const productId = req.body.productId;
        if (!wishListId) {
            return res.status(400).json({
                message: "WishList Id is required",
            });
        }
        const wishList = await wishListModel.findOne({ productId: productId });
        if (wishList) {
            return res.status(400).json({
                message: "Item already in wish List",
            });
        }
        req.wishList = wishList;
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
