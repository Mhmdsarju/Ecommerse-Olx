import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading } = useSelector(
    (state) => state.products
  );
  const user = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  let filteredProducts = products
    .filter(
      (p) =>
      !p.soldOut &&
      (!user || p.createdBy !== user.id) &&
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .slice();

  if (sortOrder === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOrder === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar search={search} setSearch={setSearch} />

      <div className="flex justify-end px-6 mt-6">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm"
        >
          <option value="">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {loading && <Loader />}

      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products found!!!
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
          {filteredProducts.map((p) => {
            const isOwner = user && p.createdBy === user.id;

            return (
              <div
                key={p._id}
                onClick={() => {
                  if (!isOwner) {
                    navigate(`/product/${p._id}`);
                  } else {
                    toast.error("You can't buy your own product");
                  }
                }}
                className={`bg-white rounded-xl shadow transition overflow-hidden
                  ${
                    isOwner
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer hover:shadow-lg"
                  }
                `}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-40 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">
                    {p.title}
                  </h3>

                  <p className="text-green-600 font-bold mt-1">
                    ₹ {p.price}
                  </p>

                  {p.soldOut ? (
                    <button
                      disabled
                      className="mt-3 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : isOwner ? (
                    <button
                      disabled
                      className="mt-3 w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
                    >
                      You Can't Buy Your Own Product
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart(p));
                        toast.success("Added to cart 🛒");
                      }}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
