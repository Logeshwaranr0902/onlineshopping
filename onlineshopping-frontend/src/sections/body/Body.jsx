import React, { useRef } from "react";
import { categories } from "../../data/categories";
import CategorySection from "./CategorySection";

const Body = ({ addToCart, categoryRefs }) => {
  const refs = categories.reduce((acc, category) => {
    acc[category.id] = useRef(null);
    categoryRefs.current[category.id] = acc[category.id]; // Assign to categoryRefs
    return acc;
  }, {});

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id} ref={refs[category.id]}>
          <CategorySection
            categoryName={category.name}
            products={category.products}
            isFirst={category.isFirst}
            addToCart={addToCart}
          />
        </div>
      ))}
    </div>
  );
};

export default Body;
