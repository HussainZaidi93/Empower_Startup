module.exports = (app) => {
  const userController = require("../controllers/userController");
  var router = require("express").Router();
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Specify your upload folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname +
          "-" +
          uniqueSuffix +
          "." +
          file.originalname.split(".").pop()
      );
    },
  });
  const upload = multer({ storage: storage });
  router.post(
    "/uploadImage",
    upload.single("image"),
    userController.uploadImage
  );
  router.post("/register", userController.register);
  router.post("/login", userController.login);
  router.post("/verifyUser", userController.verifyUser);
  router.post("/resetPasswordLink", userController.resetPasswordLink);
  router.post("/getUserById", userController.getUserById);
  router.post("/deleteUser", userController.deleteUser);
  router.post("/updateUser", userController.updateUser);
  router.post("/listSuppliersForUser", userController.listSuppliersForUser);
  router.post("/changeUserStatus", userController.changeUserStatus);
  router.post("/sendMessage", userController.sendMessage);
  router.post("/resetPassword", userController.resetPassword);

  
  router.post("/getRoleBasedUser", userController.getRoleBasedUser);
  app.use("/api/users", router);
};
