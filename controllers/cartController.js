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
        // get the cart model of the user
        const cart = await cartModel.findById(userId);
        if (!cart) {
            const product = await productModel.findById(productId);
            const totalAmount = quantity * product.productPrice;
            const newCart = new cartModel({
                creatorId: userId,
                productIds: [productId],
                quantity: quantity,
                totalAmount: totalAmount,
            });
            await newCart.save();
            return res.status(200).json({
                message: "product added to cart",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const product = req.product;
        console.log(product);
        const cartId = req.cartId;
        const cart = req.cart;
        const { productId, quantity } = req.body;
        const checkFields = entity.checkMissingFieldsInput(cartField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const payload = {
            productId: productId,
            quantity: quantity,
        };
        // if(cart.productIds.includes(productId)){
        //     payload.productIds = [...cart.productIds, productId];
        // }else{
        //     payload.productIds = cart.productIds;
        // }
        // check if the product is already in the cart

        // if the product id already exist in the cart, just increase the quantity
        if (cart && cart.productIds.includes(productId)) {
            //increase the quantity
            cart.quantity += quantity;
            cart.totalAmount = cart.quantity * product.productPrice;
            await cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
            });
        }
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
// get cart
export const getCart = async (req, res) => {
    try {
        const cartId = req.cartId;
        const cart = await cartModel.findOne({ _id: cartId })
            .populate("productIds");
        return res.status(200).json({ payload: cart });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
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
