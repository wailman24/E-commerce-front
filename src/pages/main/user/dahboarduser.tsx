import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../Context/AppContext";
import { getseller, seller } from "../../../services/home/seller";

import UserDashboardContent from "../../../components/home/userdashboardcontent";
import { useParams } from "react-router-dom";
import { user } from "../../../pages/auth/signup";
import { getuserbyid } from "../../../services/Auth/auth";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "comments", label: "Comments" },
];

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [seller, setSeller] = useState<seller>();
  const [displayedUser, setDisplayedUser] = useState<user | null>(null);
  const appContext = useContext(AppContext);
  const { id } = useParams(); // check if user ID is passed in the route

  if (!appContext) throw new Error("UserDashboardPage must be used within an AppProvider");

  const { user, token } = appContext;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Use param ID if available, else fallback to current user
        const targetUserId = id ? Number(id) : user?.id;
        if (!targetUserId) return;

        // Fetch user by ID
        const fetchedUser = id ? await getuserbyid(token, targetUserId) : user;
        if (fetchedUser && !("error" in fetchedUser)) {
          setDisplayedUser(fetchedUser);
        } else {
          console.error("Error fetching user:", fetchedUser!.error);
          setDisplayedUser(null); // or handle error accordingly
        }

        // Fetch seller info
        const sellerResponse = await getseller(token, targetUserId);
        if (!("error" in sellerResponse)) {
          setSeller(sellerResponse);
        }
      } catch (error) {
        console.error("Failed to fetch user/seller info:", error);
      }
    };

    fetchData();
  }, [token, id, user]);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="bg-gray-100 rounded-lg p-4 space-y-4 h-fit shadow-md">
        <h2 className="text-lg font-semibold mb-2">{id ? "User Overview" : "My Account"}</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                activeTab === tab.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <section key={activeTab} className="bg-white rounded-lg p-6 shadow-md min-h-[300px]">
        {displayedUser ? <UserDashboardContent activeTab={activeTab} user={displayedUser} seller={seller} /> : <p>Loading user data...</p>}
      </section>
    </div>
  );
}
