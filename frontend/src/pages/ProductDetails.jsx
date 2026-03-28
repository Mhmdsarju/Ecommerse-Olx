import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

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

  if (!product) return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

  const isOwner = user && product.createdBy === user.id;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-28 pb-12 px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to browsing
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden backdrop-blur-xl">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-8">
            <div className="relative group bg-slate-50 p-2 lg:p-8 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 block lg:rounded-l-3xl"></div>
              <img
                src={getImageUrl(product.image)}
                alt={product.title}
                className="w-full h-full object-contain max-h-[500px] relative z-10 drop-shadow-2xl rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {product.soldOut && (
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-1.5 bg-rose-500/90 backdrop-blur-md text-white font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-rose-500/30 border border-rose-400/50">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md uppercase tracking-wider border border-slate-300">
                    Premium Listing
                  </span>
                  {isOwner && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-300">
                      Your Product
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                  {product.title}
                </h1>

                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  ₹ {product.price.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Location details
                  </h3>
                  <p className="text-slate-800 text-lg">
                    {product.location}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Verified Listing • Secure Transaction
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200">
                {!product.soldOut ? (
                  <button
                    onClick={() => {
                      if (isOwner) return;
                      dispatch(addToCart(product));
                      toast.success("Added to cart 🛒");
                      navigate("/cart");
                    }}
                    disabled={isOwner}
                    className={`w-full relative overflow-hidden group/btn font-bold py-4 rounded-xl shadow-lg transition-all duration-300 ${isOwner
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:shadow-indigo-500/50'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isOwner ? "You can't buy your own item" : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          Add to Cart
                        </>
                      )}
                    </span>
                    {!isOwner && (
                      <div className="absolute inset-0 w-full h-full bg-indigo-500 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-rose-50 text-rose-600 font-bold py-4 rounded-xl border border-rose-200 cursor-not-allowed"
                  >
                    This item is Sold Out
                  </button>
                )}

                {isOwner && !product.soldOut && (
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="mt-4 w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Edit Listing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
