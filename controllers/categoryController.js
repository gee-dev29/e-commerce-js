import { categoryModel } from "../model/categoryModel.js";
import { colorModel } from "../model/colorsModel.js";
import { entity } from "../utils/entity.js";
import { uploadDocument } from "./uploadController.js";

export const addCategory = async (req, res) => {
  try {
    const checkFields = entity.checkMissingFieldsInput(["name"], req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const image =  await uploadDocument(req.body.image, '')
    const category = new categoryModel({
        name: req.body.name,
        image: image
    })
    await category.save()

    return res.status(200).json({
      message: 'category added successfully',
    });
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await entity.getAllFilteredData(categoryModel, {});
    return res.status(200).json({
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
};


export const getAllColors = async (req, res) => {
  try {
    const result = await entity.getAllFilteredData(colorModel, {});
    return res.status(200).json({
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId
    await entity.deleteDataById(categoryId, categoryModel)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}