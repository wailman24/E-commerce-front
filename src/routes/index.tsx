import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

// Auth Pages
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";

// Layouts
import MainLayout from "../layouts/MainLayout";
import SellerLayout from "../layouts/SellerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public & Shared Pages
import Home from "../pages/main/home";
import Products from "../pages/main/products";
import ProductPage from "../pages/main/productpage";
import BecomeSeller from "../pages/main/becomeseller";
import ShoppingCartPage from "../pages/main/shoppingcarts";
import Wishlist from "../pages/main/wishlist";
import FeedbackForm from "../pages/main/faq";
import Bestselling from "../pages/main/bestselling";

// User Pages
import UserDashboardPage from "../pages/main/user/dahboarduser";
import UserSettings from "../components/home/usersetting";
import PaymentCancel from "../pages/main/payment/paymentcancel";
import PaymentSuccess from "../pages/main/payment/paymentsuccess";

// Seller Pages
import Page from "../pages/dashboardseller/dashboard";
import ProductAddForm from "../pages/dashboardseller/products/addproduct";
import Productseller from "../pages/dashboardseller/products/productseller";
import NotvalidProductseller from "../pages/dashboardseller/products/notvalidprod";
import Orderseller from "../pages/dashboardseller/orders/sellerorders";
import Payouts from "../pages/dashboardseller/finance/payouts";

// Admin Pages
import AdminPage from "../pages/dashboardadmin/dashboard";
import AllUsers from "../pages/dashboardadmin/users/allusers";
import Sellers from "../pages/dashboardadmin/users/sellers";
import PendingSellers from "../pages/dashboardadmin/users/sellerpending";
import AllProducts from "../pages/dashboardadmin/products/allproducts";
import ProductPending from "../pages/dashboardadmin/products/productpending";
import CategoryAddForm from "../pages/dashboardadmin/products/addcategory";
import Categories from "../pages/dashboardadmin/products/categories";
import AllOrders from "../pages/dashboardadmin/orders/allorders";
import Items from "../pages/dashboardadmin/orders/items";
import SellerPayouts from "../pages/dashboardadmin/payouts/payoutseller";
import AllFbks from "../pages/dashboardadmin/users/feedback";
import Comments from "../pages/dashboardadmin/users/comments";

function AppRoutes() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppRoutes must be used within an AppProvider");

  const { isAuthenticated } = appContext;

  return (
    <Routes>
      {/* Auth Routes (only visible when NOT authenticated) */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </>
      )}

      {/* Public routes (for all) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/about/:id" element={<ProductPage />} />
        <Route path="/bestselling" element={<Bestselling />} />
      </Route>

      {/* Protected Routes */}
      {isAuthenticated ? (
        <>
          {/* Main authenticated user routes */}
          <Route element={<MainLayout />}>
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/becomeseller" element={<BecomeSeller />} />
            <Route path="/user/about" element={<UserDashboardPage />} />
            <Route path="/user/about/:id" element={<UserDashboardPage />} />
            <Route path="/user/settings" element={<UserSettings />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/FAQ" element={<FeedbackForm />} />
          </Route>

          {/* Seller routes */}
          <Route element={<SellerLayout />}>
            <Route path="/dash" element={<Page />} />
            <Route path="/product/add" element={<ProductAddForm />} />
            <Route path="/dashboard/product" element={<Productseller />} />
            <Route path="/dashboard/NotValidProduct" element={<NotvalidProductseller />} />
            <Route path="/dashboard/order" element={<Orderseller />} />
            <Route path="/dashboard/finance" element={<Payouts />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admindash" element={<AdminPage />} />
            <Route path="/Admin/dashboard/users" element={<AllUsers />} />
            <Route path="/Admin/dashboard/allsellers" element={<Sellers />} />
            <Route path="/Admin/dashboard/sellers" element={<PendingSellers />} />
            <Route path="/Admin/dashboard/allproducts" element={<AllProducts />} />
            <Route path="/Admin/dashboard/products" element={<ProductPending />} />
            <Route path="/Admin/dashboard/categories" element={<Categories />} />
            <Route path="/Admin/dashboard/addcategories" element={<CategoryAddForm />} />
            <Route path="/Admin/dashboard/orders" element={<AllOrders />} />
            <Route path="/Admin/dashboard/items-sold" element={<Items />} />
            <Route path="/Admin/dashboard/items-sold/:id" element={<Items />} />
            <Route path="/Admin/dashboard/payouts" element={<SellerPayouts />} />
            <Route path="/Admin/dashboard/comments" element={<Comments />} />
            <Route path="/Admin/dashboard/feedbacks" element={<AllFbks />} />
          </Route>
        </>
      ) : (
        // Redirect any unknown or protected route to login
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRoutes;
