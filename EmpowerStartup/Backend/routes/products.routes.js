module.exports = (app) => {
  const productController = require("../controllers/productController");

  var router = require("express").Router();
  router.post("/addProduct", productController.addProduct);
  router.post("/getAllProducts", productController.getAllProducts);
  router.post("/deleteProduct", productController.deleteProduct);
  router.post("/updateProduct", productController.updateProduct);
  router.post("/getProductBySupplierId", productController.getProductBySupplierId);
  router.post("/getAllProductsIrrespectiveOfAnyId", productController.getAllProductsIrrespectiveOfAnyId);
  router.post("/getAllProductsBySupplierWithPagination", productController.getAllProductsBySupplierWithPagination);
  router.post("/deleteProductById", productController.deleteProductById);



  app.use("/api/products", router);
};
