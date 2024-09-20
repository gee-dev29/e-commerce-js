import { UserStatus } from "../enums/statusEnum.js";
import { entity } from "../utils/entity.js";
import { userModel } from "../model/userModel.js";
import {
  adminRegisterField,
  loginField,
  registerField,
  updateField,
  verifyOTPField,
} from "../utils/inputFields.js";
import resetPasswordTemplate from "../emailService/template/template.js";
import { sendEmail } from "../emailService/email.js";
import { messages } from "../message/messageEnum.js";
import { Role } from "../enums/role.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const checkFields = entity.checkMissingFieldsInput(registerField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const otp = entity.generateOtp();
    const hashPassword = await entity.encryptPassword(password);
    const user = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      otp: otp,
    });

    sendRegistrationEmails(email, firstName, otp);
    await user.save();
    return res.status(201).json({
      message: "user created successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkFields = entity.checkMissingFieldsInput(loginField, req.body);

    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const user = req.user;
    const isPasswordValid = await entity.decryptPassword(
      password,
      req.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = entity.jwtSign(user._id);
    return res.status(200).json({
      message: "User login successful",
      payload: {
        token: token,
        data: user,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkFields = entity.checkMissingFieldsInput(loginField, req.body);

    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const user = req.user;
    const isPasswordValid = await entity.decryptPassword(
      password,
      req.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    if(user.role === Role.USER){
        return res.status(401).json({
            message: "Not Authorized"
        })
    }
    const token = entity.jwtSign(user._id);
    return res.status(200).json({
      message: "User login successful",
      payload: {
        token: token,
        data: user,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const checkFields = entity.checkMissingFieldsInput(
      adminRegisterField,
      req.body
    );
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    if(req.user.email == email){
        return res.status(400).json({
            message: 'User already exists'
        })
    }
    const hashPassword = await entity.encryptPassword(password);
    const user = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      role: role,
    });
    // sendRegistrationEmails(email, firstName);
    await user.save();
    return res.status(201).json({
      message: "Admin created successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//get user
export const viewSingleUser = async (req, res) => {
  try {
    // const user = req.user
    return res.status(200).json({ payload: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewAllUsers = async (req, res) => {
  try {
    const users = await entity.getAllFilteredData(userModel, {
      role: req.query.role,
    });
    return res.status(200).json({ payload: users });
  } catch (error) {
    console.log(error);
  }
};

//delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    await entity.deleteDataById(userId, userModel);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {}
};

//suspend a user
export const toggleSuspendUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (user.status == UserStatus.ACTIVE) {
      const payload = {
        status: UserStatus.SUSPENDED,
      };
      await entity.updateDataById(userId, payload, userModel);
      return res.status(200).json({
        message: "user suspended successfully",
      });
    }
    const payload = {
      status: UserStatus.ACTIVE,
    };
    await entity.updateDataById(userId, payload, userModel);
    return res.status(200).json({
      message: "user activated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//update user
export const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { phone, address, profilePicture } = req.body;
    const checkFields = entity.checkMissingFieldsInput(updateField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const payload = {
      phone: phone,
      address: address,
      profilePicture: profilePicture,
    };
    await entity.updateDataById(user._id, payload, userModel);
    return res.status(200).json({
      message: "user updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const user = req.user;
    const { email } = req.body;
    const token = jwtSign(user._id);
    const encrypedToken = encryptData(token, process.env.ENCRYPTION_KEY);
    const text = resetPasswordTemplate(encrypedToken, user.fullName);
    const emailMessage = {
      recieverEmail: email,
      subject: "Forgot Password verification",
      text: text,
    };
    sendEmail(emailMessage);
    res.status(200).json({
      message: "An email has been sent to your mailbox",
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const checkFields = entity.checkMissingFieldsInput(
      verifyOTPField,
      req.body
    );
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    const _doc = req.user;
    console.log(_doc);
    if (otp !== _doc.otp.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    } else {
      const updateData = {
        isVerified: true,
      };
      await entity.updateDataById(_doc._id, updateData, userModel).then(() => {
        const emailMessage = {
          recieverEmail: email,
          subject: "Account verification successful",
          text: `Hello ${_doc.fullName}. ${messages.VERIFIED_OTP}`,
        };
        const payload = {
          id: _doc._id,
          role: _doc.role,
        };
        const token = entity.jwtSign(payload);
        res.setHeader("Authorization", `Bearer ${token}`);
        sendEmail(emailMessage);
        return res.status(200).json({
          message: "OTP verification successful",
        });
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const sendRegistrationEmails = (email, fullName) => {
  const otpMessage = {
    recieverEmail: email,
    subject: "Verify Otp",
    text: `Hello ${fullName}. ${messages.VERIFIED_OTP}`,
  };

  const emailMessage = {
    recieverEmail: email,
    subject: "New Registration",
    text: `Hello ${fullName}. ${messages.REGISTRATION}`,
  };

  sendEmail(emailMessage);
  sendEmail(otpMessage);
};
