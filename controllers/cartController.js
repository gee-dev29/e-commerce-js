import { cartModel } from "../model/cartModel.js";
import { productModel } from "../model/productModel.js";
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
        const cart = await cartModel.findOne({ creatorId: userId });
        const product = await productModel.findById(productId);
        if (!cart) {
            const totalAmount = quantity * product.productPrice;
            const newCart = new cartModel({
                creatorId: userId,
                productIds: [productId],
                quantity: quantity,
                totalAmount: totalAmount,
            });
            await newCart.save();
            return res.status(201).json({
                message: "Cart created and product added",
            });
        }
        if (cart.productIds.includes(productId)) {
            cart.quantity += quantity;
            cart.totalAmount = cart.quantity * product.productPrice;
            await cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
            });
        }
        cart.productIds.push(productId);
        cart.quantity += quantity;
        cart.totalAmount = cart.quantity * product.productPrice;
        await cart.save();
        return res.status(200).json({
            message: "Cart updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const product = req.product;
        const cart = req.cart;
        const { productId, quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(cartField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        if (cart.productIds.includes(productId)) {
            cart.quantity += quantity;
            cart.totalAmount = cart.quantity * product.productPrice;
            await cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
            });
        }
        cart.productIds.push(productId);
        cart.quantity += quantity;
        cart.totalAmount = cart.quantity * product.productPrice;
        await cart.save();
        return res.status(200).json({
            message: "Cart updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
// get cart
export const getCart = async (req, res) => {
    try {
        let count = 0;
        const cartId = req.cartId;
        const cart = await cartModel
            .findOne({ _id: cartId })
            .populate("productIds");
        return res.status(200).json({
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteCart = async (req, res) => {
    try {
        const cartId = req.cartId;
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
