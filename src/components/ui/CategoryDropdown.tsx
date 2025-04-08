import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
//import classNames from "classnames";

// Example data with children
const categories = [
  {
    name: "Computers and Laptops",

    children: ["Gaming Laptops", "Business Laptops", "Monitors"],
  },
  {
    name: "Cosmetics and Body Care",

    children: [],
  },
  {
    name: "Accessories",

    children: [],
  },
  {
    name: "Cloths",

    children: [],
  },
  {
    name: "Shoes",

    children: [],
  },
  {
    name: "Gifts",
    children: [],
  },
  {
    name: "Pet Care",
    children: [],
  },
  {
    name: "Mobile and Tablets",

    children: ["Android Phones", "Tablets", "iPhones"],
  },
  {
    name: "Music and Gaming",

    children: [],
  },
  {
    name: "Others",

    children: [],
  },
];

const CategoryDropdown = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="relative group">
      {/* Trigger */}
      <button className="flex items-center gap-2 text-white text-sm font-medium">
        <span className="flex items-center gap-1">
          <ChevronDown size={16} />
          All Categories
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute left-0 top-full w-60 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition z-50">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative group/category"
            onMouseEnter={() => setHoveredCategory(cat.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {/* <img src={cat.icon} alt="" className="w-5 h-5 mr-2" /> */}
              <span className="text-sm">{cat.name}</span>
              {cat.children.length > 0 && (
                <ChevronRight className="ml-auto" size={16} />
              )}
            </div>

            {/* Child dropdown */}
            {cat.children.length > 0 && hoveredCategory === cat.name && (
              <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg z-50">
                {cat.children.map((child, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {child}
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
