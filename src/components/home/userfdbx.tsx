import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { feedback, getfbksbyuserid } from "../../services/Auth/auth";
import { useParams } from "react-router-dom";

const UserFeedbackList: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppContext must be used within an AppProvider");

  const { token, user } = appContext;
  const { id: routeId } = useParams(); // from URL
  const userId = routeId ? Number(routeId) : user?.id;

  const [feedbacks, setFeedbacks] = useState<feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchFeedbacks = async () => {
      try {
        const response = await getfbksbyuserid(token!, userId);
        if ("error" in response) {
          setFeedbacks([]);
        } else {
          setFeedbacks(response);
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token, userId]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading your feedbacks...</p>;
  }

  if (feedbacks.length === 0) {
    return <p className="text-gray-500 text-sm">You have not submitted any feedback yet.</p>;
  }

  return (
    <div className="space-y-6">
      {feedbacks.map((fb) => (
        <div key={fb.id} className="rounded-2xl border shadow-md p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Feedback #{fb.id}</h3>
            <span className="text-sm text-muted-foreground">{new Date(fb.created_at!).toLocaleString()}</span>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Email:</strong> {fb.email}
            </p>
            <p>
              <strong>Message:</strong> {fb.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserFeedbackList;
