const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  cnic: { type: String, required: true },
  location: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Supplier", "User", "Auditor", "Inspector"],
    required: true,
  },
  isVarified: { type: Boolean, default: false },
  isAdminApproved: { type: Boolean, default: false }, // For users that need admin approval
  authToken: { type: String, required: true },
  profileImage: { type: String },
  startTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "startuptype" },
});

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

// Startup Schema
const startupSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  startupType: { type: String, required: false },
  shortDescription: { type: String },
  detailedDescription: { type: String },
  suggestionByAdmin: { type: String },
  suggestionByInspection: { type: String },
  isInspected: { type: Boolean, default: false },
  dob: { type: Date, default: "" },
  expreince: { type: String },
  cnicFront: { type: String },
  isCNICFrontVerified: { type: Boolean, default: false },
  cnicBack: { type: String },
  isCNICBackVerified: { type: Boolean, default: false },
  elctircityBill: { type: String },
  isElctircityBillVerified: { type: Boolean, default: false },
  utilityBill: { type: String },
  isUtilityBillVerified: { type: Boolean, default: false },
  recentImage: { type: String },
  isRecentImageVerified: { type: Boolean, default: false },
  status: { type: Boolean, required: true, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  auditorId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  inspectorId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  startTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "startuptype" },
  phases: [{
    phaseNumber: { type: Number, required: true },
    deadline: { type: Date, required: true },
    targetSale: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
  }]
});

// Audit Schema
const auditSchema = new mongoose.Schema({
  Date: { type: Date, default: Date.now },
  result: { type: String },
  revenue: { type: Number },
  sales: { type: String },
  salasDataReport: { type: String },
  actualSalesReport: { type: String },
  issue: { type: String },
  status: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

// Articles Schema
const startupArticle = new mongoose.Schema({
  Date: { type: Date, default: Date.now },
  startupName: { type: String },
  articleImage: { type: String },
  articleContent: { type: String },
});

// Startup Type Schema
const startupTypeSchema = new mongoose.Schema({
  startupName: { type: String },
  startupLogo: { type: String },
});

const productSchema = new mongoose.Schema({
  productName: { type: String },
  variants: [
    {
      size: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      image: { type: String },
    },
  ],
  // images: [{ type: String }],
  category: { type: String },
  subCategory: { type: String },
  productType: { type: String },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  startupTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "startuptype" },
});
// Order Schema
const orderSchema = new mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      variants: [
        {
          orderedQuantity: { type: Number, required: true },
          variantPrice: { type: Number, required: true },
          quantity: { type: Number, required: true },
          size: { type: String },
          price: { type: Number, required: true },
          image: { type: String },
          sale: { type: Number },
          profit: { type: Number },
          quantitySold: { type: Number }
          // totalPrice: { type: Number, required: true },
        },
      ],
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  accountNumber: { type: String, default: "" },
  accountTitle: { type: String, default: "" },
  recieptImage: { type: String, default: "" },
  address: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Processed"],
    default: "Pending",
  },
  orderDate: { type: Date, default: Date.now },
  totalPayment: { type: Number, required: true },
});

// startupSales schema
const salesSchema = new mongoose.Schema({
  Date: { type: String, default: "" },
  sales: { type: Number },
  startup: { type: String, default: "" },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "startup" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order' }
});
//Auditor startup schema
const auditStartupSchema = new mongoose.Schema({
  auditorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  startups: [
    {
      startupTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "startup",
      },
      date: {
        type: String,
        default: "",
      },
    },
  ],
  auditDate: {
    type: String,
    default: "",
  },
  result: { type: String },
  revenue: { type: Number },
  status: {
    type: String,
    required: true,
  },
});
// Inspect Schema
const inspectStartupSchema = new mongoose.Schema({
  inspectorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  startups: [
    {
      startupTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "startup",
      },
      date: {
        type: String,
        default: "",
      },
    },
  ],
  inspectionDate: {
    type: String,
    default: "",
  },
  result: { type: String },
  status: {
    type: String,
    required: true,
  },
});

//donation schema

const donateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  paymentType: { type: String, required: true },
  creditCardNumber: { type: Number, required: true },
  expirationDate: { type: String, required: true },
  securityCode: { type: String, required: true },
  donationAmount: { type: Number, required: true },
});
const startupSalesAuditSchema = new mongoose.Schema({
  products: [
    {
      variants: [
        {
          orderedQuantity: { type: Number, required: true },
          size: { type: String },
          quantitySold: { type: Number },
          quantityLeft: { type: Number },
          quantityDifference: { type: Number },
        },
      ],
    },
  ],
  auditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  auditDate: { type: Date, default: Date.now },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "startup",
    required: true,
  },
  auditorFeedback: { type: String },
  status: { type: String, required: true },
  result: { type: String },
  revenue: { type: Number },
  sales: { type: String },
  salasDataReport: { type: String },
  actualSalesReport: { type: String },
  issue: { type: String },
});
const User = mongoose.model("user", userSchema);
const Inventory = mongoose.model("inventory", inventorySchema);
const Startup = mongoose.model("startup", startupSchema);
const Audit = mongoose.model("audit", auditSchema);
const Products = mongoose.model("product", productSchema);
const Orders = mongoose.model("order", orderSchema);
const Articles = mongoose.model("startupsrticle", startupArticle);
const Sales = mongoose.model("startupsales", salesSchema);
const Startuptype = mongoose.model("startuptype", startupTypeSchema);
const AuditStartup = mongoose.model("auditStartup", auditStartupSchema);
const Donate = mongoose.model("donations", donateSchema);
const InspectStartupSchema = mongoose.model("inspectStartupSchema", inspectStartupSchema);
const StartUpSalesAudit = mongoose.model(
  "startupSalesAudit",
  startupSalesAuditSchema
);

module.exports = {
  User,
  Inventory,
  Startup,
  Audit,
  Products,
  Orders,
  Articles,
  Sales,
  Startuptype,
  AuditStartup,
  Donate,
  StartUpSalesAudit,
  InspectStartupSchema
};
