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
import resetPasswordTemplate, {
  welcomeTemplate,
} from "../emailService/template/template.js";
import { sendEmail } from "../emailService/email.js";
import { messages } from "../message/messageEnum.js";
import { Role } from "../enums/role.js";
import { isValidObjectId } from "mongoose";
import { orderModel } from "../model/orderModel.js";
import { orderStatus } from "../enums/orderEnum.js";
import { tokenModel } from "../model/tokenModel.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const checkFields = entity.checkMissingFieldsInput(registerField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    const formattedEmail = email.toLowerCase();
    const otp = entity.generateOtp();
    const hashPassword = await entity.encryptPassword(password);
    const userExist = await userModel.findOne({
      email: formattedEmail,
    });
    if (!userExist) {
      const user = new userModel({
        firstName: firstName,
        lastName: lastName,
        email: formattedEmail,
        password: hashPassword,
        otp: otp,
      });

      const welcomeEmail = welcomeTemplate(user.firstName, user.lastName);
      const emailService = {
        recieverEmail: formattedEmail,
        subject: "Welcome to KNcloset!",
        text: welcomeEmail,
      };
      sendEmail(emailService);
      await user.save();
      return res.status(201).json({
        message: "user created successfuly",
      });
    }
    return res.status(400).json({
      message: "user already exists",
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
    console.log(req.password);

    if (!req.password) {
      return res.status(400).json({
        message: "user has no set password",
      });
    }
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

export const googleLogin = async (req, res) => {
  console.log(req);
  if (req.user) {
    const user = await userModel
      .findOne({ email: req.user.email })
      .select("-password");
    if (user) {
      const token = entity.jwtSign(user._id);
      return res.status(200).json({
        message: "Login Successful",
        token: token,
        data: user,
      });
    }
  } else {
    return res.status(200).json();
  }
};

export const failedGoogleLogin = async (req, res) => {
  res.status(401).json({
    status: false,
    message: "Login failed",
  });
};

export const googleLogout = async (req, res) => {
  req.logout();
  res.redirect("https://knclosets.com/login");
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
    if (user.role === Role.USER) {
      return res.status(401).json({
        message: "Not Authorized",
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

// register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { _id, firstName, lastName, email, password, role } = req.body;
    const checkFields = entity.checkMissingFieldsInput(
      adminRegisterField,
      req.body
    );
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }
    if (isValidObjectId(_id)) {
      const { password, ...others } = req.body;
      let result;
      if (password) {
        const hashPassword = await entity.encryptPassword(password);
        result = {
          ...others,
          password: hashPassword,
        };
      } else {
        result = others;
      }
      await entity.updateDataById(_id, result, userModel);
      return res.status(200).json({ message: "user updated successfully" });
    }
    const formattedEmail = email.toLowerCase();

    if (req.user.email == formattedEmail) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashPassword = await entity.encryptPassword(password);
    const user = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: formattedEmail,
      password: hashPassword,
      role: role,
    });
    const welcomeEmail = welcomeTemplate(user.firstName, user.lastName);
    const emailService = {
      recieverEmail: formattedEmail,
      subject: "Welcome to KNcloset!",
      text: welcomeEmail,
    };
    sendEmail(emailService);
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
    return res.status(500).json({ message: error.message });
  }
};

export const viewAllUsers = async (req, res) => {
  try {
    const users = await entity.getAllFilteredData(userModel, {
      role: req.query.role,
    });
    const filtereData = users.map((user) => {
      const { password, ...others } = user._doc;
      return others;
    });
    return res.status(200).json({ payload: filtereData });
  } catch (error) {
    console.log(error);
  }
};

//delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;
    await entity.deleteDataById(userId, userModel);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {}
};

//suspend a user
export const toggleSuspendUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await userModel.findById(userId);
    if (user.UserStatus == UserStatus.ACTIVE) {
      const payload = {
        UserStatus: UserStatus.SUSPENDED,
        isSuspended: true,
      };
      await entity.updateDataById(userId, payload, userModel);
      return res.status(200).json({
        message: "user suspended successfully",
      });
    } else {
      const payload = {
        UserStatus: UserStatus.ACTIVE,
        isSuspended: false,
      };
      await entity.updateDataById(userId, payload, userModel);
      return res.status(200).json({
        message: "user activated successfully",
      });
    }
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
    const { email } = req.body;

    const formattedEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: formattedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = entity.generateOtp();
    const otpUser = await entity.getAllFilteredData(tokenModel, {
      email: formattedEmail,
    })[0];

    if (otpUser) {
      const payload = {
        tokem: otp,
      };

      await entity.updateDataById(otpUser._id, payload, tokenModel);
    } else {
      const userToken = new tokenModel({
        email: formattedEmail,
        token: otp,
      });

      await userToken.save();
    }

    const forgotPasswordEmail = resetPasswordTemplate(
      otp,
      `${user.firstName} ${user.lastName}`
    );
    const emailMessage = {
      recieverEmail: formattedEmail,
      subject: "Forgot Password verification",
      text: forgotPasswordEmail,
    };
    sendEmail(emailMessage);
    res.status(200).json({
      message: "An email has been sent to your mailbox",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { password, otp, email } = req.body;

    const encryptedPassword = await entity.encryptPassword(password);
    const formattedEmail = email.toLowerCase();
    const payload = {
      password: encryptedPassword,
    };
    const otpUser = await tokenModel.find({
      email: formattedEmail,
    });

    const user = await userModel.find({
      email: formattedEmail,
    });

    if (otpUser[0].token.otp == otp && user[0].email == formattedEmail) {
      await entity.updateUserByEmail(formattedEmail, payload, userModel);

      const emailMessage = {
        recieverEmail: email,
        subject: "Password Reset Successful",
        text: `Hello ${user[0].firstName + " " + user[0].lastName}, your password has been successfully reset.`,
      };

      sendEmail(emailMessage);
      return res.status(200).json({
        message: "password reset successful",
      });
    }
    return res.status(400).json({
      message: "token is incorrect",
    });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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

export const userAnalytics = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();
    const totalSales = await orderModel.aggregate([
      {
        $match: {
          orderStatus: {
            $in: [orderStatus.PAID, orderStatus.DELIVERED, orderStatus.SHIPPED],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalSalesAmount = totalSales.length > 0 ? totalSales[0].total : 0;

    return res.status(200).json({
      totalUsers,
      totalOrders,
      totalSales: totalSalesAmount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Helper function to map numerical month (e.g., "01", "02") to month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper function to format month to "Month Year" format
const formatMonthYear = (year, month) =>
  `${monthNames[parseInt(month, 10) - 1]} ${year}`;

// Helper function to generate the initial summary template
const generateInitialMonthSummary = () => {
  return monthNames.map((monthName) => ({
    month: monthName,
    pendingOrders: 0,
    paidOrders: 0,
  }));
};

// Aggregation to get order summary per month for pending and paid orders
const getMonthlyOrderSummary = async () => {
  try {
    // Aggregating orders based on month and order status
    const result = await orderModel.aggregate([
      // Format the createdAt field to "Year-Month" for grouping
      {
        $project: {
          yearMonth: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          orderStatus: 1,
        },
      },
      // Group by year-month and order status to count the number of orders per status
      {
        $group: {
          _id: { yearMonth: "$yearMonth", status: "$orderStatus" },
          count: { $sum: 1 },
        },
      },
      // Re-group by year-month and accumulate the counts for pending and paid orders
      {
        $group: {
          _id: "$_id.yearMonth",
          pendingOrders: {
            $sum: {
              $cond: [
                { $eq: ["$_id.status", orderStatus.AWAITING_PAYMENT] },
                "$count",
                0,
              ],
            },
          },
          paidOrders: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$_id.status",
                    [
                      orderStatus.PAID,
                      orderStatus.SHIPPED,
                      orderStatus.DELIVERED,
                    ],
                  ],
                },
                "$count",
                0,
              ],
            },
          },
        },
      },
      // Sort by yearMonth (ascending, so we get January to December)
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format the result into "Month Year" format and combine with the initial summary
    const summary = generateInitialMonthSummary();

    result.forEach(({ _id, pendingOrders, paidOrders }) => {
      const [year, month] = _id.split("-"); // Split year and month
      const formattedMonthYear = formatMonthYear(year, month);

      // Find the month in the summary and update the counts
      const monthIndex = monthNames.indexOf(formattedMonthYear.split(" ")[0]);
      if (monthIndex !== -1) {
        summary[monthIndex] = {
          month: formattedMonthYear,
          pendingOrders,
          paidOrders,
        };
      }
    });

    return summary;
  } catch (error) {
    console.error("Error fetching monthly order summary:", error);
    throw new Error("Failed to fetch monthly order summary");
  }
};

// Controller to handle the request and send the response
export const getPendingVsPaidSummary = async (req, res) => {
  try {
    const monthlySummary = await getMonthlyOrderSummary();
    return res.status(200).json({
      message: "Monthly order summary fetched successfully",
      data: monthlySummary,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching the monthly order summary",
      error: error.message,
    });
  }
};
