module.exports=(app)=>{
    const startupSalesAudit = require("../controllers/startupAudit.controller");
    var router = require("express").Router();

    // Create a new Startup Sales Audit
    router.post("/addStartUpSalesAudit", startupSalesAudit.addStartUpSalesAudit);
    router.post("/getAllStartUpSalesAuditsWithPagination", startupSalesAudit.getAllStartUpSalesAuditsWithPagination);
    router.post("/getAllPlacedAuditsByAuditorId", startupSalesAudit.getAllPlacedAuditsByAuditorId);

    app.use("/api/startupSalesAudit", router);
}
