import { wishListModel } from "../model/wishListModel.js";

export const checkWishList = async (req, res, next) => {
    try {
        let wishListId;
        if (!req.body.wishListId) {
            wishListId = req.params.wishListId;
        } else {
            wishListId = req.body.wishListId;
        }

        const wishList = await wishListModel.findById(wishListId);
        if (!wishList) {
            return res.status(404).json({
                message: "Wish list not found",
            });
        }
        req.wishList = wishList;
        req.wishListId = wishListId;
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
