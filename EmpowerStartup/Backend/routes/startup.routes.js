module.exports = (app) => {
    const startupController = require("../controllers/startupController");
  
    var router = require("express").Router();
    router.post("/createStartup", startupController.createStartup);
    router.post("/getAllStartupsWithoutPagination", startupController.getAllStartupsWithoutPagination);
    router.post("/getAllStartupsWithPagination", startupController.getAllStartupsWithPagination);
    router.post("/getStartupByType", startupController.getStartupByType);
    router.post("/getStartupByUserId", startupController.getStartupByUserId);
    router.post("/approveStartup", startupController.approveStartup);
    router.post("/makeAdminSuggestion", startupController.makeAdminSuggestion);
    router.post("/makeInspectionSuggestion", startupController.makeInspectionSuggestion);
    router.post("/addPhasesToStartup", startupController.addPhasesToStartup);
    router.post("/deleteStartup", startupController.deleteStartup);


    app.use("/api/startups", router);
  };
  