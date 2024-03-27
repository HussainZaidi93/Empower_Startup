module.exports = (app) => {
    const auditStartupController = require("../controllers/auditStartupController");
    var router = require("express").Router();
    router.post("/assignStartupAudit", auditStartupController.assignStartupAudit);
    router.post("/getAllAuditorStartups", auditStartupController.getAllAuditorStartups);
    router.post("/placeAudit", auditStartupController.placeAudit);
    router.post("/getAllAuditsByAuditorId", auditStartupController.getAllAuditsByAuditorId);
  
    app.use("/api/auditStartup", router);
  };
  