const {Startuptype} = require('../models/db.schemas'); // Import the Startuptype model

// Create a new startup type
exports.addStartupType = async (req, res) => {
    try {
        const { startupName, startupLogo } = req.body;
    
        // Check if the startup name already exists
        const existingStartup = await Startuptype.findOne({ startupName });
        if (existingStartup) {
          return res.status(400).json({ success: false, error: 'Startup already exists' });
        }
    
        // If the startup name doesn't exist, create a new startup type
        const newStartupType = new Startuptype({ startupName, startupLogo });
        await newStartupType.save();
        res.status(201).json({ success: true, data: newStartupType });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
};

// Get all startup types
exports.getAllStartupTypes = async (req, res) => {
  try {
    const startupTypes = await Startuptype.find();
    res.status(200).json({ success: true, data: startupTypes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single startup type by ID
exports.getStartupTypeById = async (req, res) => {
  try {
    const startupType = await Startuptype.findById(req.params.id);
    if (!startupType) {
      return res.status(404).json({ success: false, error: 'Startup type not found' });
    }
    res.status(200).json({ success: true, data: startupType });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a startup type by ID
exports.updateStartupType = async (req, res) => {
  try {
    const { startupName, startupLogo } = req.body;
    const updatedStartupType = await Startuptype.findByIdAndUpdate(req.params.id, { startupName, startupLogo }, { new: true });
    if (!updatedStartupType) {
      return res.status(404).json({ success: false, error: 'Startup type not found' });
    }
    res.status(200).json({ success: true, data: updatedStartupType });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a startup type by ID
exports.deleteStartupType = async (req, res) => {
  try {
    const deletedStartupType = await Startuptype.findByIdAndDelete(req.body.id);
    if (!deletedStartupType) {
      return res.status(404).json({ success: false, error: 'Startup type not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
