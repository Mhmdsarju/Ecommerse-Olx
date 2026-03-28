import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getImageUrl } from "../utils/imageUtils";

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
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-28 pb-12 px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              My Listings
            </h1>
            <p className="text-slate-500">Manage your active products and sales history.</p>
          </div>

          <button
            onClick={() => navigate('/sell')}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Post New Ad
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {myProducts.map((p) => (
            <div
              key={p._id}
              className={`group bg-white p-5 rounded-2xl border ${p.soldOut ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-indigo-300 hover:shadow-indigo-500/10'} shadow-md transition-all duration-300 relative`}
            >
              <div className="relative overflow-hidden aspect-[4/3] rounded-xl mb-4">
                {p.soldOut && (
                  <div className="absolute inset-x-0 top-0 z-20 flex justify-center mt-3">
                    <span className="bg-rose-500/90 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider shadow border border-rose-400/50">
                      Sold Out
                    </span>
                  </div>
                )}

                <img
                  src={getImageUrl(p.image)}
                  alt={p.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {!p.soldOut && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60"></div>
                )}
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-1 truncate">{p.title}</h3>
              <p className="text-emerald-600 font-extrabold text-xl mb-4">
                ₹ {p.price.toLocaleString("en-IN")}
              </p>

              {!p.soldOut ? (
                <button
                  onClick={() =>
                    navigate(`/edit-product/${p._id}`)
                  }
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 hover:border-amber-300 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  Edit Details
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-100/80 text-slate-400 py-2.5 rounded-xl font-semibold border border-slate-200 cursor-not-allowed"
                >
                  Listing Closed
                </button>
              )}
            </div>
          ))}
        </div>

        {myProducts.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-slate-100 flex items-center justify-center rounded-full mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Active Listings</h2>
            <p className="text-slate-500 max-w-md mb-8">You haven't posted any products for sale yet. Turn your unused items into cash today!</p>
            <button
              onClick={() => navigate('/sell')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Create Your First Ad
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProducts;
