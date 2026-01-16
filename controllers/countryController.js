import axios from "axios";
import { countryModel } from "../model/countryModel.js";
import { entity } from "../utils/entity.js";
import { currencyRateModel } from "../model/currencyRateModel.js";

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

export const getCurrencyRate = async (req, res) => {
  try {
    const { currencyCode } = req.query;
    
    const latestCurrencyData = await currencyRateModel
      .findOne()
      .sort({ date: -1 }) 
      .limit(1);
    
    if (!latestCurrencyData) {
      return res.status(404).json({
        message: `No currency data found in the database.`,
      });
    }
    const { rates } = latestCurrencyData;
    
    if (rates[currencyCode]) {
      return res.status(200).json({
        payload: rates[currencyCode]
      }) 
    } else {
      return res.status(404).json({
        message: `Rate for ${currencyCode} not found.`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchCurrencyRates = async () => {
  try {
    const response = await axios.get(
      "https://v6.exchangerate-api.com/v6/56e5475446a12586f3b9e047/latest/USD"
    );
    const data = response.data;

    await currencyRateModel.deleteMany({});

    const currencyData = new currencyRateModel({
      base: data.base_code,
      rates: data.conversion_rates,
      date: data.time_last_update_utc,
    });

    await currencyData.save();

    console.log("Currency rates updated successfully!");
  } catch (error) {
    console.error("Error fetching currency rates:", error);
  }
};
