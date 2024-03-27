const { AuditStartup, Audit } = require("../models/db.schemas");
const { Startup } = require("../models/db.schemas");

exports.assignStartupAudit = async (req, res) => {
  try {
    const { auditorId, startups, status } = req.body; // Extract data from request body

    // Create a single document to insert into the AuditStartup collection
    const auditDocument = {
      auditorId,
      startups,
      status,
    };

    // Insert the audit document into the AuditStartup collection
    const createdAudit = await AuditStartup.create(auditDocument);

    res.status(201).json({ success: true, data: createdAudit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getAllAuditorStartups = async (req, res) => {
  try {
    const { auditorId, pageSize, pageNumber, searchString } = req.body;
    const skip = pageNumber * pageSize;

    const audits = await AuditStartup.find({ auditorId: auditorId })
      .skip(skip)
      .limit(pageSize)
      .lean();

    if (audits.length === 0) {
      return res.status(404).json({ message: "No audits found" });
    }

    let totalStartupsCount = 0;
    let startupsInfo = [];
    for (let i = 0; i < audits.length; i++) {
      const audit = audits[i];
      totalStartupsCount += audit.startups.length;
      for (let j = 0; j < audit.startups.length; j++) {
        const startup = audit.startups[j];
        const startupInfo = await Startup.findById(
          startup.startupTypeId
        ).lean();
        // if (startupInfo) {
        // Add startup information to the respective object
        startupsInfo.push({
          _id: startup._id,
          startupTypeId: startup.startupTypeId,
          date: startup.date,
          startupInfo: startupInfo, // Include startup information
        });
        // }
      }
    }

    res
      .status(200)
      .json({ startups: startupsInfo, totalCount: totalStartupsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.placeAudit = async (req, res) => {
  const {
    userId,
    auditDate,
    revenue,
    sale,
    salasDataReport,
    actualSalesReport,
    issue,
  } = req.body;

  try {
  const newAudit={
      userId,
      auditDate,
      revenue,
      sale,
      salasDataReport,
      actualSalesReport,
      issue,
    }

    const aduit = await Audit.create(newAudit);
    return res.json(aduit);
  } catch (error) {
    console.error("Error updating audit startup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllAuditsByAuditorId = async (req, res) => {
  try {
      const { auditorId } = req.body;

      // Check if auditorId is provided
      if (!auditorId) {
          return res.status(400).json({ success: false, message: 'Auditor ID is required' });
      }

      // Fetch all audits for the specified auditorId
      const audits = await AuditStartup.find({ auditorId }) .populate({
        path: 'auditorId',
        select: 'firstName lastName'
    });

      // Return the audits
      res.status(200).json({ success: true, audits });
  } catch (error) {
      console.error("Error fetching audits by auditor ID:", error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};