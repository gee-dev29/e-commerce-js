import { entity } from "../utils/entity.js";
import { reviewFieldId } from "../utils/inputFields.js";
import { reviewModel } from "../model/reviewModel.js";
import { orderModel } from "../model/orderModel.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, orderId, comment } = req.body;
    const checkFields = entity.checkMissingFieldsInput(reviewFieldId, req.body);

    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderedItem = order.orderedItems.find(
      (item) => item.product.toString() === productId && item.canReview === true
    );

    if (!orderedItem) {
      return res.status(400).json({
        message: "This product cannot be reviewed or is not part  of the order",
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
    orderedItem.canReview = false;
    await order.save();

    return res.status(201).json({
      message: "Review created successfully",
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
    if (status == "pending") {
      filter = {
        isApproved: false,
      };
    }
    if (status == "accepted") {
      filter = {
        isApproved: true,
      };
    }

    const reviews = await entity.getDataWithMultiplePopulate(
      reviewModel,
      filter,
      ["creatorId", "productId"],
      ["user", "product"]
    );
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

export const getUserProductReviews = async (req, res) => {
  try {
    const userId = req.id;
    const filter = {
      creatorId: userId,
      "orderedItems.canReview": true,
    };
    const { skip, limit } = req.query;

    const data = await entity.getPaginatedDataWithMultiplePopulate(
      orderModel,
      filter,
      skip,
      limit,
      ["orderedItems.product"],
      ["product"]
    );

    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.query;
    const filter = {
      productId: id,
      isApproved: true,
    };

    const reviews = await reviewModel.find(filter).populate({
      path: "creatorId",
      model: "user",
      select: "firstName  lastName",
    });

    return res.status(200).json({
      payload: reviews,
    });
  } catch (error) {}
};
