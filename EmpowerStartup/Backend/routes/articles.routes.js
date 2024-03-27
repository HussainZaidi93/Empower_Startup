module.exports = (app) => {
  const articleController = require("../controllers/articleController");
  var router = require("express").Router();
  router.post("/addArticle", articleController.addArticle);
  router.post("/getAllArcticles", articleController.getAllArcticles);


  app.use("/api/articles", router);
};
