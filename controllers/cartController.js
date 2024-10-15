import { cartModel } from "../model/cartModel.js";
import { entity } from "../utils/entity.js";
import { cartField } from "../utils/inputFields.js";

const addProductToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, color, quantity, size } = req.products;

        let cart = await cartModel.findOne({ creatorId: userId });

        if (!cart) {
            cart = new cartModel({
                creatorId: userId,
                productIds: [
                    {
                        product: productId,
                        quantity: quantity,
                        color: color,
                        size: size,
                    },
                ],
            });
            await cart.save();
            return res.status(201).json({ message: "product added to cart" });
        }
        const existingProduct = cart.productIds.find(
            (p) =>
                p.product.toString() === productId &&
                p.color === color &&
                p.size === size
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.productIds.push({
                product: productId,
                quantity: quantity,
                color: color,
                size: size,
            });
        }

        await cart.save();
        return res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addProductsToCart = async (req, res) => {
    try {
        const userId = req.id;
        const allProducts = req.products;

        let cart = await cartModel.findOne({ creatorId: userId });
        if (!cart) {
            const newCart = new cartModel({
                creatorId: userId,
                productIds: allProducts,
            });

            await newCart.save();
            return res.status(201).json({
                message: "Cart created and products added",
                cart: newCart,
            });
        }
        let updatedPayload = [];
        for (const item of allProducts) {
            const productId = item.product._id;
            if (!productId) {
                return res.status(400).json({
                    message: `Product with missing productId: ${JSON.stringify(
                        item
                    )}`,
                });
            }

            const existingProductIndex = cart.productIds.findIndex(
                (p) =>
                    p.product._id === productId &&
                    p.color === item.items.color &&
                    p.size === item.items.size
            );

            if (existingProductIndex !== -1) {
                const payload = (cart.productIds[
                    existingProductIndex
                ].items.quantity += item.items.quantity);
                updatedPayload.push(payload);
            } else {
                updatedPayload.push({
                    product: productId,
                    items: {
                        quantity: item.items.quantity,
                        color: item.items.color,
                        size: item.items.size,
                    },
                });
            }
        }

        await entity.updateDataById(
            cart._id,
            { productIds: updatedPayload },
            cartModel
        );

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

export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await cartModel.find({ creatorId: userId }).populate({
            path: "productIds.product",
            model: "product",
        });

        const { productIds, ...others } = cart[0];

        return res.status(200).json({
            data: productIds,
        });
    } catch (error) {
        if (error.name === "CastError" && error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid user ID format." });
        }
        return res.status(500).json({ message: error.message });
    }
};

const deleteCart = async (req, res) => {
    try {
        const { productId, size, color } = req.body;
        const filter = { creatorId: req.id };

        // Find the cart first
        const cart = await cartModel.find(filter);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        // Filter out the product that matches productId, size, and color
        const updatedProducts = cart[0].productIds.filter(
            (product) =>
                !(
                    product.product.toString() === productId &&
                    product.size === size &&
                    product.color === color
                )
        );

        // Update the cart with the filtered products
        await entity.updateDataById(
            cart[0]._id,
            { productIds: updatedProducts },
            cartModel
        );
        return res.status(200).json({
            message: "Product deleted from the cart successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export { addProductToCart, addProductsToCart, deleteCart, updateCart };
