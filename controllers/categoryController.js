import { entity } from "../utils/entity";

export const addCategory = async (req, res) => {
  try {
    const checkFields = entity.checkMissingFieldsInput('category', req.body)
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
  } catch (error) {}
};
