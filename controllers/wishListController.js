import { wishListModel } from "../model/wishListModel.js";
import { entity } from "../utils/entity.js";
import { wishListField } from "../utils/inputFields.js";

export const addItemToWishList = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            wishListField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const wishList = await wishListModel.findById(userId);
        if (!wishList) {
            const newWishList = new wishListModel({
                creatorId: userId,
                productIds: [productId],
            });
            await newWishList.save();
            return res.status(200).json({
                message: "product added to wish list",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateWishList = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(productId);
        const wishListId = req.wishListId;
        const checkFields = entity.checkMissingFieldsInput(
            wishListField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const wishList = await wishListModel.findById(wishListId);
        if (wishList && wishList.productIds.includes(productId)) {
            return res.status(404).json({
                message: "product already added to wish list",
            });
        }
        wishList.productIds.push(productId);
        await wishList.save();
        return res.status(200).json({
            message: "wish List updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteWishList = async (req, res) => {
    try {
        const wishListId = req.wishListId;
        await entity.deleteDataById(wishListId, wishListModel);
        return res.status(200).json({
            message: "wish list deleted successfully",
        });
    } catch (error) {}
};

export const viewWishList = async (req, res) => {
    try {
        let count = 0;
        const wishListId = req.wishListId;
        const wishList = await wishListModel
            .findOne({ _id: wishListId })
            .populate("productIds");
        return res.status(200).json({
            // totalRecords: count(wishList),
            data: wishList,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
