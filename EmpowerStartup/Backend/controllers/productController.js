const { Products, User } = require("../models/db.schemas");
const mongoose = require("mongoose");

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      variants,
      category,
      subCategory,
      productType,
      supplierId,
      startupTypeId,
    } = req.body;

    const newProduct = new Products({
      productName,
      variants,
      category,
      subCategory,
      productType,
      supplierId,
      startupTypeId,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { searchString, supplierId } = req.body;
    console.log("string", searchString);
    let query = {};

    // If search query is provided, construct a regex pattern to match any part of the product name
    if (searchString) {
      const searchRegex = new RegExp(searchString, "i");
      query = { productName: searchRegex };
    }
    query.supplierId = supplierId;
    const allProducts = await Products.find(query);
    // Construct image URLs for each product

    // // const productsWithImages = allProducts.map((product) => {
    // //   const productData = {
    // //     _id: product._id,
    // //     productName: product.productName,
    // //     quantity: product.quantity,
    // //     size: product.size,
    // //     price: product.price,
    // //     image: `/uploads/${product.image}`,
    // //     category: product.category,
    // //     subCategory: product.subCategory,
    // //     productType: product.productType,
    // //     supplierId: product.supplierId,
    // //   };
    //   return productData;
    // });
    console.log("products", allProducts);
    return res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//   try {
//     const { orderId, newStatus } = req.body;

//     // Check if the order exists
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // Update the order status
//     order.status = newStatus;
//     await order.save();

//     return res
//       .status(200)
//       .json({ message: "Order status changed successfully", order });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// exports.getAllOrderBySupplierWithPagination = async (req, res) => {
//   try {
//     const {
//       supplierId,
//       pageNumber = 1,
//       pageSize = 10,
//       searchString = "",
//     } = req.body;

//     // Validate that supplierId is provided
//     if (!supplierId) {
//       return res.status(400).json({ error: "Supplier ID is required" });
//     }

//     // Construct the query for searching orders by supplierId and optional searchString
//     const query = {
//       $and: [
//         { supplier: mongoose.Types.ObjectId(supplierId) },
//         {
//           $or: [
//             { "user.firstName": { $regex: searchString, $options: "i" } },
//             { "user.lastName": { $regex: searchString, $options: "i" } },
//             // Add other fields you want to search
//           ],
//         },
//       ],
//     };

//     // Calculate skip value based on pageNumber and pageSize
//     const skip = (pageNumber - 1) * pageSize;

//     // Retrieve orders with pagination
//     const orders = await Order.find(query)
//       .skip(skip)
//       .limit(parseInt(pageSize))
//       .populate("user", "firstName lastName"); // Add other fields you want to populate

//     // Count total orders matching the query
//     const totalOrders = await Order.countDocuments(query);

//     return res.status(200).json({
//       orders,
//       totalOrders,
//       pageSize: parseInt(pageSize),
//       pageNumber: parseInt(pageNumber),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.deleteProduct = async (req, res) => {
  const { id, variantId } = req.body;

  try {
    // Find the product by ID
    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the index of the variant to be deleted
    const variantIndex = product.variants.findIndex(variant => variant._id == variantId);

    if (variantIndex === -1) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    // Remove the variant from the variants array
    product.variants.splice(variantIndex, 1);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Variant deleted successfully', updatedProduct: product });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id, productName, variants, category, subCategory, productType, supplierId, startupTypeId } = req.body;

  try {
    // Find the product by ID
    let product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product fields
    product.productName = productName;
    product.variants = variants;
    product.category = category;
    product.subCategory = subCategory;
    product.productType = productType;
    product.supplierId = supplierId;
    product.startupTypeId = startupTypeId;

    // Save the updated product to the database
    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProductBySupplierId = async (req, res) => {
  try {
    const { supplierId } = req.body;
    
    // Check if supplierId is provided
    if (!supplierId) {
      return res.status(400).json({ error: "Supplier ID is required" });
    }

    // Find products associated with the supplierId
    const products = await Products.find({ supplierId });

    // If no products found, return an empty array
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this supplier" });
    }

    // If products found, return them
    res.json(products);
  } catch (error) {
    console.error("Error occurred while fetching products", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllProductsIrrespectiveOfAnyId = async(req, res) =>{
  try {
    const allProducts = await Products.find({});
    console.log("products", allProducts);
    return res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.getAllProductsBySupplierWithPagination = async (req, res) => {
  try {
    const { _id, pageSize, pageNumber, searchString } = req.body;
    const skip = pageNumber * pageSize;

    if (searchString !== "") {
      query = {
        $or: [
          { productName: { $regex: searchString, $options: "i" } },
          { productType: { $regex: searchString, $options: "i" } },
        ],
      };
    }

    // Fetch orders for the specific supplier
    const products = await Products.find({supplierId:_id})

    const totalCount = await Products.countDocuments({ supplierId: _id });

    return res.status(200).json({
      products,
      totalCount,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProductById = async(req , res) =>{
  const { id } = req.body;

  try {
    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}