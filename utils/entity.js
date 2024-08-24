// const { model, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");
// this function checks if the user data is correct

// Encrypt function
function encryptData(text, key) {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Decrypt function
function decryptData(encryptedText, key) {
  const decipher = crypto.createDecipher("aes-256-cbc", key);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

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
const decryptPassword = (password, user) => {
  let decrypted;
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      decrypted = result;
    }
  });
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
      expiresIn: "30d",
    }
  );
  return token;
};

// generate Otp

const generateOtp = () => {
  const value = Math.random().toString().substr(2, 4);
  const expiresIn = moment().add(15, "minute");
  const payload = {
    value,
    expiresIn,
  };
  return payload;
};

const getAllFilteredData = async (model, filter) => {
  const data = model.find(filter).sort({ createdAt: -1 });
  return data;
};

module.exports = {
  encryptPassword,
  decryptPassword,
  jwtSign,
  getAllFilteredData,
  checkUploadDoc,
  updateUserByEmail,
  updateMessageById,
  updateDataById,
  deleteDataById,
  updateArrayOfData,
  encryptData,
  decryptData,
  generateOtp,
};
