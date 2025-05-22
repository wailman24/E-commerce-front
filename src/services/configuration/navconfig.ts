import { user } from "../../pages/auth/signup";
import { IconChartBar, IconDashboard, IconFolder, IconListDetails, IconUsers } from "@tabler/icons-react";

export function getNavForSeller(user: user) {
  return {
    user: {
      name: user?.name || "Seller",
      email: user?.email || "seller@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dash",
        icon: IconDashboard,
      },
      {
        title: "Products",
        url: "#",
        icon: IconListDetails,
        items: [
          { title: "Products", url: "/dashboard/product" },
          { title: "Add Product", url: "/product/add" },
          { title: "Products not valid", url: "/dashboard/NotValidProduct" },
        ],
      },
      {
        title: "Orders",
        url: "#",
        icon: IconFolder,
        items: [{ title: "All Orders", url: "/dashboard/order" }],
      },
      { title: "Finance", url: "#", icon: IconChartBar },
    ],
  };
}

export function getNavForAdmin(user: user) {
  return {
    user: {
      name: user?.name || "Admin",
      email: user?.email || "admin@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admindash",
        icon: IconDashboard,
      },
      {
        title: "Users",
        url: "#",
        icon: IconUsers,
        items: [
          { title: "All Users", url: "Admin/dashboard/users" },
          { title: "Sellers", url: "Admin/dashboard/allsellers" },
          { title: "Pending Approval", url: "Admin/dashboard/sellers" },
        ],
      },
      {
        title: "Products",
        url: "#",
        icon: IconListDetails,
        items: [
          { title: "Products", url: "Admin/dashboard/allproducts" },
          { title: "Pending Approval", url: "Admin/dashboard/products" },
          { title: "categories", url: "Admin/dashboard/categories" },
          { title: "Add category", url: "Admin/dashboard/addcategories" },
        ],
      },
      {
        title: "Orders",
        url: "#",
        icon: IconFolder,
        items: [
          { title: "All Orders", url: "Admin/dashboard/orders" },
          { title: "Items Sold", url: "Admin/dashboard/items-sold" },
        ],
      },
      { title: "Payout for Sellers", url: "#", icon: IconChartBar },
    ],
  };
}
