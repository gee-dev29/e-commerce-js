import { isValidObjectId } from "mongoose";
import { categoryModel } from "../model/categoryModel.js";
import { colorModel } from "../model/colorsModel.js";
import { entity } from "../utils/entity.js";
import { categoryField } from "../utils/inputFields.js";
import { uploadDocument } from "./uploadController.js";

export const addCategory = async (req, res) => {
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
                entity.updateDataById(_id, req.body, categoryModel);
                return res.status(200).json({
                  message: "category updated successfully",
              });
            } else {
                const result = await uploadDocument(image, "");
                const payload = {
                    name: req.body.name,
                    image: result.documentLink,
                };
                entity.updateDataById(_id, payload, categoryModel);
                return res.status(200).json({
                  message: "category updated successfully",
              });
            }
        }
        const imageData = await uploadDocument(req.body.image, "");
        const category = new categoryModel({
            name: req.body.name,
            image: imageData.documentLink,
        });
        await category.save();

        return res.status(200).json({
            message: "category added successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const result = await entity.getAllFilteredData(categoryModel, {});
        return res.status(200).json({
            payload: result,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllColors = async (req, res) => {
    try {
        const result = await entity.getAllFilteredData(colorModel, {});
        return res.status(200).json({
            payload: result,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        await entity.deleteDataById(categoryId, categoryModel);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
