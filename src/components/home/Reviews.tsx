import React, { useContext, useEffect, useState } from "react";
import { review, addreview, updatereview, deletereview } from "../../services/home/reviews";
import { Pencil, Trash } from "lucide-react";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";

type ProductReviewsProps = {
  reviews: review[];
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("ProductReviews must be used within an AppProvider");

  const { token, user } = appContext;
  const params = useParams();

  const [localReviews, setLocalReviews] = useState<review[]>(reviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 🔄 Sync with parent reviews prop
  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  // 🔁 Compute userReview each render
  const userReview = localReviews.find((r) => r.user?.id === user?.id);

  const handleEditClick = () => {
    setRating(userReview?.rating || 5);
    setComment(userReview?.comment || "");
    setShowForm(true);
  };

  const handleAddClick = () => {
    setRating(5);
    setComment("");
    setShowForm(true);
  };
  const handleDelete = async () => {
    if (!userReview) return;

    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await deletereview(token, userReview.id);
      if ("error" in res) {
        setError(res.error);
        console.error(res.error);
      } else {
        setLocalReviews(localReviews.filter((r) => r.id !== userReview.id));
        setShowForm(false);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError("Something went wrong while deleting.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res: review | { error: string };

      if (userReview) {
        res = await updatereview(token, userReview.id, { rating, comment });
      } else {
        res = await addreview(token, Number(params.id), { rating, comment });
      }

      if (res && "error" in res) {
        setError(res.error);
        console.error(res.error);
      } else {
        setError(null);
        console.log("Review submitted successfully:", res);
        const reviewWithUser = {
          ...res,
          user: user!, // Patch in current user if not returned from backend
        };

        if (userReview) {
          // 🔄 Update local review
          const updatedList = localReviews.map((r) => (r.id === userReview.id ? reviewWithUser : r));
          setLocalReviews(updatedList);
        } else {
          // ➕ Add new review
          setLocalReviews([reviewWithUser, ...localReviews]);
        }

        setShowForm(false);
      }
    } catch (err) {
      console.error("Review submission failed:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

      {/* Add or Edit Review Buttons */}
      {!userReview && !showForm && (
        <button onClick={handleAddClick} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Review
        </button>
      )}

      {/* Review List */}
      {localReviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-4">
          {localReviews.map((rev, index) => (
            <div key={rev.id ?? `review-${index}`} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{rev.user?.name || "Anonymous"}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{new Date(rev.updated_at ?? "").toLocaleDateString()}</span>
                  {rev.user?.id === user?.id && !showForm && (
                    <div className="flex gap-2">
                      <button onClick={handleEditClick} className="text-gray-500 hover:text-blue-600" title="Edit Review">
                        <Pencil size={16} />
                      </button>
                      <button onClick={handleDelete} className="text-gray-500 hover:text-red-600" title="Delete Review">
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-yellow-500">
                {"★".repeat(rev.rating)}
                {"☆".repeat(5 - rev.rating)}
              </div>
              <p className="text-gray-700 mt-1">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <label className="font-medium">Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border px-2 py-1 rounded">
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {userReview ? "Update Review" : "Submit Review"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 underline">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductReviews;
