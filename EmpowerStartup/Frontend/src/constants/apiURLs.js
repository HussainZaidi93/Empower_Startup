
// const api_url = "https://c240-182-176-99-238.ngrok-free.app";
const api_url = "http://localhost:5000";

//User APIs
export const baseURL = `${api_url}`;
export const Post_UploadImage_URL = `${api_url}/api/users/uploadImage`;
export const Post_Login_URL = `${api_url}/api/users/login`;
export const Post_RegisterUser_URL = `${api_url}/api/users/register`;
export const Post_GetUserById_URL = `${api_url}/api/users/getUserById`;
export const Get_VerifyEmail_URL = `${api_url}/api/users/verifyUser`;
export const Get_ResetPasswordLink_URL = `${api_url}/api/users/resetPasswordLink`;
export const Post_GetRoleBasedUser_URL = `${api_url}/api/users/getRoleBasedUser`;
export const Post_DeleteUser_URL = `${api_url}/api/users/deleteUser`;
export const Post_UpdateUser_URL = `${api_url}/api/users/updateUser`;
export const Post_ListSuppliersForUser_URL = `${api_url}/api/users/listSuppliersForUser`;
export const Post_ChangeUserStatus_URL = `${api_url}/api/users/changeUserStatus`;
export const Post_SendMessage_URL = `${api_url}/api/users/sendMessage`;
export const Post_ResetPassword_URL = `${api_url}/api/users/resetPassword`;


//startup APIs
export const Post_CreateStartup_URL = `${api_url}/api/startups/createStartup`;
export const Post_GetAllStartupsWithPagination_URL = `${api_url}/api/startups/getAllStartupsWithPagination`;
export const Post_GetAllStartupsWithoutPagination_URL = `${api_url}/api/startups/getAllStartupsWithoutPagination`;
export const Post_GetStartupByUserId_URL = `${api_url}/api/startups/getStartupByUserId`;
export const Post_ApproveStartup_URL = `${api_url}/api/startups/approveStartup`;
export const Post_MakeAdminSuggestion_URL = `${api_url}/api/startups/makeAdminSuggestion`;
export const Post_MakeInspectionSuggestion_URL = `${api_url}/api/startups/makeInspectionSuggestion`;
export const Post_AddPhasesToStartup_URL = `${api_url}/api/startups/addPhasesToStartup`;
export const Post_DeleteStartup_URL = `${api_url}/api/startups/deleteStartup`;




// Article Routes
export const Post_AddArticle_URL = `${api_url}/api/articles/addArticle`;
export const Post_GetAllArcticles_URL = `${api_url}/api/articles/getAllArcticles`;


// Add prodcuct Routes, supplier side routes
export const Post_AddProduct_URL = `${api_url}/api/products/addProduct`;
export const Post_GetAllProducts_URL = `${api_url}/api/products/getAllProducts`;
export const Post_DeleteProduct_URL = `${api_url}/api/products/deleteProduct`;
export const Post_UpdateProduct_URL = `${api_url}/api/products/updateProduct`;
export const Post_GetProductBySupplierId_URL = `${api_url}/api/products/getProductBySupplierId`;
export const Post_GetAllProductsIrrespectiveOfAnyId_URL = `${api_url}/api/products/getAllProductsIrrespectiveOfAnyId`;
export const Post_GetAllProductsBySupplierWithPagination_URL = `${api_url}/api/products/getAllProductsBySupplierWithPagination`;
export const Post_DeleteProductById_URL = `${api_url}/api/products/deleteProductById`;


//Sales routes 

export const Post_AddSale_URL = `${api_url}/api/sales/addSale`;
export const Post_GetSalesReport_URL = `${api_url}/api/sales/getSalesReport`;
export const Get_SalesPerStartup_URL = `${api_url}/api/sales/getSalesPerStartup`;

// Startup type 
export const Post_AddStartupType_URL = `${api_url}/api/startupType/addStartupType`;
export const Post_GetAllStartupTypes_URL = `${api_url}/api/startupType/getAllStartupTypes`;
export const Post_DeleteStartupType_URL = `${api_url}/api/startupType/deleteStartupType`;


// Audit startup APIS 

export const Post_AssignStartupAudit_URL = `${api_url}/api/auditStartup/assignStartupAudit`;
export const Post_GetAllAuditorStartups_URL = `${api_url}/api/auditStartup/getAllAuditorStartups`;
export const Post_PlaceAudit_URL = `${api_url}/api/auditStartup/placeAudit`;
export const Post_GetAllAuditsByAuditorId_URL = `${api_url}/api/auditStartup/getAllAuditsByAuditorId`;



// Analytics
export const Post_GetSummaryDashboard_URL = `${api_url}/api/analytics/getSummaryDashboard`;
export const Post_GetAllStartupSalesReport_URL = `${api_url}/api/analytics/getAllStartupSalesReport`;

// Order routes 
export const Post_CreateOrder_URL = `${api_url}/api/orders/createOrder`;
export const Post_GetOrdersBySupplierId_URL = `${api_url}/api/orders/getOrdersBySupplierId`;
export const Post_ChangeStatus_URL = `${api_url}/api/orders/changeStatus`;
export const Post_GetAllOrderBySupplierWithPagination_URL = `${api_url}/api/orders/getAllOrderBySupplierWithPagination`;
export const Post_GetAllOrderByUserWithPagination_URL = `${api_url}/api/orders/getAllOrderByUserWithPagination`;
export const Post_GetConfirmedOrdersByUserId_URL = `${api_url}/api/orders/getConfirmedOrdersByUserId`;
export const Post_GetConfirmedOrdersByUserIdForAudit_URL = `${api_url}/api/orders/getConfirmedOrdersByUserIdForAudit`;
export const Post_GetAllOrders_URL = `${api_url}/api/orders/getAllOrdersWithPagination`;

export const Post_ConfirmOrder_URL = `${api_url}/api/orders/confirmOrder`;
export const Post_UpdateProductSale_URL = `${api_url}/api/orders/updateProductSale`;
export const Post_AddSales_URL = `${api_url}/api/orders/addSales`;

// Donation routes 

export const Post_CreateDonator_URL = `${api_url}/api/donations/createDonator`;
export const Post_GetAllDonations_URL = `${api_url}/api/donations/getAllDonations`;

