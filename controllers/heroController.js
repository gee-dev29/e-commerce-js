import { heroModel } from "../model/heroModel";
import { entity } from "../utils/entity";
import { heroField } from "../utils/inputFields";
import { uploadDocument } from "./uploadController";

export const addHero = async (req, res) => {
    try {
        const [image, text, title] = req.body;
        const checkFields = entity.checkMissingFieldsInput(heroField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const img = await uploadDocument(image, "");
        const hero = new heroModel({
            image: img,
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
        return entity.getAllFilteredData(heroModel);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
