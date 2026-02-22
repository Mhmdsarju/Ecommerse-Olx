import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import api from "../api/axios";



const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <Loader />;

  const isOwner = user && product.createdBy === user.id;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg grid md:grid-cols-2 gap-10">
   
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="h-[420px] w-full object-cover rounded-xl"
          />
        </div>


        <div className="space-y-6">

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Product Name
            </p>
            <h1 className="text-4xl font-extrabold text-gray-800">
              {product.title}
            </h1>
          </div>

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Price
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              ₹ {product.price}
            </h2>
          </div>

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Description
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              {product.location}
            </p>
          </div>

          {!product.soldOut ? (
            <button
              onClick={() => {
                dispatch(addToCart(product));
                toast.success("Added to cart 🛒");
                navigate("/cart");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
            >
              Sold Out
            </button>
          )}

          {isOwner && !product.soldOut && (
            <button
              onClick={() => navigate(`/edit-product/${product._id}`)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Edit Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
