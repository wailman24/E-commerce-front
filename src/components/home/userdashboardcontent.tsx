import React from "react";
import UserProfileDetails from "./userprofile";
import { seller } from "../../services/home/seller";
import { user } from "../../pages/auth/signup";
import OrdersList from "./orderList";

type DashboardContentProps = {
  activeTab: string;
  user: user;
  seller?: seller;
};

const UserDashboardContent: React.FC<DashboardContentProps> = ({ activeTab, user, seller }) => {
  switch (activeTab) {
    case "profile":
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <UserProfileDetails user={user} seller={seller} />
        </div>
      );
    case "orders":
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
          <OrdersList />
        </div>
      );
    case "comments":
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Comment</h2>
          <p>Comments you did.</p>
        </div>
      );
    case "settings":
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          <p>Manage your preferences and password.</p>
        </div>
      );
    default:
      return <p className="text-gray-500">Select a section from the menu.</p>;
  }
};

export default UserDashboardContent;
