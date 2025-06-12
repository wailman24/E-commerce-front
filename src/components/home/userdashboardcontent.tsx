import React from "react";
import UserProfileDetails from "./userprofile";
import { seller } from "../../services/home/seller";
import { user } from "../../pages/auth/signup";
import OrdersList from "./orderList";
import UserSettings from "./usersetting";

type DashboardContentProps = {
  activeTab: string;
  user: user;
  seller?: seller;
};

const UserDashboardContent: React.FC<DashboardContentProps> = ({ activeTab, user, seller }) => {
  console.log("ActiveTab in DashboardContent:", user); // debug

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
          <h2 className="text-2xl font-bold mb-4">Your Comments</h2>
          <UserSettings />
        </div>
      );

      return <p className="text-red-500">Unknown tab selected: {activeTab}</p>;
  }
};

export default UserDashboardContent;
