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

const addProductsToCart = async (req, res) => {
    try {
        const userId = req.id;
        const allProducts = req.products; 
        let cart = await cartModel.findOne({ creatorId: userId });
        if (!cart) {
            const totalAmount = allProducts.reduce((sum, item) => sum + (item.quantity * item.productPrice), 0);
            const productIds = allProducts
                .map(item => item.productId || item._id) 
                .filter(productId => productId); 
            if (productIds.length !== allProducts.length) {
                return res.status(400).json({
                    message: "Some products have missing product IDs",
                });
            }
            const quantity = allProducts.reduce((sum, item) => sum + item.quantity, 0);
            const newCart = new cartModel({
                creatorId: userId,
                productIds: productIds,
                quantity: quantity,
                totalAmount: totalAmount,
            });
            await newCart.save();
            return res.status(201).json({
                message: "Cart created and products added",
            });
        }
        for (const item of allProducts) {
            const productId = item.productId || item._id;
            if (!productId) {
                return res.status(400).json({
                    message: `Product with missing productId: ${JSON.stringify(item)}`,
                });
            }
            if (cart.productIds.includes(productId)) {
                cart.quantity += item.quantity;
                cart.totalAmount += item.quantity * item.productPrice;
            } else {
                cart.productIds.push(productId);
                cart.quantity += item.quantity;
                cart.totalAmount += item.quantity * item.productPrice;
            }
        }
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

export { addProductToCart, addProductsToCart, deleteCart, updateCart };
