import { cartField } from "../utils/inputFields.js";

const addProductToCart = async (req, res) => {
    try {
        const userId = req.id;
        const user = req.user;
        const productId = req.params.productId;
        const { quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(cartField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        // Check if the product already exists in the cart
        const existingProduct = user.cart.productIds.findIndex(
            (id) => id.toString() === productId.toString()
        );

        if (existingProduct < 1) {
            // If the product already exists in the cart, update the quantity
            user.cart[existingProduct].quantity += quantity;
        } else {
            // If the product does not exist in the cart, add it with the specified quantity
            user.cart.productIds.push(productId);
            user.cart.quantity = quantity;
        }

        // Save the updated user document
        await user.save();

        return res.status(200).json({
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
        const checkFields = entity.checkMissingFieldsInput(cartField, req.body);
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

export { addProductToCart, deleteCart, updateCart };
