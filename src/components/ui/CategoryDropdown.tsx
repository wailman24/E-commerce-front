import { ChevronDown, ChevronRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { category, getcategories } from "../../services/home/category";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  //const navigate = useNavigate();
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("CategoryDropdown must be used within an AppProvider");

  const { token } = appContext;

  useEffect(() => {
    async function fetchCategories() {
      const result = await getcategories(token);
      if (!Array.isArray(result)) {
        console.error(result.error);
      } else {
        setCategories(result);
      }
    }
    fetchCategories();
  }, [token]);

  return (
    <div className="relative group">
      {/* Trigger */}
      <button className="flex items-center gap-2 text-white text-sm font-medium">
        <ChevronDown size={16} />
        All Categories
      </button>

      {/* Dropdown */}
      <div className="absolute left-0 top-full w-60 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition z-50">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative group/category"
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <span className="text-sm">{cat.name}</span>
              {cat.subcategories && cat.subcategories.length > 0 && <ChevronRight className="ml-auto" size={16} />}
            </div>

            {/* Subcategories dropdown */}
            {cat.subcategories && cat.subcategories.length > 0 && hoveredCategory === cat.id && (
              <div className="absolute left-full top-0 ml-1 w-48 bg-white text-black rounded-md shadow-lg z-50">
                {cat.subcategories.map((sub) => (
                  <div key={sub.id} className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
