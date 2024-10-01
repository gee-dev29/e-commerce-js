import { cartModel } from "../model/cartModel.js";
import { productModel } from "../model/productModel.js";
import { entity } from "../utils/entity.js";
import { cartField } from "../utils/inputFields.js";

const addProductToCart = async (req, res) => {
    try {
      const userId = req.id;
      const { productIds, items } = req.products;
      const productId = productIds;
  
      // Find the user's cart
      let cart = await cartModel.findOne({ creatorId: userId });
  
      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = new cartModel({
          creatorId: userId,
          productIds: [{
            product: productId,
            items: {
              quantity: items.quantity,
              color: items.color,
              size: items.size,
            },
          }],
        });
        await cart.save();
        return res.status(201).json({ message: "Cart created and product added" });
      }
  
      // Check if the product already exists in the cart
      const existingProduct = cart.productIds.find(
        (p) =>
          p.product.toString() === productId &&
          p.items.color === items.color &&
          p.items.size === items.size
      );
  
      if (existingProduct) {
        // Update the quantity of the existing product
        existingProduct.items.quantity += items.quantity;
      } else {
        // Add the new product to the cart
        cart.productIds.push({
          product: productId,
          items: {
            quantity: items.quantity,
            color: items.color,
            size: items.size,
          },
        });
      }
  
      // Save the updated cart
      await cart.save();
      return res.status(200).json({ message: "Cart updated successfully", data: cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

const addProductsToCart = async (req, res) => {
  try {
    const userId = req.id; // Assuming this is the authenticated user's ID
    const allProducts = req.products;

    let cart = await cartModel.findOne({ creatorId: userId });

    // If no cart exists, create a new one
    if (!cart) {
      const newCart = new cartModel({
        creatorId: userId,
        productIds: req.products,
      });

      await newCart.save();
      return res.status(201).json({
        message: "Cart created and products added",
        cart: newCart, // Return the new cart for client-side use
      });
    }
    let updatedPayload = [];
    // If a cart already exists, update it
    for (const item of allProducts) {
      const productId = item.product._id;
      if (!productId) {
        return res.status(400).json({
          message: `Product with missing productId: ${JSON.stringify(item)}`,
        });
      }

      // Check if the product with the same `productId`, `color`, and `size` already exists in the cart
      const existingProductIndex = cart.productIds.findIndex(
        (p) =>
          p.product._id === productId &&
          p.color === item.items.color &&
          p.size === item.items.size
      );

      if (existingProductIndex !== -1) {
        // If the product already exists (same productId, color, size), update its quantity
        const payload = (cart.productIds[existingProductIndex].items.quantity +=
          item.items.quantity);
        updatedPayload.push(payload);
      } else {
        // If the product doesn't exist in the cart, add it as a new entry
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
    const cart = await cartModel.findOne({ creatorId: userId }).populate({
      path: "productIds.product", // Populate the product details
      model: "product", // Make sure the product model is correctly referenced
    });

    return res.status(200).json({
      data: cart,
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
