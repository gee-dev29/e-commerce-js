import { cartModel } from "../interface/cartModel.js";
import { productModel } from "../interface/productModel.js";
import { entity } from "../utils/entity.js";
import { cartField } from "../utils/inputFields.js";

const addProductToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { quantity, productId } = req.body;
        const checkFields = entity.checkMissingFieldsInput(cartField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        // check if the product is already in the cart
        const cart = await cartModel.findById(userId, {
            productIds: { $in: [productId] },
        });
        // if the product id already exist in the cart, just increase the quantity
        if (cart && cart.productIds.includes(productId)) {
            //increase the quantity
            cart.quantity += quantity;
            await cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
            });
        }
        const product = await productModel.findById(productId);
        const totalAmount = quantity * product.productPrice;
        const newCart = new cartModel({
            userId: userId,
            productIds: [productId],
            quantity: quantity,
            totalAmount: totalAmount,
        });

        await newCart.save();
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
