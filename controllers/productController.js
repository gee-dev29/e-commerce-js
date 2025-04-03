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
      productSubCategory,
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
      productSubCategory: productSubCategory,
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
export const getAllProducts = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const products = await entity.getPaginatedData(
      productModel,
      {},
      skip,
      limit
    );
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
    const { productId } = req.query;
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

export const getProductBySubcategory = async (req, res) => {
  try {
    const data = await entity.getAllFilteredData(productModel, {
      productSubCategory: req.body.productSubCategory,
    });
    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductsSortedByPrice = async (req, res) => {
  try {
    const { sortOrder, skip, limit } = req.query;
    const data = await entity.sortByOrder(
      sortOrder,
      productModel,
      "productPrice",
      skip,
      limit
    );

    return res.status(200).json({
      payload: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchProduct = async (req, res) => {
  const { minPrice, maxPrice, category, subcategory, colors, sizes, title, limit, skip } =
    req.query;

  const filter = {};

  // Price range filter 
  if (minPrice || maxPrice) {
    filter.productPrice = {};
    if (minPrice) {
      filter.productPrice.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
    }
    if (maxPrice) {
      filter.productPrice.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
    }
  }

  // Category filter
  if (category) {
    filter.productCategory = category; // Exact match
  }
  // Category filter
  if (subcategory) {
    filter.productSubCategory = subcategory; // Exact match
  }

  if(title){
    filter.productTitle = { $regex: title, $options: "i" };
  }

  // Color filter
  if (colors) {
    const colorNames = colors.split(",").map((color) => color.trim());
    filter.productColors = { $elemMatch: { name: { $in: colorNames } } }; // Match any of the specified colors
  }

  // Size filter
  if (sizes) {
    const sizeArray = sizes.split(",").map((size) => size.trim());
    filter.productSize = { $in: sizeArray }; // Match any of the specified sizes
  }


  try {
    const data = await entity.getPaginatedData(
      productModel,
      filter,
      skip,
      limit
    );

    return res.json({ payload: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsColors = async (req, res) => {
  try {
    const data = await productModel.distinct("productColors");
    res.json({
      payload: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
