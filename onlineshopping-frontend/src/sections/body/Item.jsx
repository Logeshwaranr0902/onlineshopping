import React, { useEffect, useState } from "react";

const PEXELS_API_KEY =
  "tB436MubeHjFQ0CypZT6WLuTZSzABPvXmU1RfeOxoESLKIe5pXi0tB8i";

const Item = ({ id, name, price, quantity, addToCart, customImage }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchImage = async (productName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          productName
        )}&per_page=1`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();

      if (data.photos.length > 0) {
        setImage(data.photos[0].src.medium);
      } else {
        setImage("default-image-url.jpg");
      }
    } catch (error) {
      console.error(error);
      setImage("default-image-url.jpg");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customImage) {
      setImage(customImage);
      setLoading(false);
    } else {
      fetchImage(name);
    }
  }, [name, customImage]);

  return (
    <div className="lg:w-40 lg:h-60 w-28 h-48 rounded-lg border-white border bg-blue-800/30 flex-shrink-0 mx-2 backdrop-filter backdrop-blur-md">
      <div className="flex flex-col m-2">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <img
            src={image}
            className="rounded-lg lg:h-24 h-14 object-cover"
            alt={name}
          />
        )}
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex flex-row justify-between items-center h-12 gap-2">
            <h1 className="text-sm">{name}</h1>
            <h2 className="text-sm">Qty: {quantity}</h2>
          </div>
          <div>
            <h1 className="font-bold">{price}</h1>
          </div>

          <button
            onClick={() => addToCart({ id, name, price })}
            className="lg:mt-2 lg:px-4 lg:py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in-out"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
