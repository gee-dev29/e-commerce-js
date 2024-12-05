// const { model, default: mongoose } = require("mongoose");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import moment from "moment";
import mongoose from "mongoose";
import { currency } from "./currency.js";
import { receiptEmailTemplate } from "../emailService/template/template.js";
import { sendEmail } from "../emailService/email.js";
// this function checks if the user data is correct

// Encrypt function
// Encrypt function with createCipheriv and IV
function encryptData(text, key) {
    if (!key) {
        throw new Error("Encryption key is missing");
    }

    const iv = crypto.randomBytes(16); // Generate a random Initialization Vector
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(key, "hex"),
        iv
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Concatenate the IV with the encrypted data
    return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function to match encryptData changes
function decryptData(encryptedText, key) {
    if (!key) {
        throw new Error("Encryption key is missing");
    }

    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key, "hex"),
        iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

// // Decrypt function
// function decryptData(encryptedText, key) {
//     const decipher = crypto.createDecipher("aes-256-cbc", key);
//     let decrypted = decipher.update(encryptedText, "hex", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
// }

const updateDataById = async (id, payload, model) => {
    return await model.findByIdAndUpdate(id, payload, { new: true });
};

const updateArrayOfData = async (id, payload, model) => {
    return await model.updateOne(id, { $push: payload });
};

const deleteDataById = async (id, model) => {
    return await model.findByIdAndDelete(id);
};

const updateUserByEmail = async (email, payload, model) => {
    return await model.updateOne({ email: email }, payload, { new: true });
};

// encrypt user password
const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(password, salt);
    return HashPassword;
};

// decrypt password
const decryptPassword = async (password, user) => {
    return await bcrypt.compare(password, user);
};

// Document upload
const checkUploadDoc = async (body) => {
    const { file } = body;
    if (file == "") {
        return null;
    }
    return body;
};

const jwtSign = (id) => {
    const token = jwt.sign(
        {
            userId: id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "72hr",
        }
    );
    return token;
};

// generate Otp

const generateOtp = () => {
    const value = Math.random().toString().substr(2, 4);
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
    return { otp: value, expiresIn: expiresIn };
};

const getAllFilteredData = async (model, filter) => {
    const data = model.find(filter).sort({ createdAt: -1 });
    return data;
};

const checkMissingFieldsInput = (requiredFields, requestBody) => {
    const missingOrEmptyFields = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    requiredFields.forEach((field) => {
        const value = requestBody[field];
        if (
            !requestBody.hasOwnProperty(field) ||
            value === null ||
            value === undefined ||
            value === ""
        ) {
            missingOrEmptyFields.push(field);
        } else if (field === "email" && !emailRegex.test(value)) {
            missingOrEmptyFields.push(`${field} (invalid email)`);
        }
    });

    if (missingOrEmptyFields.length > 0) {
        return {
            result: false,
            message: `Missing required fields: ${missingOrEmptyFields.join(
                ", "
            )}`,
        };
    }

    return {
        result: true,
    };
};

const isValidUUID = (id) => {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const isValidObjectId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid({ id: id });
    return isValid;
};

const getPaginatedData = async (model, filter, skip, limit) => {
    const data = await model.find(filter).limit(limit).skip(skip);
    const totalRecords = await model.countDocuments(filter);
    return { totalRecords, data };
};
const getPaginatedDataWithPopulate = async (
    model,
    filter,
    skip,
    limit,
    path,
    selectedModel
) => {
    const data = await model
        .find(filter)
        .populate({
            path: path,
            model: selectedModel,
        })
        .limit(limit)
        .skip(skip);

    const totalRecords = await model.countDocuments(filter);
    return { data, totalRecords };
};
const getPaginatedDataWithMultiplePopulate = async (
    model,
    filter,
    skip,
    limit,
    paths,
    selectedModels
) => {
    const data = await model
        .find(filter)
        .populate(
            paths.map((path, index) => ({
                path: path,
                model: selectedModels[index], // Use corresponding model for each path
            }))
        )
        .limit(limit)
        .skip(skip);

    const totalRecords = await model.countDocuments(filter);
    return { data, totalRecords };
};
const getDataWithPopulate = async (model, filter, path, selectedModel) => {
    const data = await model.find(filter).populate({
        path: path,
        model: selectedModel,
    });

    const totalRecords = await model.countDocuments(filter);
    return { data, totalRecords };
};
const getDataWithMultiplePopulate = async (
    model,
    filter,
    paths,
    selectedModels
) => {
    const data = await model.find(filter).populate(
        paths.map((path, index) => ({
            path: path,
            model: selectedModels[index], // Use corresponding model for each path
        }))
    );

    const totalRecords = await model.countDocuments(filter);
    return { data, totalRecords };
};

const generateOrderNumber = () => {
    const prefix = "#KNC";

    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);

    return `${prefix}${randomNumber}`;
};

const sortByOrder = async (sortOrder, model, param, skip, limit) => {
  const sortValue = sortOrder === "asc" ? 1 : -1;
  const data = await model
    .find()
    .sort({ [param]: sortValue })
    .skip(skip)
    .limit(limit);

    const totalRecords = await model.countDocuments();

    return { totalRecords, data };
};

const saveOrder = async (orderData, userId, shippingId, orderModel) => {
  const {
    fullName,
    paymentMethod,
    totalAmount,
    email,
    orderNote,
    deliveryId,
    orderedItems,
  } = orderData;

  const newOrder = new orderModel({
    creatorId: userId,
    fullName: fullName,
    orderedItems: orderedItems,
    orderTrackingNumber: generateOrderNumber(),
    paymentMethod: paymentMethod,
    totalAmount: totalAmount,
    email: email,
    deliveryId: deliveryId,
    shippingId: shippingId,
    orderNote: orderNote || "",
    currency: currency.USD,
  });
  await newOrder.save();
  return newOrder;
};

const sendOrderEmail = async (order) => {
  const filter = {
    _id: order._id,
  };
  const { data } = getDataWithPopulate(
    order,
    filter,
    "orderedItems.productId",
    "product"
  );

  let populatedOrderedItems = {
    productTitle: data.productTitle,
    productImage: data.productImages,
    price: data.productPrice - (data.productPrice * data?.productDiscount),

  };

  // ...item,
  // itemTotalPrice,

  const orderEmail = receiptEmailTemplate(
    order.orderTrackingNumber,
    new Date().toISOString(),
    order.country,
    order.state,
    order.city,
    order.totalAmount,
    populatedOrderedItems
  );
  const emailService = {
    recieverEmail: order.email,
    subject: "Your Order Receipt",
    text: orderEmail,
  };
  await sendEmail(emailService);
};

export const entity = {
  encryptPassword,
  getPaginatedDataWithPopulate,
  getPaginatedDataWithMultiplePopulate,
  getDataWithMultiplePopulate,
  getDataWithPopulate,
  getPaginatedData,
  decryptPassword,
  jwtSign,
  getAllFilteredData,
  checkUploadDoc,
  updateUserByEmail,
  checkMissingFieldsInput,
  updateDataById,
  deleteDataById,
  updateArrayOfData,
  encryptData,
  decryptData,
  generateOtp,
  isValidUUID,
  isValidObjectId,
  generateOrderNumber,
  saveOrder,
  sortByOrder,
  sendOrderEmail
};
