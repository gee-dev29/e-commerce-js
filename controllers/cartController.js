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
            product: productId._id,
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
        p.product.toString() === productId._id &&
        p.color === color &&
        p.size === size
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.productIds.push({
        product: productId._id,
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
    const products = req.products; // Expecting an array of products

    // Validate input
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or empty product list" });
    }

    let cart = await cartModel.findOne({ creatorId: userId });

    if (!cart) {
      cart = new cartModel({
        creatorId: userId,
        productIds: [],
      });
    }

    // Process each product
    for (const { product, color, quantity, size } of products) {
      // Validate individual product fields
      if (!product || !color || !quantity || !size) {
        return res.status(400).json({ message: "Missing required fields in one or more products" });
      }

      const existingProduct = cart.productIds.find(
        (p) =>
          p.product.toString() === product._id &&
          p.color === color &&
          p.size === size
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.productIds.push({
          product: product._id,
          quantity: quantity,
          color: color,
          size: size,
        });
      }
    }

    await cart.save();
    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
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
    if (cart && cart.length > 0) {
      const { productIds, ...others } = cart[0];
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

export { addProductToCart, deleteCart, updateCart, addProductsToCart };
