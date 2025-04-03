import { shippingModel } from "../model/shippingModel.js";
import { entity } from "../utils/entity.js";
import { shippingField, updateShippingField } from "../utils/inputFields.js";

export const createShippingRate = async (req, res) => {
  try {
    const shippingId = req.body._id;
    const { shippingRate, subregion, currency } = req.body;
    const payload = {
      shippingRate: shippingRate,
      subregion: subregion,
      currency: currency ?? "USD",
    };
    const checkFields = entity.checkMissingFieldsInput(shippingField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    if (shippingId) {
      await entity.updateDataById(shippingId, payload, shippingModel);
      return res.status(200).json({ message: "shipping update successfully " });
    }
    const shipping = new shippingModel({
      shippingRate: shippingRate,
      subregion: subregion,
      currency: currency  ?? "USD",
    });
    await shipping.save();
    return res.status(200).json({
      message: "Shipping rate created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// export const updateShippingInfo = async (req, res) => {
//     try {
//         const shipping = req.shippingInfo;
//         const {
//             state,
//             city,
//             street,
//             zipCode,
//             shippingNote,
//             shippingCountry,
//             shippingFee,
//             currency,
//         } = req.body;
//         const checkFields = entity.checkMissingFieldsInput(
//             updateShippingField,
//             req.body
//         );
//         if (!checkFields.result) {
//             return res.status(400).json({
//                 message: checkFields.message,
//             });
//         }

//         const shippingInfo = await shippingModel.findById(shipping._id);
//         if (!shippingInfo) {
//             return res.status(404).json({
//                 message: "shipping info not found",
//             });
//         }

//         shippingInfo.shippingAddress[0].street = street;
//         shippingInfo.shippingAddress[0].city = city;
//         shippingInfo.shippingAddress[0].state = state;
//         shippingInfo.shippingAddress[0].zipCode = zipCode;
//         shippingInfo.shippingCountry = shippingCountry;
//         shippingInfo.shippingNote = shippingNote;
//         shippingInfo.shippingFee = shippingFee;
//         shippingInfo.currency = currency;
//         await shippingInfo.save();
//         return res.status(200).json({
//             message: "shipping info updated successfully",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//         });
//     }
// };

export const getShippingrate = async (req, res) => {
  try {
    const { subregion } = req.query;
    const filter = {
      subregion: subregion,
    };
    const data = await entity.getAllFilteredData(shippingModel, filter);
    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllShippingRates = async (req, res) => {
  try {
    const shippingInfo = await entity.getAllFilteredData(shippingModel);
    return res.status(200).json({ data: shippingInfo });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteShippingRate = async (req, res) => {
  try {
    const { shippingId } = req.query;
    await entity.deleteDataById(shippingId, shippingModel);
    return res.status(200).json({
      message: "shipping rate deleted successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}; 
