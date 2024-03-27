module.exports = (app) => {
  const startupTypeController = require("../controllers/startupTypeController");

  var router = require("express").Router();
  router.post("/addStartupType", startupTypeController.addStartupType);
  router.post("/getAllStartupTypes", startupTypeController.getAllStartupTypes);
  router.post("/deleteStartupType", startupTypeController.deleteStartupType);
  router.post("/getStartupTypeById", startupTypeController.getStartupTypeById);
  app.use("/api/startupType", router);
};
