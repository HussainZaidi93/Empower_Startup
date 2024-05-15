module.exports = (app) => {
    const orderController = require("../controllers/orderController");
  
    var router = require("express").Router();
    router.post("/createOrder", orderController.createOrder);
    router.get("/getAllOrdersWithStatus", orderController.getAllOrdersWithStatus);
    router.post("/getOrdersBySupplierId", orderController.getOrdersBySupplierId);
    router.post("/changeStatus", orderController.changeStatus);
    router.post("/getAllOrderBySupplierWithPagination", orderController.getAllOrderBySupplierWithPagination);
    router.post("/getAllOrderByUserWithPagination", orderController.getAllOrderByUserWithPagination);
    router.post("/getConfirmedOrdersByUserId", orderController.getConfirmedOrdersByUserId);
    router.post("/confirmOrder", orderController.confirmOrder);
    router.post("/updateProductSale", orderController.updateProductSale);
    router.post("/getConfirmedOrdersByUserIdForAudit", orderController.getConfirmedOrdersByUserIdForAudit);
    router.post("/addSales", orderController.addSales);
    router.post("/getAllOrdersWithPagination", orderController.getAllOrdersWithPagination);

    app.use("/api/orders",router);
  };
  
