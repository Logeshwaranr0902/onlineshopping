import React, { useState } from "react";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import Item from "./Item";

const CategorySection = ({ categoryName, products, isFirst, addToCart }) => {
  const [isGridView, setIsGridView] = useState(false);
  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  return (
    <section
      className={`text-white flex-col  items-center justify-center bg-gradient-to-r from-[#1a2244]  via-[#323875] to-[#150d35]  ${
        isFirst ? "pt-16" : ""
      }`}
    >
      <div className="mx-5 py-4 overflow-x-auto custom-scrollbar">
        <h1 className="py-6 pl-[53px] font-extrabold text-xl lg:text-3xl -ml-5">
          {categoryName}
        </h1>
        <div
          className={
            isGridView ? "grid grid-cols-8 gap-y-3 mx-4" : "flex flex-row mx-4"
          }
        >
          {products.map((product) => (
            <Item
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              customImage={product.image}
              quantity={product.quantity}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:flex justify-center border-y border-gray-500 ">
        <span
          onClick={toggleView}
          className="hover:cursor-pointer border border-transparent rounded-full hover:bg-gray-700"
        >
          {isGridView ? (
            <ArrowDropUpOutlinedIcon />
          ) : (
            <ArrowDropDownOutlinedIcon />
          )}
        </span>
      </div>
    </section>
  );
};

export default CategorySection;
