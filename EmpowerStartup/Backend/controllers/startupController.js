const { Startup, Sales } = require("../models/db.schemas");
const mongoose = require("mongoose");
const { sendApplicationEmail } = require("../utils/sendEmail");
exports.createStartup = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      country,
      city,
      address,
      gender,
      startupTypeId,
      startupType,
      dob,
      shortDescription,
      detailedDescription,
      experience,
      cnicFront,
      cnicBack,
      elctircityBill,
      utilityBill,
      recentImage,
      userId,
    } = req.body;

    // Create a new instance of the Startup model
    const newStartup = new Startup({
      firstName,
      middleName,
      lastName,
      country,
      city,
      dob,
      address,
      gender,
      startupType,
      startupTypeId: new mongoose.Types.ObjectId(startupTypeId),
      shortDescription,
      detailedDescription,
      experience,
      cnicFront,
      cnicBack,
      elctircityBill,
      utilityBill,
      recentImage,
      status: false,
      isInspected: false,
      userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
    });

    // Save the startup to the database
    const savedStartup = await newStartup.save();
    // Send email notification to admin
    await sendApplicationEmail(
      `${firstName} ${lastName}`
    );

    return res.status(201).json({
      message: "Startup added successfully",
      startup: savedStartup,
      emailSent: true,
    });
    // if (sendEmailStatus) {
    //   return res.status(201).json({
    //     message: "Startup added successfully",
    //     startup: savedStartup,
    //     emailSent: true,
    //   });
    // } else {
    //   return res.status(500).json({
    //     error: "Error sending email notification",
    //     startup: savedStartup,
    //     emailSent: false,
    //   });
    // }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllStartupsWithoutPagination = async (req, res) => {
  try {
    const { role, status } = req.body;
    console.log(role);
    if (role !== "Admin") {
      return res.status(403).json({
        error: "Access denied. Only Admin can access this resource.",
      });
    }

    const startupsByStatus = await Startup.find({ status: status });
    return res.status(200).json({ startups: startupsByStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllStartupsWithPagination = async (req, res) => {
  try {
    const { role, pageSize, pageNumber, searchString,isInspected } = req.body;

    // if (role !== "Admin") {
    //   return res.status(403).json({
    //     error: "Access denied. Only Admins can access this resource.",
    //   });
    // }

    const skip = pageNumber * pageSize;
    const query = {};

    if (role === 'Inspector') {
      query.isInspected=isInspected
    }

    if (searchString !== "") {
      query = {
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
    }
    const startups = await Startup.find(query)
      .skip(skip)
      .limit(parseInt(pageSize));

    const totalCount = await Startup.countDocuments(query);

    return res.status(200).json({
      startups,
      totalCount,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStartupByType = async (req, res) => {
  try {
    const { startupType } = req.body;

    if (!startupType) {
      return res.status(400).json({ error: "Missing startupType parameter." });
    }

    const startup = await Startup.findOne({ startupType });

    return res.status(200).json({ startup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStartupByUserId = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    // Find the startup with the given user ID
    const startup = await Startup.findOne({ userId: userIdObj });

    if (startup) {
      // If startup found, return it with status code 201
      return res.status(201).json(startup);
    } else {
      // If no startup found for the user, return with status code 409
      return res
        .status(409)
        .json({ message: "No startup found for this user" });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving startup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.approveStartup = async (req, res) => {
  try {
    const { startupId } = req.body;

    // Find the startup by ID and update its status to true
    const updatedStartup = await Startup.findByIdAndUpdate(
      startupId,
      { status: true },
      { new: true }
    );

    if (updatedStartup) {
      // If startup updated successfully, return it with status code 200
      return res.status(200).json(updatedStartup);
    } else {
      // If no startup found for the given ID, return with status code 404
      return res.status(404).json({ message: "Startup not found" });
    }
  } catch (error) {
    console.error("Error updating startup status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Function to add suggestion by admin
exports.makeAdminSuggestion = async (req, res) => {
  try {
    const { startupId, suggestion } = req.body; // Assuming you receive startupId and suggestion in the request body

    // Check if startupId is provided
    if (!startupId) {
      return res
        .status(400)
        .json({ success: false, message: "Startup ID is required." });
    }

    // Find the startup by ID
    const startup = await Startup.findById(startupId);

    // Check if startup exists
    if (!startup) {
      return res
        .status(404)
        .json({ success: false, message: "Startup not found." });
    }

    // Update the suggestion by admin
    startup.suggestionByAdmin = suggestion;
    await startup.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Suggestion added by admin successfully.",
        startup,
      });
  } catch (error) {
    console.error("Error adding suggestion by admin:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Function to add suggestion by inspection team
exports.makeInspectionSuggestion = async (req, res) => {
  try {
    const { startupId, suggestion } = req.body; // Assuming you receive startupId and suggestion in the request body

    // Check if startupId is provided
    if (!startupId) {
      return res
        .status(400)
        .json({ success: false, message: "Startup ID is required." });
    }

    // Find the startup by ID
    const startup = await Startup.findById(startupId);

    // Check if startup exists
    if (!startup) {
      return res
        .status(404)
        .json({ success: false, message: "Startup not found." });
    }

    // Update the suggestion by inspection team
    startup.suggestionByInspection = suggestion;
    startup.isInspected = true;
    await startup.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Suggestion added by inspection team successfully.",
        startup,
      });
  } catch (error) {
    console.error("Error adding suggestion by inspection team:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.addPhasesToStartup = async (req, res) => {
  try {
    const { startupId, phases } = req.body; // Assuming you receive startupId and phases array in the request body

    // Check if startupId and phases array are provided
    if (
      !startupId ||
      !phases ||
      !Array.isArray(phases) ||
      phases.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data." });
    }

    // Find the startup by ID
    const startup = await Startup.findById(startupId);

    // Check if startup exists
    if (!startup) {
      return res
        .status(404)
        .json({ success: false, message: "Startup not found." });
    }

    // Add phases to the startup document
    startup.phases = phases;

    // Save the updated startup document
    await startup.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Phases added to startup successfully.",
        startup,
      });
  } catch (error) {
    console.error("Error adding phases to startup:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
exports.deleteStartup = async (req, res) => {
  try {
    const { id } = req.body; // Assuming the startup ID is passed as a parameter

    // Check if the startup exists
    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ error: "Startup not found" });
    }

    // Delete sales associated with the startup
    await Sales.deleteMany({ startupId: id });

    // Delete the startup from the database
    await Startup.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Startup and associated sales deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
