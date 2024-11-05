import reviewModel from "../model/reviewModel";
import { entity } from "../utils/entity";
import { reviewFieldId } from "../utils/inputFields";

export const createReview = async (req, res) => {
  try {
    const { productId, comment } = req.body;
    const checkFields = entity.checkMissingFieldsInput(reviewFieldId, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    const newReview = new reviewModel({
      creatorId: creatorId,
      productId: productId,
      comment: comment,
    });
    await newReview.save();
    return res.status(201).json({
      message: "review created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const { id, status } = req.body;
    const payload = {
      isApproved: status,
    };
    await entity.updateDataById(id, payload, reviewModel);
    return res.status(201).json({
      message: "review approved successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const reviews = await entity.getPaginatedData(reviewModel, {}, skip, limit);
    return res.status(200).json({ payload: reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
