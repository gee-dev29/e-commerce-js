import { deliveryModel } from "../model/deliveryModel.js";
import { entity } from "../utils/entity.js";
import { deliveryField } from "../utils/inputFields.js";

export const createDeliveryAddress = async (req, res) => {
  try {
    const userId = req.id;
    const { fullName, street, city, state, country, zipCode, phone, _id } = req.body;

    const missingFields = entity.checkMissingFieldsInput(
      deliveryField,
      req.body
    );
    if (missingFields && missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    if(_id){
      await entity.updateDataById(_id, req.body, deliveryModel)
      return res.status(200).json({
        message: 'Updated successfully'
      }) 
    }

    const delivery = new deliveryModel({
      creatorId: userId,
      fullName: fullName,
      street: street,
      city: city,
      state: state,
      country: country,
      zipCode: zipCode,
      phone: phone,
    });

    await delivery.save();

    return res.status(201).json({
      message: "Delivery created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserDeliveryAddress = async (req, res) => {
  try {
    const userId = req.id;
    const filter = { creatorId: userId };
    const data = await entity.getAllFilteredData(deliveryModel, filter);

    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDeliveryAddress = async (req, res) => {
  try {
      const {id} = req.query
      await entity.deleteDataById(id, deliveryModel)
      res.status(200).json({
        message: "Deleted successfully"
      })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
