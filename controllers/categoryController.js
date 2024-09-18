import { categoryModel } from "../model/categoryModel";
import { entity } from "../utils/entity";

export const addCategory = async (req, res) => {
  try {
    const checkFields = entity.checkMissingFieldsInput("name", req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const category = new categoryModel({
        name: req.body.name
    })
    await category.save()

    return res.status(200).json({
      message: 'successful',
    });
  } catch (error) {}
};

export const getAllCategories = async (req, res) => {
  try {
    const result = entity.getAllFilteredData(categoryModel, {});
    return res.status(200).json({
      payload: result,
    });
  } catch (error) {}
};
