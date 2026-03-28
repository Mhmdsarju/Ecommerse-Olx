import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

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
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-indigo-500/30">
      <Navbar search={search} setSearch={setSearch} />

      <main className="max-w-7xl mx-auto pt-28 pb-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
              Discover Quality
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Premium products from trusted sellers around you.</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none pl-11 pr-10 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm cursor-pointer hover:border-indigo-400 transition-colors w-full md:w-auto"
            >
              <option value="">Sort by Price</option>
              <option value="low">Lowest Price First</option>
              <option value="high">Highest Price First</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Fake Ad Banner 1 */}
        <div className="w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 rounded-2xl border border-indigo-200 overflow-hidden mb-10 shadow-lg relative shadow-indigo-100 flex flex-col sm:flex-row items-center justify-between p-6 sm:p-10">
          <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full border border-rose-200 uppercase tracking-widest mb-3">Sponsored</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 mb-2">Upgrade to Premium Seller</h2>
            <p className="text-indigo-700 max-w-md text-sm sm:text-base">Get your products featured on the homepage and reach 10x more buyers instantly.</p>
          </div>
          <button className="relative z-10 bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all">
            Learn More
          </button>
          {/* Abstract decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 blur-3xl rounded-full opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500 blur-3xl rounded-full opacity-20 pointer-events-none"></div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        )}

        {
          !loading && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your search criteria or explore other categories.</p>
            </div>
          )
        }

        {
          !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                    className={`group bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all duration-300
                    ${isOwner
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:shadow-indigo-500/10 hover:border-indigo-200 hover:-translate-y-1.5"
                      }
                  `}
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10 uppercase tracking-wider shadow-lg">
                          {p.location || "Online"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {p.title}
                      </h3>

                      <div className="flex items-center justify-between mt-2 mb-4">
                        <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                          ₹{p.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {p.soldOut ? (
                        <button
                          disabled
                          className="w-full bg-slate-100 text-slate-400 font-semibold py-3 rounded-xl border border-slate-200 cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : isOwner ? (
                        <button
                          disabled
                          className="w-full bg-rose-50/80 text-rose-500/70 font-semibold py-3 rounded-xl border border-rose-200/50 cursor-not-allowed text-sm"
                        >
                          Your Listing
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addToCart(p));
                            toast.success("Added to cart 🛒");
                          }}
                          className="relative w-full overflow-hidden group/btn bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Add to Cart
                          </span>
                          <div className="absolute inset-0 w-full h-full bg-indigo-500 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }

        {/* Fake Ad Banner 2 */}
        {!loading && (
          <div className="w-full mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch min-h-[160px] relative group hover:border-slate-300 transition-colors cursor-pointer">
            <div className="w-full md:w-1/3 bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550005973-b4e528acdf61?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent"></div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 z-10 tracking-widest uppercase transform -skew-x-12">Flash Sale</span>
            </div>
            <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col justify-center relative">
              <span className="absolute top-4 right-4 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Advertisement</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-500 transition-colors">Weekend Electronics Clearance!</h3>
              <p className="text-slate-500 text-sm mb-4">Up to 40% off on second-hand laptops, phones, and accessories. Limited time offer.</p>
              <div className="flex gap-4 items-center">
                <span className="text-sm text-amber-600 font-bold group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1">
                  Shop Deals Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
