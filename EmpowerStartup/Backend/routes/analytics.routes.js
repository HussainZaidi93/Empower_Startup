module.exports = (app) => {
    const analyticsController = require("../controllers/analytics.controller");
    var router = require("express").Router();
    router.post("/getSummaryDashboard", analyticsController.getSummaryDashboard);
    router.post("/getAllStartupSalesReport", analyticsController.getAllStartupSalesReport);
  
    app.use("/api/analytics", router);
  };
  