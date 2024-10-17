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
            product: productId._id,
          },
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
    const { productId } = req.body;
    const filter = { creatorId: req.id };

    // Find the cart first
    const wishlist = await wishListModel.find(filter);

    if (!wishlist) {
      return res.status(404).json({
        message: "wishlist not found",
      });
    }

    // Filter out the product that matches productId, size, and color
    const updatedProducts = wishlist[0].productIds.filter(
      (product) => !(product.product.toString() === productId)
    );

    // Update the cart with the filtered products
    await entity.updateDataById(
      wishlist[0]._id,
      { productIds: updatedProducts },
      wishListModel
    );
    return res.status(200).json({
      message: "Wishlist deleted from the cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.id;
    const wishlist = await wishListModel.find({ creatorId: userId }).populate({
      path: "productIds.product",
      model: "product",
    });
    if (wishlist && wishlist.length > 0) {
      const { productIds, ...others } = wishlist[0];
      return res.status(200).json({
        data: productIds,
      });
    }

    return res.status(200).json({ data: [] });
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    return res.status(500).json({ message: error.message });
  }
};
