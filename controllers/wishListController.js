import { wishListModel } from "../model/wishListModel.js";
import { entity } from "../utils/entity.js";
import { wishListField } from "../utils/inputFields.js";

export const addItemToWishList = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;
    let wishlist = await wishListModel.findOne({ creatorId: userId });

    if (!wishlist) {
      const newWishList = new wishListModel({
        creatorId: userId,
        productIds: [
          {
            product: productId._id
          }
        ],
      });
      await newWishList.save();
      return res.status(200).json({
        message: "product added to wish list",
      });
    }

    const existingProduct = wishlist.productIds.find(
      (p) => p.product.toString() === productId._id
    );

    if (existingProduct) {
      return res.status(400).json({
        message: "wishlist aleady exists",
      });
    }

    wishlist.productIds.push({
      product: productId._id,
    });

    await wishlist.save();
    return res.status(201).json({ message: "wishlist added" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishListId = req.wishListId;
    const checkFields = entity.checkMissingFieldsInput(wishListField, req.body);
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
    return res.status(500).json({ message: error.message });
  }
};
