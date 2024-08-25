import { wishListModel } from "../interface/wishListModel.js";
import { wishListField } from "../utils/inputFields.js";

const addItemToWishList = async (req, res) => {
    try {
        const userId = req.id;
        const product = req.product;
        const { quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            wishListField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const wishList = new wishListModel({
            creatorId: userId,
            product: product._id,
            quantity: quantity,
        });
        await wishList.save();
        return res.status(201).json({
            message: "item added to wish list",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateWishList = async (req, res) => {
    try {
        const { wishListId, quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            ["cartId", "quantity"],
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        const payload = {
            quantity: quantity,
        };
        await entity.updateDataById(cartId, payload, cartModel);
        return res.status(200).json({
            message: "Cart updated successfully",
        });
    } catch (error) {}
};

const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            ["cartId"],
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        await entity.deleteDataById(cartId, cartModel);
        return res.status(200).json({
            message: "Cart deleted successfully",
        });
    } catch (error) {}
};

export { updateWishList, addItemToWishList };
