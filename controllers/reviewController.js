import { entity } from "../utils/entity.js";
import { reviewFieldId } from "../utils/inputFields.js";
import { reviewModel } from "../model/reviewModel.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const checkFields = entity.checkMissingFieldsInput(reviewFieldId, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const creatorId = req.id;
    const newReview = new reviewModel({
      creatorId: creatorId,
      productId: productId,
      rating: rating,
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

export const updateReview = async (req, res) => {
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
    const { status } = req.query;
    let filter = {};
    if (status != "all") {
      filter = {
        isApproved: status,
      };
    }
    const reviews = await entity.getAllFilteredData(reviewModel, filter);
    return res.status(200).json({ payload: reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllApprovedReviews = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const filter = {
      isApproved: true,
    };
    const reviews = await entity.getPaginatedData(
      reviewModel,
      filter,
      skip,
      limit
    );
    return res.status(200).json({ payload: reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
