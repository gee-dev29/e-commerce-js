import { EntityManager } from "typeorm";
import { productModel } from "../interface/productModel.js";
import { entity } from "../utils/entity.js";
import { productField } from "../utils/inputFields.js";

export const createProduct = async (req, res) => {
    try {
        const creatorId = req.id;
        const {
            productTitle,
            productDescription,
            productPrice,
            productDiscount,
            productCategory,
            productColors,
            productSize,
            productStock,
            productImages,
        } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            productField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const newProduct = new productModel({
            creatorId: creatorId,
            productTitle: productTitle,
            productDescription: productDescription,
            productPrice: productPrice,
            productDiscount: productDiscount,
            productCategory: productCategory,
            productColors: productColors,
            productSize: productSize,
            productStock: productStock,
            productImages: productImages,
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
        const products = await entity.getAllFilteredData(productModel, {});
        return res.status(200).json({ payload: products });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get single product
export const getSingleProduct = async (req, res) => {
    try {
        return res.status(200).json({ payload: req.product });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//update product
export const updateProduct = async (req, res) => {
    try {
        const product = req.product;
        const {
            productTitle,
            productDescription,
            productPrice,
            productDiscount,
            productCategory,
            productColors,
            productSizes,
            productImages,
            productQuantity,
        } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            productField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const payload = {
            productTitle: productTitle,
            productDescription: productDescription,
            productPrice: productPrice,
            productDiscount: productDiscount,
            productCategory: productCategory,
            productColors: productColors,
            productSizes: productSizes,
            productImages: productImages,
            productQuantity: productQuantity,
        };
        await entity.updateDataById(req.params.id, payload, productModel);
        return res.status(200).json({
            message: "product updated successfuly",
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//delete product
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await entity.deleteDataById(id, productModel);
        return res.status(200).json({
            message: "product deleted successfuly",
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
