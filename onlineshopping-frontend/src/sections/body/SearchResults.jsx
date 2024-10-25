import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fruits,
  dairy,
  meatAndPoultry,
  seafood,
  bakeryItems,
  cannedAndPackagedGoods,
  grainsAndPasta,
  frozenFoods,
  snacksAndConfectionery,
  beverages,
  healthAndBeautyProducts,
  householdSupplies,
  personalCareItems,
  babyCareProducts,
  petSupplies,
  kitchenSupplies,
  homeDecor,
} from "../../data/products";
import Item from "./Item";

const SearchResults = ({ addToCart }) => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const query =
    new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  useEffect(() => {
    const allProducts = [
      ...fruits,
      ...dairy,
      ...meatAndPoultry,
      ...seafood,
      ...bakeryItems,
      ...cannedAndPackagedGoods,
      ...grainsAndPasta,
      ...frozenFoods,
      ...snacksAndConfectionery,
      ...beverages,
      ...healthAndBeautyProducts,
      ...householdSupplies,
      ...personalCareItems,
      ...babyCareProducts,
      ...petSupplies,
      ...kitchenSupplies,
      ...homeDecor,
    ];

    console.log("Current Query:", query);

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  }, [query]);
  return (
    <div
      className={`flex flex-col min-h-screen text-white bg-gradient-to-br from-[#1a2244]  via-[#323875] to-[#150d35] `}
    >
      <div className="mt-24 ml-7 mb-8 text-3xl">
        <h1>Search Results for: {query}</h1>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Item
              key={product.id}
              id={product.id}
              customImage={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center ">
          <p>No results found for "{query}".</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
