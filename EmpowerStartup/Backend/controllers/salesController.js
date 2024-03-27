const { Sales, Startup } = require("../models/db.schemas");
const mongoose = require("mongoose");

exports.addSale = async (req, res) => {
  try {
    const { sale, date, userId } = req.body;

    const startup = await Startup.findOne({userId});
    console.log(startup);
    const newSale = new Sales({
      startup: startup.startupType,
      startupId: new mongoose.Types.ObjectId(startup._id),
      sales: sale,
      userId: new mongoose.Types.ObjectId(userId),
      Date: date || "", // Use the provided date or the current date if not provided
    });

    // Save the sale to the database
    const savedSale = await newSale.save();
    return res
      .status(201)
      .json({ message: "Sale added successfully", sale: savedSale });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getSalesStats = async (req, res) => {
  try {
    const { interval } = req.body;

    let aggregateOptions = [];

    if (interval === 'Weekly') {
      aggregateOptions = [
        {
          $match: {
            Date: { $gte: formatDate(getDateAgo(7)) } // Filter last 7 days
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$Date" } } },
            totalSales: { $sum: '$sales' }
          }
        },
        { $sort: { '_id': 1 } } // Sort by date ascending
      ];
    } else if (interval === 'Monthly') {
      aggregateOptions = [
        {
          $match: {
            Date: { $gte: formatDate(getDateAgo(30)) } // Filter last 30 days
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$Date" } } },
            totalSales: { $sum: '$sales' }
          }
        },
        { $sort: { '_id': 1 } } // Sort by month ascending
      ];
    } else if (interval === 'Annually') {
      aggregateOptions = [
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: { $toDate: "$Date" } } },
            totalSales: { $sum: '$sales' }
          }
        },
        { $sort: { '_id': 1 } } // Sort by month ascending
      ];
    } else {
      return res.status(400).json({ error: 'Invalid interval. Supported types are weekly, monthly, and annually.' });
    }

    const salesStats = await Sales.aggregate(aggregateOptions);

    res.status(200).json({ success: true, data: salesStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get date 'n' days ago
function getDateAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

// Function to format date as string in "YYYY-MM-DD" format
function formatDate(date) {
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return year + '-' + month + '-' + day;
}

// exports.getSalesPerStartup=async(req,res)=>{
//   try {
//     const sales = await Sales.aggregate([
//       {
//         $group: {
//           _id: { startup: "$startup", date: { $dateToString: { format: "%Y-%m", date: { $toDate: "$Date" } } } },
//           totalSales: { $sum: "$sales" }
//         }
//       },
//       {
//         $sort: {
//           "_id.startup": 1,
//           "_id.date": 1
//         }
//       }
//     ]);
//     res.json(sales);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// exports.getSalesPerStartup = async (req, res) => {
//   try {
//     const sales = await Sales.aggregate([
//       {
//         $lookup: {
//           from: "startups",
//           localField: "startupId",
//           foreignField: "_id",
//           as: "startupInfo"
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userInfo"
//         }
//       },
//       {
//         $group: {
//           _id: {
//             startupId: "$startupInfo._id",
//             userId: "$userInfo._id",
//             date: { $dateToString: { format: "%Y-%m", date: { $toDate: "$Date" } } }
//           },
//           startupInfo: { $first: "$startupInfo" },
//           userInfo: { $first: "$userInfo" },
//           totalSales: { $sum: "$sales" }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           startupInfo: 1,
//           userInfo: 1,
//           date: "$_id.date",
//           totalSales: 1
//         }
//       },
//       {
//         $group: {
//           _id: {
//             startupId: "$startupInfo._id",
//             userId: "$userInfo._id"
//           },
//           startupInfo: { $first: "$startupInfo" },
//           userInfo: { $first: "$userInfo" },
//           reports: { $push: { _id: "$date", totalSales: "$totalSales" } }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           startupInfo: 1,
//           userInfo: 1,
//           reports: 1
//         }
//       },
//       {
//         $sort: {
//           "startupInfo._id": 1
//         }
//       }
//     ]);

//     res.json(sales);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

exports.getSalesPerStartup = async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $lookup: {
          from: "startups",
          localField: "startupId",
          foreignField: "_id",
          as: "startupInfo"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $group: {
          _id: {
            startupId: "$startupInfo._id",
            userId: "$userInfo._id",
            date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$Date" } } } // Grouping by date
          },
          startupInfo: { $first: "$startupInfo" },
          userInfo: { $first: "$userInfo" },
          totalSales: { $sum: "$sales" }
        }
      },
      {
        $project: {
          _id: 0,
          startupInfo: 1,
          userInfo: 1,
          date: "$_id.date",
          totalSales: 1
        }
      },
      {
        $group: {
          _id: {
            startupId: "$startupInfo._id",
            userId: "$userInfo._id"
          },
          startupInfo: { $first: "$startupInfo" },
          userInfo: { $first: "$userInfo" },
          reports: { $push: { _id: "$date", totalSales: "$totalSales" } } // Pushing date-wise sales data
        }
      },
      {
        $project: {
          _id: 0,
          startupInfo: 1,
          userInfo: 1,
          reports: 1
        }
      },
      {
        $sort: {
          "startupInfo._id": 1
        }
      }
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
