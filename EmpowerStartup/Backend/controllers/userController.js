// const bycrypt = require("bcryptjs");
const {
  User,
  Products,
  Startup,
  Startuptype,
  Sales,
} = require("../models/db.schemas");
const { generateOTP } = require("../utils/generateAuthToken");
const { sendEmail } = require("../utils/sendEmail");
const { sendJoinUsEmail } = require("../utils/sendEmail");
const path = require("path");
const { sendResetPasswordLink } = require('../utils/sendEmail');
const mongoose = require("mongoose");
const crypto = require('crypto');

// Function to generate a unique reset token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};


exports.uploadImage = async (req, res, next) => {
  try {
    // Handle the uploaded file here
    // You may want to save it to a storage service (e.g., AWS S3, Google Cloud Storage)
    // For simplicity, we're just returning the original file name here
    const originalname = req.file.originalname;
    const filename = req.file.filename;

    // You can generate a unique image name or use some hash, timestamp, etc.
    // For simplicity, we're using the original file name here
    const imageName = originalname;

    res.json({ imageName, serverFileName: filename });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      cnic,
      role,
      location,
      profileImage,
      startTypeId,
      isAdminApproved,
      isVarified
    } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate authToken
    const authToken = generateOTP();
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      phone,
      cnic,
      location,
      role: role,
      profileImage,
      isAdminApproved: isAdminApproved, 
      isVarified: isVarified, 
      authToken, // Save authToken
    };
    if (role === "Supplier") {
      newUser.startTypeId = new mongoose.Types.ObjectId(startTypeId);
    }
    user = new User(newUser);


    await user.save();
    await sendEmail(newUser.email,authToken, newUser)
    res
      .status(200)
      .json({ message: "User registered successfully", user: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { authToken } = req.body;

    // Check if user already exists
    let user = await User.findOne({ authToken });

    if (user.isVarified) {
      return res.status(400).send({
        message: "You are already verified",
      });
    }
    if (user && user.role === 'User') {
      // User found, update isVarified to true and clear authToken
      user.isVarified = true;
      user.isAdminApproved = true;
      await user.save();
      return res.status(200).json({ message: "User verified successfully." });
    } else {
      // No user found with the provided authToken
      return res
        .status(404)
        .json({ error: "No user found with the provided authToken." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the provided userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has a profile image
    let imageURL = "";
    if (user.profileImage) {
      imageURL = `/uploads/${user.profileImage}`;
    }

    let startup = null;
    let currentPhase = null;

    if (user.role === 'User') {
      startup = await Startup.findOne({ userId: user._id });

      if (startup) {
        // Calculate current phase based on sales
        const totalSales = await Sales.aggregate([
          {
            $match: { startupId: startup._id }
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$sales" }
            }
          }
        ]);

        if (totalSales.length > 0) {
          const salesAmount = totalSales[0].totalSales;

          for (const phase of startup.phases) {
            if (salesAmount >= phase.targetSale) {
              currentPhase = phase;
            } else {
              break; // Break loop when current phase is determined
            }
          }
        }
      }
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.firstName + " " + user.lastName,
      email: user.email,
      role: user.role,
      profileImage: imageURL,
      startupType: startup ? startup.startupType : "",
      currentPhase: currentPhase
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// exports.getUserById = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     // Check if the provided userId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // Check if the user has a profile image
//     let imageURL = "";
//     if (user.profileImage) {
//       imageURL = `/uploads/${user.profileImage}`;
//     }
//     let startup=null
//     if(user.role==='Supplier'){
//       startup = await Startuptype.find(user.startTypeId);
//     }

//     res.status(200).json({
//       _id: user._id,
//       fullName: user.firstName + " " + user.lastName,
//       email: user.email,
//       role: user.role,
//       profileImage: imageURL,
//       startupType: startup ? startup[0].startupName : "",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Check if user is verified
    if (!user.isVarified) {
      return res.status(401).json({
        message: "Please verify your email address",
      });
    }

    if (!user.isAdminApproved) {
      return res.status(403).json({
        message: "Your account is not approved by admin",
      });
    }

    // Prepare the response data
    const responseData = {
      id: user.id,
      fullName: user.firstName + " " + user.lastName,
      email: user.email,
      role: user.role,
      status: user.isVarified,
      approved: user.isAdminApproved,
      message: "Login successfully",
    };

    // Check if the user has a profile image
    if (user.profileImage) {
      // Construct the absolute URL for the profile image
      // responseData.profileImage = path.join(
      //   __dirname,
      //   "../../uploads",
      //   user.profileImage
      // );
      responseData.profileImage = `/uploads/${user.profileImage}`;
    }

    // Send the response
    res.send({ responseData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getRoleBasedUser = async (req, res) => {
  try {
    const { role, pageSize, pageNumber, searchString } = req.body;

    const skip = pageNumber * pageSize;

    const query = {
      role: role,
      $or: [
        { firstName: { $regex: searchString, $options: "i" } },
        { lastName: { $regex: searchString, $options: "i" } },
        { middleName: { $regex: searchString, $options: "i" } },
        { country: { $regex: searchString, $options: "i" } },
        { city: { $regex: searchString, $options: "i" } },
        { address: { $regex: searchString, $options: "i" } },
        { gender: { $regex: searchString, $options: "i" } },
        { shortDescription: { $regex: searchString, $options: "i" } },
        { detailedDescription: { $regex: searchString, $options: "i" } },
        { expreince: { $regex: searchString, $options: "i" } },
        { status: { $regex: searchString, $options: "i" } },
      ],
    };

    const users = await User.find(query).skip(skip).limit(parseInt(pageSize));

    const totalCount = await User.countDocuments(query);

    return res.status(200).json({
      users,
      totalCount,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      phone,
      cnic,
      role,
      location,
      profileImage,
    } = req.body;

    // Find the user by id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user details
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.cnic = cnic;
    user.role = role;
    user.location = location;
    user.profileImage = profileImage;
    user.password = password;

    if (role === "Supplier") {
      user.startTypeId = user.startTypeId;
    }

    // Save the updated user
    await user.save();

    res.json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function getSuppliersByStartupType(userId) {
  try {
    // const { userId } = req.body;
    // Check if the provided userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId).populate("Startup");

    if (!user) {
      return "User not found";
    }
    // const user = await User.findById(userId).populate('Startup');
    const startupType = user.startup.startupType;

    // Find products related to the startup type
    const products = await Products.find({ category: startupType }).populate(
      "supplierId"
    );

    // Group products by supplier
    const suppliers = {};
    products.forEach((product) => {
      const supplierId = product.supplierId._id;
      if (!suppliers[supplierId]) {
        suppliers[supplierId] = {
          supplierName:
            product.supplierId.firstName + " " + product.supplierId.lastName,
          products: [],
        };
      }
      suppliers[supplierId].products.push({
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
      });
    });

    return Object.values(suppliers); // Convert object to array of suppliers
  } catch (error) {
    console.error("Error getting suppliers:", error);
    throw error;
  }
}

exports.listSuppliersForUser = async (req, res) => {
  const { userId } = req.body;

  try {
    // const suppliers = await getSuppliersByStartupType(userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return "User not found";
    }
    // find Start up type

    const startup = await Startup.findOne({ userId: user._id });
    // find Startup type from stratup
    const type = await Startuptype.findOne({
      startupName: startup.startupType,
    });
    const startupSuppliers = await User.find({
      role: "Supplier",
      startTypeId: type._id,
    });

    res.json(startupSuppliers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changeUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Update user status
    user.isAdminApproved = status;
    await user.save();

    return res.status(200).json({
      message: "User status changed",
      status: user.isAdminApproved, // Return the updated status
    });
  } catch (error) {
    console.error("Error changing user status :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { email, context, subject, text } = req.body;

    const emailSent = await sendJoinUsEmail(email,context, subject, text);
    // if (!emailSent) {
    //   return res.status(400).json({
    //     message: "Email can not be sent",
    //   });
    // }
    return res.status(200).json({
      message: "Email processed ",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error ",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify user's credentials
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or old password" });
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//function to reset the password 
exports.resetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: "Missing email field" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique reset token
    const resetToken = generateResetToken();

    // Save the reset token and its expiry date to the user document
    user.authToken = resetToken;

    await user.save();

    // Send the reset password link to the user's email
    const resetLink = `http://localhost:3000/resetPassword/${resetToken}`;

    const emailSent = await sendResetPasswordLink(user.email, resetLink);

    if (emailSent) {
      return res.status(200).json({ message: "Reset password link sent successfully" });
    } else {
      return res.status(500).json({ error: "Error sending reset password link" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
