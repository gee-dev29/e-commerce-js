import { isValidObjectId } from "mongoose";
import { heroModel } from "../model/heroModel.js";
import { entity } from "../utils/entity.js";
import { heroField } from "../utils/inputFields.js";
import { uploadDocument } from "./uploadController.js";

export const addHero = async (req, res) => {
    try {
        const { _id, image, text, title } = req.body;
        const checkFields = entity.checkMissingFieldsInput(heroField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        if (isValidObjectId(_id)) {
            if (image.includes("https")) {
                entity.updateDataById(_id, req.body, heroModel);
                return res.status(200).json({
                    message: "hero updated successfully",
                });
            } else {
                const result = await uploadDocument(image, "");
                const payload = {
                    title: req.body.title,
                    image: result.documentLink,
                    text:req.body.text
                };
                entity.updateDataById(_id, payload, heroModel);
                return res.status(200).json({
                    message: "hero updated successfully",
                });
            }
        }
        const img = await uploadDocument(image, "");
        const hero = new heroModel({
            image: img.documentLink,
            text: text,
            title: title,
        });

        await hero.save();
        return res.status(201).json({ message: "hero created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getHeros = async (req, res) => {
    try {
        const data = await entity.getAllFilteredData(heroModel, {});
        return res.status(200).json({ payload: data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
