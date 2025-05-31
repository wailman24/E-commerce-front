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

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

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
      } else {
        setLocalReviews(localReviews.filter((r) => r.id !== userReview.id));
        setShowForm(false);
        setError(null);
      }
    } catch {
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

      if ("error" in res) {
        setError(res.error);
      } else {
        const reviewWithUser = {
          ...res,
          user: user!,
        };

        const updatedReviews = userReview
          ? localReviews.map((r) => (r.id === userReview.id ? reviewWithUser : r))
          : [reviewWithUser, ...localReviews];

        setLocalReviews(updatedReviews);
        setShowForm(false);
        setError(null);
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="mt-10">
      <div className="bg-white p-6 rounded-xl shadow-md border space-y-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>

        {/* Review Form - Always at the top */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <label htmlFor="rating" className="font-medium">
                Rating:
              </label>
              <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
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

            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {userReview ? "Update Review" : "Submit Review"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 underline">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          !userReview && (
            <button onClick={handleAddClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add Review
            </button>
          )
        )}

        {/* Review List */}
        {localReviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
            {localReviews.map((rev, i) => (
              <div key={rev.id ?? `review-${i}`} className="bg-gray-50 p-4 rounded-md border shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">{rev.user?.name || "Anonymous"}</p>
                    <p className="text-sm text-gray-400">{new Date(rev.updated_at ?? "").toLocaleDateString()}</p>
                  </div>
                  {rev.user?.id === user?.id && !showForm && (
                    <div className="flex gap-2">
                      <button onClick={handleEditClick} className="text-gray-500 hover:text-blue-600">
                        <Pencil size={18} />
                      </button>
                      <button onClick={handleDelete} className="text-gray-500 hover:text-red-600">
                        <Trash size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-yellow-500 text-lg leading-tight">
                  {"★".repeat(rev.rating)}
                  {"☆".repeat(5 - rev.rating)}
                </div>
                <p className="text-gray-700 mt-2">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
