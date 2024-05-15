const { Products, User, Orders, Sales, Startup } = require("../models/db.schemas");
const mongoose = require("mongoose");
const { sendPhaseChangeEmail } = require("../utils/sendEmail");
const ObjectId = mongoose.Types.ObjectId;
exports.createOrder = async (req, res) => {
  try {
    const {
      accountNumber,
      accountTitle,
      address,
      status,
      recieptImage,
      products,
      userId,
      supplierId,
      totalPayment,
    } = req.body;

    // Iterate through each product in the request
    for (const productData of products) {
      const { _id, variants } = productData;
      const product = await Products.findById(_id);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${_id} not found` });
      }

      // Iterate through each variant in the product
      for (const variantData of variants) {
        const { _id: variantId, quantity, image, sale, profit, quantitySold, orderedQuantity, variantPrice, size } = variantData; // Extract image and sale fields
        const variantIndex = product.variants.findIndex((variant) =>
          variant._id.equals(variantId)
        );

        // Check if the variant exists in the product
        if (variantIndex === -1) {
          return res
            .status(400)
            .json({
              message: `Variant with ID ${variantId} not found in product ${_id}`,
            });
        }

        // Check if the quantity requested is available
        if (product.variants[variantIndex].quantity < quantity) {
          return res
            .status(400)
            .json({
              message: `Insufficient quantity for variant ${variantId} in product ${_id}`,
            });
        }

        product.variants[variantIndex].quantity += orderedQuantity;

        // Update the image and sale fields in the variant
        product.variants[variantIndex].image = image;
        product.variants[variantIndex].sale = sale;
        product.variants[variantIndex].profit = profit;
        product.variants[variantIndex].ok = quantitySold;
        product.variants[variantIndex].orderedQuantity = orderedQuantity;
        product.variants[variantIndex].variantPrice = variantPrice;
        product.variants[variantIndex].size = size;

      }

      // Save the updated product
      await product.save();
    }

    // Create the order
    const order = new Orders({
      accountNumber,
      accountTitle,
      address,
      recieptImage,
      status,
      products,
      user: userId,
      supplier: supplierId,
      totalPayment,
    });

    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// with user management:

exports.changeStatus = async (req, res) => {
  try {
    const { orderId, newStatus, userId } = req.body;

    // Validate input parameters
    if (!orderId || !newStatus || !userId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Fetch the order
    const order = await Orders.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === 'Pending' && newStatus === 'Confirmed') {
      // Fetch existing confirmed orders
      const existingOrders = await Orders.find({
        user: userId,
        status: 'Confirmed'
      });

      // Track which products are merged and which are new
      const mergedProducts = [];
      const newProducts = [];

      // Iterate over products in the pending order
      for (const product of order.products) {
        let productMerged = false;

        // Check if product exists in any confirmed order
        for (const existingOrder of existingOrders) {
          const existingProduct = existingOrder.products.find(p => p._id.equals(product._id));
          if (existingProduct) {
            // Merge variants
            for (const variant of product.variants) {
              const existingVariant = existingProduct.variants.find(v =>
                v._id.equals(variant._id) && v.size === variant.size
              );
              if (existingVariant) {
                existingVariant.orderedQuantity += variant.orderedQuantity;
                existingVariant.quantity += variant.orderedQuantity;
              } else {
                existingProduct.variants.push(variant);
              }
            }

            // Update total payment
            existingOrder.totalPayment += order.totalPayment;
            await existingOrder.save();
            mergedProducts.push(product._id);
            productMerged = true;
            break; // Move to the next product
          }
        }

        // If product is not merged, it's a new product
        if (!productMerged) {
          newProducts.push(product);
        }
      }

      // Create new order for new products
      if (newProducts.length > 0) {
        const newOrder = new Orders({
          user: userId,
          products: newProducts,
          supplier: order.supplier,
          accountNumber: order.accountNumber,
          accountTitle: order.accountTitle,
          recieptImage: order.recieptImage,
          address: order.address,
          status: 'Confirmed',
          totalPayment: order.totalPayment,
          orderDate: new Date()
        });

        await newOrder.save();
      }

      // Delete the original pending order
      // await Orders.findByIdAndDelete(orderId);

      // Change the original pending status to processed
      order.status = 'Processed';
      await order.save();

      return res.status(200).json({
        message: 'Pending order merged and new orders created',
        mergedProducts,
        newProducts
      });
    }

    // If the order status was not pending or the new status is not confirmed, simply update the status
    order.status = newStatus;
    await order.save();
    return res.status(200).json({ message: "Order status changed successfully", order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Working fine irrespective of the number of products and variants in the order and user is not being managed. The code iterates through each product and variant in the request, updates the product variant quantities, and creates the order. The response includes the created order.
// exports.changeStatus = async (req, res) => {
//   try {
//     const { orderId, newStatus } = req.body;

//     // Check if the order exists
//     const order = await Orders.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // Check if the order status was pending and the new status is confirmed
//     if (order.status === 'Pending' && newStatus === 'Confirmed') {
//       // Find existing confirmed orders with the same products
//       const existingOrders = await Orders.find({
//         status: 'Confirmed',
//         'products._id': { $in: order.products.map(product => product._id) }
//       });

//       for (const existingOrder of existingOrders) {
//         let matchingProducts = 0;
//         for (const product of order.products) {
//           const existingProduct = existingOrder.products.find(p => p._id.equals(product._id));
//           if (existingProduct) {
//             const matchingVariants = product.variants.filter(variant => {
//               const existingVariant = existingProduct.variants.find(v => v._id.equals(variant._id) && v.size === variant.size);
//               return existingVariant;
//             });

//             if (matchingVariants.length === product.variants.length) {
//               matchingProducts++;
//               for (const matchingVariant of matchingVariants) {
//                 const correspondingVariant = existingProduct.variants.find(v => v._id.equals(matchingVariant._id) && v.size === matchingVariant.size);
//                 correspondingVariant.orderedQuantity += matchingVariant.orderedQuantity;
//                 existingOrder.totalPayment += matchingVariant.variantPrice * matchingVariant.orderedQuantity;
//               }
//             }
//           }
//         }

//         if (matchingProducts === order.products.length) {
//           for (const product of order.products) {
//             const existingProduct = existingOrder.products.find(p => p._id.equals(product._id));
//             if (!existingProduct) {
//               existingOrder.products.push(product);
//               existingOrder.totalPayment += product.variants.reduce((acc, curr) => acc + (curr.variantPrice * curr.orderedQuantity), 0);
//             }
//           }

//           await existingOrder.save();
//           await Orders.findByIdAndDelete(orderId); // Remove the pending order
//           return res.status(200).json({ message: 'Pending order merged with existing order', order: existingOrder });
//         }
//       }

//       // If no existing confirmed orders found or no matching products/variants found, change the status of the pending order to Confirmed
//       order.status = 'Confirmed';
//       await order.save();
//       return res.status(200).json({ message: 'Pending order confirmed', order });
//     } else {
//       // If the order status was not pending or the new status is not confirmed, simply update the status
//       order.status = newStatus;
//       await order.save();
//       return res.status(200).json({ message: "Order status changed successfully", order });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

exports.getAllOrderBySupplierWithPagination = async (req, res) => {
  try {
    const { _id, pageSize, pageNumber, searchString } = req.body;
    const skip = pageNumber * pageSize;

    if (searchString !== "") {
      query = {
        $or: [
          { firstName: { $regex: searchString, $options: "i" } },
          { lastName: { $regex: searchString, $options: "i" } },
          { email: { $regex: searchString, $options: "i" } },
          { status: { $regex: searchString, $options: "i" } },
        ],
      };
    }

    // Fetch orders for the specific supplier
    const orders = await Orders.find({ supplier: _id })
      .skip(skip)
      .limit(parseInt(pageSize))
      .populate({
        path: "products", // Populate products
        populate: {
          path: "supplierId", // Populate supplier for each product
          select: "firstName lastName email phone", // Select specific fields
        },
      })
      .populate("user", "firstName lastName email phone"); // Populate user for each order

    const totalCount = await Orders.countDocuments({ supplier: _id });

    return res.status(200).json({
      orders,
      totalCount,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllOrderByUserWithPagination = async (req, res) => {
  try {
    const { _id, pageSize, pageNumber, searchString } = req.body;
    const skip = pageNumber * pageSize;

    // Fetch orders for the specific supplier
    const orders = await Orders.find({ user: _id })
      .skip(skip)
      .limit(parseInt(pageSize))
      .populate({
        path: "products", // Populate products
        populate: {
          path: "supplierId", // Populate supplier for each product
          select: "firstName lastName email phone", // Select specific fields
        },
      })
      .populate("user", "firstName lastName email phone"); // Populate user for each order

    const totalCount = await Orders.countDocuments({ supplier: _id });

    return res.status(200).json({
      orders,
      totalCount,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllOrdersWithStatus = async (req, res) => {
  try {
    // Fetch all orders with relevant supplier information
    const orders = await Orders.find().populate("user");

    // Initialize status counters
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
    };

    // Categorize orders by status
    orders.forEach((order) => {
      statusCounts[order.status]++;
    });

    // Send response
    res.json({ orders, statusCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrdersBySupplierId = async (req, res) => {
  try {
    const { supplierId } = req.body;

    const orders = await Orders.find({
      supplier: supplierId,
      status: "Pending",
    })
      .populate("user")
      .populate({
        path: "products",
        model: "product",
      });

    return res.status(200).json({ orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.confirmOrder = async (req, res) => {
//   try {
//     const { orderId, productId } = req.body;

//     const order = await Orders.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // Find the product in the order
//     let productInOrder;
//     for (const product of order.products) {
//       if (product._id.toString() === productId) {
//         productInOrder = product;
//         break;
//       }
//     }

//     if (!productInOrder) {
//       return res.status(404).json({ error: "Product not found in the order" });
//     }

//     const product = await Products.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Check if the product is already in a confirmed order
//     const confirmedOrder = await Orders.findOne({
//       _id: { $ne: orderId }, // Excluding current order
//       status: "Confirmed",
//       "products._id": productId
//     });

//     if (confirmedOrder) {
//       // Merge variant quantities and remove the product from the pending order
//       for (const confirmedProduct of confirmedOrder.products) {
//         if (confirmedProduct._id.toString() === productId) {
//           for (const variant of confirmedProduct.variants) {
//             const matchingVariant = productInOrder.variants.find(v => v._id.toString() === variant._id.toString());
//             if (matchingVariant) {
//               variant.orderedQuantity += matchingVariant.orderedQuantity;
//             }
//           }
//           break;
//         }
//       }

//       // Remove the product from the pending order
//       order.products = order.products.filter(product => product._id.toString() !== productId);
//     } else {
//       // If not found in confirmed orders, update the status of other products to confirm
//       for (const product of order.products) {
//         if (product._id.toString() !== productId) {
//           product.status = "Confirmed";
//         }
//       }
//     }

//     // Check if there's enough stock to confirm the order
//     if (productInOrder.quantity > product.quantity) {
//       return res.status(400).json({ error: "Insufficient stock" });
//     }

//     // Update stock and save the product
//     product.quantity -= productInOrder.quantity;
//     await product.save();

//     // Save the order
//     await order.save();

//     res.json({ message: "Order confirmed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.confirmOrder = async (req, res) => {
  try {
    const pendingOrder = req.body.pendingOrder; // Assuming you send the pending order data in the request body

    // Check if there are existing confirmed orders with the same products and variants
    const existingOrders = await Orders.find({
      status: 'Confirmed',
      'products._id': pendingOrder.products[0]._id, // Assuming only one product per order
      'products.variants._id': pendingOrder.products[0].variants[0]._id // Assuming only one variant per product
    });

    if (existingOrders.length > 0) {
      // If existing confirmed orders found, merge variants data and update the existing order
      const existingOrder = existingOrders[0];
      existingOrder.products[0].variants[0].orderedQuantity += pendingOrder.products[0].variants[0].orderedQuantity;
      existingOrder.products[0].variants[0].quantity += pendingOrder.products[0].variants[0].orderedQuantity;

      existingOrder.totalPayment += pendingOrder.totalPayment;
      await existingOrder.save();
      return res.status(200).json({ message: 'Pending order merged with existing order.' });
    } else {
      // If no existing confirmed orders found, create a new order
      const newOrder = new Orders(pendingOrder);
      await newOrder.save();
      return res.status(200).json({ message: 'New order created.' });
    }
  } catch (error) {
    console.error('Error confirming pending order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// exports.confirmOrder = async (req, res) => {
//   try {
//     const { orderId, productId } = req.body;

//     const order = await Orders.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     let productInOrder;
//     for (const product of order.products) {
//       if (product.id.toString() === productId) {
//         productInOrder = product;
//         break;
//       }
//     }//     if (!productInOrder) {
//       return res.status(404).json({ error: "Product not found in the order" });
//     }

//     const product = await Products.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     if (productInOrder.quantity > product.quantity) {
//       return res.status(400).json({ error: "Insufficient stock" });
//     }

//     // order.status = "Confirmed";
//     // await order.save();

//     product.quantity -= productInOrder.quantity;
//     await product.save();

//     res.json({ message: "Order confirmed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getConfirmedOrdersByUserIdV1 = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch confirmed orders for the specific user
    const confirmedOrders = await Orders.find({
      user: userId,
      status: "Confirmed",
    })
      .populate({
        path: "products",
        populate: {
          path: "_id", // Assuming _id is the ID reference for products in the Orders schema
          populate: [
            { path: "supplierId", select: "firstName lastName email phone" }, // Populate supplier for each product
            { path: "subCategory", select: "name" }, // Populate subCategory and select the name field
            { path: "productType", select: "name" }, // Populate productType and select the name field
          ],
          select: "_id productName productType variants", // Select the required fields for products
        },
      })
      .populate("supplier", "firstName lastName email phone"); // Populate supplier for each order
    const mergedVariants = {};

    confirmedOrders?.forEach((order) => {
      order?.products.forEach((product) => {
        const { totalPayment } = order
        product?.variants.forEach((variant) => {
          const { _id, quantity, price, image, sale, profit, quantitySold } = variant;
          if (!mergedVariants[_id]) {
            mergedVariants[_id] = {
              _id,
              quantity,
              price,
              image,
              sale,
              productName: product._id.productName,
              size: variant._id.size,
              productType: product._id.productType,
              supplierId: product._id.supplierId._id,
              status: order.status,
              totalPayment: order.totalPayment,
              orderDate: order.orderDate,
              orderId: order?._id,
              productId: product?._id._id,
              profit,
              quantitySold
            };
          } else {
            mergedVariants[_id].quantity += quantity;
            mergedVariants[_id].totalPayment += totalPayment;
          }
        });
      });
    });

    const mergedOrders = Object.values(mergedVariants);

    return res.status(200).json({
      confirmedOrders: mergedOrders,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProductSale = async (req, res) => {
  try {
    const { orderId, productId, variantId, saleAmount, soldQuantity } =
      req.body;

    // Find the order by orderId
    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the product in the order products array
    const product = order.products.find((p) => p._id.toString() === productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found in the order" });
    }

    // Find the variant in the product variants array
    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );

    if (!variant) {
      return res
        .status(404)
        .json({ message: "Variant not found in the product" });
    }

    // Check if the saleAmount exceeds the variant price
    if (saleAmount > variant.price) {
      const profit = saleAmount - variant.price;
      variant.sale += saleAmount;
      variant.quantity -= soldQuantity;
      variant.price = 0;
      variant.profit = profit;
      variant.quantitySold += soldQuantity;

      // Save the updated order
      await order.save();

      res.status(200).json({ message: "Sale updated successfully", order, profit });
    } else {
      variant.sale += saleAmount;
      variant.quantity -= soldQuantity;
      variant.price -= saleAmount;
      variant.quantitySold += soldQuantity;

      // Save the updated order
      await order.save();

      res.status(200).json({ message: "Sale updated successfully", order });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getConfirmedOrdersByUserId = async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is passed in the request parameters
  try {
    // Fetch confirmed orders for the specific user
    const confirmedOrders = await Orders.find({
      user: userId,
      status: "Confirmed",
    })
      .populate({
        path: "products",
        populate: {
          path: "_id", // Assuming _id is the ID reference for products in the Orders schema
          populate: [
            { path: "supplierId", select: "firstName lastName email phone" }, // Populate supplier for each product
            { path: "subCategory", select: "name" }, // Populate subCategory and select the name field
            { path: "productType", select: "name" }, // Populate productType and select the name field
          ],
          select: "productName productType variants", // Select the required fields for products
        },
      })
      .populate("supplier", "firstName lastName email phone"); // Populate supplier for each order

    return res.status(200).json({
      confirmedOrders,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getConfirmedOrdersByUserIdForAudit = async (req, res) => {
  try {
    const { user } = req.body
    // Query the database for orders with the status "Confirmed" and populate the products field
    const confirmedOrders = await Orders.find({ status: 'Confirmed', user: user })
    .populate({
      path: 'products._id'
    })
    .exec();

    // Format the response to include product name and ordered variants
    const formattedOrders = confirmedOrders.map(order => {
      const productsWithVariants = order.products.map(product => {
        const { productName } = product._id;
        return {
          productName,
          variants: product.variants
        };
      });
      return {
        _id: order._id,
        products: productsWithVariants,
        user: order.user,
        supplier: order.supplier,
        accountNumber: order.accountNumber,
        accountTitle: order.accountTitle,
        recieptImage: order.recieptImage,
        address: order.address,
        status: order.status,
        orderDate: order.orderDate,
        totalPayment: order.totalPayment
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addSales = async (req, res) => {
  try {
    const { orderId, selectedVariants, totalPrice } = req.body;

    // Update quantity sold for selected variants in the order document
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

  //   selectedVariants.forEach(selectedVariant => {
  //     const variantIndex = order.products[0].variants.findIndex(variant => variant._id.equals(selectedVariant._id));
  //     if (variantIndex !== -1) {
  //         order.products[0].variants[variantIndex].quantitySold += selectedVariant.quantitySold;
  //         if(order.products[0].variants[variantIndex].orderedQuantity<0){
  //           order.products[0].variants[variantIndex].orderedQuantity = 0
  //         }else{
  //           order.products[0].variants[variantIndex].orderedQuantity -= selectedVariant.quantitySold;
  //         }
  //     }
  // });

  selectedVariants.forEach((selectedVariant) => {
    order.products.forEach((product) => {
      const variantIndex = product.variants.findIndex((variant) =>
        variant._id.equals(selectedVariant._id)
      );
      if (variantIndex !== -1) {
        product.variants[variantIndex].quantitySold +=
          selectedVariant.quantitySold;
        if (product.variants[variantIndex].orderedQuantity < 0) {
          product.variants[variantIndex].orderedQuantity = 0;
        } else {
          product.variants[variantIndex].orderedQuantity -=
            selectedVariant.quantitySold;
        }
      }
    });
  });
  

    // Deduct total price from total payment in the order document
    order.price = order.totalPayment - totalPrice;

    // Save the updated order document
    await order.save();

    // get startup from the user of the order
    const startupInfo = await Startup.findOne({ userId: order.user });
    // Create a new sales document
    const newSale = new Sales({
      Date: new Date().toISOString(),
      sales: totalPrice,
      startup: startupInfo.startupType,
      startupId: startupInfo._id,
      orderId,
      userId: req.body._id // Assuming you have user authentication middleware
    });

    // Save the new sales document
    await newSale.save();

    // Find the associated startup for the user
    const startup = await Startup.findOne({ userId: req.body._id });

    if (!startup) {
      return res.status(404).json({ error: "Startup not found" });
    }

    // cacluate total sales of this startup user
    const totalSales = await Sales.aggregate([
      {
        $match: { userId: new ObjectId(req.body._id) }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$sales" }
        }
      }
    ]);


    let isPhaseUpgraded = false;

    // get current active phase
    const activePhase = startup.phases.find(phase => phase.isActive);
    if (!activePhase) {
      return res.status(404).json({ error: "Active phase not found" });
    }
    // Upgrade the phase if the target sale is reached
    if (totalSales[0].totalSales >= activePhase.targetSale) {
      const nextPhase = startup.phases.find(phase => phase.phaseNumber === activePhase.phaseNumber + 1);
      if (nextPhase && nextPhase.phaseNumber <= startup.phases.length) {
        // disbale current phase and enable next phase
        activePhase.isActive = false;
        nextPhase.isActive = true;
        isPhaseUpgraded = true;
      }
    }

    // send email to startup user about phase upgrade
    if (isPhaseUpgraded) {
      // get user by userId from startup
      const user = await User.findById(startup.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const subject="Phase Upgrade"
      const text = `Congratulations! Your startup ${startup.startupName} has been upgraded to phase ${startup.phases[startup.phases.length - 1].phaseNumber}`;
      userName = user.firstName + " " + user.lastName;
      // send email to user
      await sendPhaseChangeEmail(user.email, userName, subject, text);
    }
    await startup.save();

    res.status(200).json({ message: 'Sales added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getAllOrdersWithPagination = async (req, res) => {
  try {
    const { pageSize, pageNumber, searchString } = req.body;
    const skip = pageNumber * pageSize;

    let query = {};

    if (searchString !== "") {
      query.$or = [
        { 'user.firstName': { $regex: searchString, $options: 'i' } },
        { 'user.lastName': { $regex: searchString, $options: 'i' } },
        { 'user.email': { $regex: searchString, $options: 'i' } },
        { 'supplier.firstName': { $regex: searchString, $options: 'i' } },
        { 'supplier.lastName': { $regex: searchString, $options: 'i' } },
        { 'supplier.email': { $regex: searchString, $options: 'i' } },
        { 'products._id.productName': { $regex: searchString, $options: 'i' } },
        { 'status': { $regex: searchString, $options: 'i' } }
      ];
    }

    // Fetch orders with pagination and populate user, supplier, and product details
    const orders = await Orders.find(query)
      .skip(skip)
      .limit(parseInt(pageSize))
      .populate({
        path: 'user',
        select: 'firstName lastName email phone cnic location'
      })
      .populate({
        path: 'supplier',
        select: 'firstName lastName email phone cnic location'
      })
      .populate({
        path: 'products._id',
        select: 'productName variants'
      });

    const totalCount = await Orders.countDocuments(query);

    return res.status(200).json({
      orders,
      totalCount,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

