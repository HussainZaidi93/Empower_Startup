module.exports = (app) => {
    const salesController = require("../controllers/salesController");
  
    var router = require("express").Router();
    router.post("/addSale", salesController.addSale);
    router.post("/getSalesReport", salesController.getSalesStats);
    router.get("/getSalesPerStartup", salesController.getSalesPerStartup);

    
  
    app.use("/api/sales",router);
  };
  