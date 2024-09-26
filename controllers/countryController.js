import { countryModel } from "../model/countryModel.js";
import { entity } from "../utils/entity.js";

export const getAllCountries = async (req, res) => {
  try {
    const data = await entity.getAllFilteredData(countryModel);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
