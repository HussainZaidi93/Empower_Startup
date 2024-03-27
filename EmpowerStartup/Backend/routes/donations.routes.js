module.exports = (app) => {
    const donationContoller = require("../controllers/donationController");
    var router = require("express").Router();
    router.post("/createDonator", donationContoller.createDonator)
    router.post("/getAllDonations", donationContoller.getAllDonations)

  
  
    app.use("/api/donations", router);
  };