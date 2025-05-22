import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../Context/AppContext";
import { getseller, seller } from "../../../services/home/seller";
import UserDashboardContent from "../../../components/home/userdashboardcontent";

// Tabs for the dashboard
const tabs = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "comments", label: "Comments" },
  { id: "settings", label: "Settings" },
];

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [seller, setSeller] = useState<seller>();
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { user, token } = appContext;
  const uId = user?.id;

  useEffect(() => {
    const fetchSeller = async () => {
      if (!uId) return;
      try {
        const response = await getseller(token, uId);
        if (!("error" in response)) {
          setSeller(response);
          console.log("SELLER RESPONSE", response); // <-- add this
        }
      } catch (error) {
        console.error("Failed to fetch seller:", error);
      }
    };

    fetchSeller();
  }, [token, uId]);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="bg-gray-100 rounded-lg p-4 space-y-4 h-fit shadow-md">
        <h2 className="text-lg font-semibold mb-2">My Account</h2>
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
      <section className="bg-white rounded-lg p-6 shadow-md min-h-[300px]">
        <UserDashboardContent activeTab={activeTab} user={user!} seller={seller} />
      </section>
    </div>
  );
}
