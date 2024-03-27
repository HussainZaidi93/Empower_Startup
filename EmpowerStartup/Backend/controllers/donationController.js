const { Donate } = require("../models/db.schemas");

exports.createDonator = async (req, res) => {
  try {
    const {
      name,
      email,
      country,
      city,
      address,
      paymentType,
      creditCardNumber,
      expirationDate,
      securityCode,
      donationAmount,
    } = req.body;

    const donation = new Donate({
      name,
      email,
      country,
      city,
      address,
      paymentType,
      creditCardNumber,
      expirationDate,
      securityCode,
      donationAmount,
    });

    await donation.save();

    res.status(201).json({
      message: "Donation created successfully",
      donation: {
        _id: donation._id,
        name: donation.name,
        email: donation.email,
        country: donation.country,
        city: donation.city,
        address: donation.address,
        paymentType: donation.paymentType,
        creditCardNumber: donation.creditCardNumber,
        expirationDate: donation.expirationDate,
        securityCode: donation.securityCode,
        donationAmount: donation.donationAmount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllDonations = async(req, res) =>{
  try {
    const { pageSize, pageNumber , searchString} = req.body;
    const limit = parseInt(pageSize) || 10;
    const skip = parseInt(pageNumber) ? (parseInt(pageNumber) - 1) * limit : 0;

    const donations = await Donate.find()
      .skip(skip)
      .limit(limit);

    const totalCount = await Donate.countDocuments();

    res.json({
      donations,
      totalCount,
      pageSize: limit,
      pageNumber: parseInt(pageNumber) || 1,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}