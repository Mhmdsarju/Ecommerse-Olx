import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const myProducts = items.filter(
    (p) => p.createdBy === user.id
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {myProducts.map((p) => (
          <div
            key={p._id}
            className={`bg-white p-4 rounded-xl shadow relative ${
              p.soldOut ? "opacity-70" : ""
            }`}
          >
            {p.soldOut && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                SOLD OUT
              </span>
            )}

            <img
              src={p.image}
              alt={p.title}
              className="h-40 w-full object-cover rounded-lg"
            />

            <h3 className="font-bold mt-3 text-lg">{p.title}</h3>
            <p className="text-green-600 font-bold text-lg">
              ₹ {p.price}
            </p>

            {!p.soldOut && (
              <button
                onClick={() =>
                  navigate(`/edit-product/${p._id}`, { replace: true })
                }
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Edit
              </button>
            )}
          </div>
        ))}

        {myProducts.length === 0 && (
          <p className="text-gray-500 col-span-full text-center text-lg">
            You haven’t listed any products yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
