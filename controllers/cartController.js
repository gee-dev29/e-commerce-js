import { cartField } from "../utils/inputFields.js";

const addItemToCart = async (req, res) => {
    try {
        const userId = req.id;
        const product = req.product;
        const { quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(cartField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const cart = new cartModel({
            creatorId: userId,
            product: product._id,
            quantity: quantity,
        });
        await cart.save();
        return res.status(201).json({
            message: "product added to cart",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const { cartId, quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            cartField,
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
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
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
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export { addItemToCart, updateCart };
