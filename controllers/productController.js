import { productModel } from "../model/productModel.js";
import { entity } from "../utils/entity.js";
import { productField } from "../utils/inputFields.js";
import { uploadDocument } from "./uploadController.js";

// create product and update product
export const createProduct = async (req, res) => {
  try {
    const creatorId = req.id;
    const {
      productId,
      productTitle,
      productDescription,
      productPrice,
      productDiscount,
      productCategory,
      productColors,
      productSize,
      productStock,
      productImages,
      productShortDescription,
    } = req.body;
    const checkFields = entity.checkMissingFieldsInput(productField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    if (productId) {
      const images = [];
      const { productImages, ...others } = req.body;
      await Promise.all(
        productImages.map(async (data) => {
          if (data.includes("https")) {
            images.push(data);
          } else {
            const image = await uploadDocument(data, "");
            images.push(image.documentLink);
          }
        })
      );
      const payload = {
        ...others,
        productImages: images,
      };
      await entity.updateDataById(productId, payload, productModel);
      return res.status(200).json({
        message: "product updated successfuly",
      });
    }
    const allImages = await Promise.all(
      productImages.map(async (data) => {
        const image = await uploadDocument(data, "");
        return image ? image.documentLink : null;
      })
    );

    const newProduct = new productModel({
      creatorId: creatorId,
      productTitle: productTitle,
      productDescription: productDescription,
      productPrice: productPrice,
      productDiscount: productDiscount,
      productShortDescription: productShortDescription,
      productCategory: productCategory,
      productColors: productColors,
      productSize: productSize,
      productStock: productStock,
      productImages: allImages,
    });
    await newProduct.save();
    return res.status(201).json({
      message: "product created successfuly",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get all products
export const viewProducts = async (req, res) => {
  try {
    const products = await entity.getAllFilteredData(productModel, {});
    return res.status(200).json({ payload: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get single product
export const viewProduct = async (req, res) => {
  try {
    return res.status(200).json({ payload: req.product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.productId;
    await entity.deleteDataById(productId, productModel);
    return res.status(200).json({
      message: "product deleted successfuly",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const data = await entity.getAllFilteredData(productModel, {
      productCategory: req.body.productCategory,
    });
    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const { productCategory, productTitle, skip, limit } = req.query;
    const filter = {};
    const searchParams = {
      productCategory,
      productTitle,
    };
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim()) filter[key] = { $regex: value, $options: "i" };
    });

    const retrivedData = await entity.getPaginatedData(
      productModel,
      filter,
      skip,
      limit
    );
    return res.status(200).json({ payload: retrivedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
