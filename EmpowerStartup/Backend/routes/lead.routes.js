module.exports = (app) => {
    const leadController = require("../controllers/leadController");
  
    var router = require("express").Router();
    router.post("/createLead", leadController.createLead);
    router.get("/findLead", leadController.findLead);
  
    app.use("/api/leads",router);
  };
  