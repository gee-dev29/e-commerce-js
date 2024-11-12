import { isValidObjectId } from "mongoose";
import { colorModel } from "../model/colorsModel.js";
import { entity } from "../utils/entity.js";
import { categoryField } from "../utils/inputFields.js";
import { uploadDocument } from "./uploadController.js";
import { subCategoryModel } from "../model/subcategoryModel.js";

export const addSubCategory = async (req, res) => {
    try {
        const { _id, image, name } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            categoryField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        if (isValidObjectId(_id)) {
            if (image.includes("https")) {
                entity.updateDataById(_id, req.body, subCategoryModel);
                return res.status(200).json({
                    message: "Subcategory updated successfully",
                });
            } else {
                const result = await uploadDocument(image, "");
                const payload = {
                    name: req.body.name,
                    image: result.documentLink,
                };
                entity.updateDataById(_id, payload, subCategoryModel);
                return res.status(200).json({
                    message: "subcategory updated successfully",
                });
            }
    }
        const imageData = await uploadDocument(req.body.image, "");
        const category = new subCategoryModel({
            name: req.body.name,
            image: imageData.documentLink,
        });
        await category.save();

        return res.status(200).json({
            message: "subcategory added successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllSubCategories = async (req, res) => {
    try {
        const result = await entity.getAllFilteredData(subCategoryModel, {});
        return res.status(200).json({
            payload: result,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const deleteSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.query;
        await entity.deleteDataById(categoryId, subCategoryModel);
        return res.status(200).json({
            message: "category deleted successfuly",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
