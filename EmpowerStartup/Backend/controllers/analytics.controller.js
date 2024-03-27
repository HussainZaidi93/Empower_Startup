const { Startup, User,Sales, Donate } = require("../models/db.schemas");
exports.getSummaryDashboard = async (req, res) => {
  try {
    // Fetch counts from different collections
    const startupCount = await Startup.countDocuments();
    const donatorCount = await Donate.countDocuments();
    const auditorCount = await User.countDocuments({ role: "Auditor" });
    const supplierCount = await User.countDocuments({ role: "Supplier" });

    // Format the data into the desired structure
    const summary = [
      { title: "Startups", value: startupCount },
      { title: "Auditors", value: auditorCount },
      { title: "Suppliers", value: supplierCount },
      { title: "Donors", value: donatorCount },
    ];

    // Sending the summary as a response
    res.status(200).json({ summary });
  } catch (error) {
    // Handle error
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllStartupSalesReport = async (req, res) => {
  try {
    // Aggregate sales data to group by startup and calculate total sales
    const salesSummary = await Sales.aggregate([
      {
        $group: {
          _id: "$startup",
          totalSales: { $sum: "$sales" }
        }
      }
    ]);

    return res.status(200).json({ salesSummary });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Call the summary function wherever needed, and await its result if necessary
