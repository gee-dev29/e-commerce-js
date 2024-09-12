import { shippingModel } from "../model/shippingModel.js";
import { entity } from "../utils/entity.js";
import { shippingField, updateShippingField } from "../utils/inputFields.js";

export const createShippingInfo = async (req, res) => {
    try {
        const userId = req.id;
        const {
            shippingTrackingNumber,
            state,
            city,
            street,
            zipCode,
            shippingNote,
            shippingCountry,
            shippingFee,
            currency,
        } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            shippingField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const newShippingInfo = new shippingModel({
            creatorId: userId,
            shippingTrackingNumber: shippingTrackingNumber,
            shippingAddress: [
                {
                    street: street,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                },
            ],
            shippingCountry: shippingCountry,
            shippingNote: shippingNote,
            shippingFee: shippingFee,
            currency: currency,
        });
        await newShippingInfo.save();
        return res.status(200).json({
            message: "Shipping info created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateShippingInfo = async (req, res) => {
    try {
        const shipping = req.shippingInfo;
        const {
            state,
            city,
            street,
            zipCode,
            shippingNote,
            shippingCountry,
            shippingFee,
            currency,
        } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            updateShippingField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const shippingInfo = await shippingModel.findById(shipping._id);
        if (!shippingInfo) {
            return res.status(404).json({
                message: "shipping info not found",
            });
        }

        shippingInfo.shippingAddress[0].street = street;
        shippingInfo.shippingAddress[0].city = city;
        shippingInfo.shippingAddress[0].state = state;
        shippingInfo.shippingAddress[0].zipCode = zipCode;
        shippingInfo.shippingCountry = shippingCountry;
        shippingInfo.shippingNote = shippingNote;
        shippingInfo.shippingFee = shippingFee;
        shippingInfo.currency = currency;
        await shippingInfo.save();
        return res.status(200).json({
            message: "shipping info updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const viewShippingInfo = async (req, res) => {
    try {
        const shipping = req.shippingInfo;
        return res.status(200).json({ data: shipping });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const viewShippingInfos = async (req, res) => {
    try {
        const shippingInfo = await entity.getAllFilteredData(shippingModel);
        return res.status(200).json({ data: shippingInfo });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
