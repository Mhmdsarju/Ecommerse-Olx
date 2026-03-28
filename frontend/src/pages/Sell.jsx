import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToDB } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { productSchema } from "../schema/productSchema";
import Navbar from "../components/Navbar";

const Sell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.products);

  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data) => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("price", data.price);
    fd.append("location", data.location);
    fd.append("image", data.image);

    dispatch(addProductToDB(fd)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Ad published successfully!", {
          style: { background: "#ffffff", color: "#0f172a" },
          iconTheme: { primary: "#10b981", secondary: "#ffffff" }
        });
        navigate("/home", { replace: true });
      } else {
        toast.error("Failed to publish ad", {
          style: { background: "#ffffff", color: "#0f172a" }
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 pt-28 pb-12 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">
              Sell Your Item
            </h1>
            <p className="text-slate-500 text-lg">Post an ad and start earning today.</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 space-y-6"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ad Title
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </div>
                  <input
                    {...register("title")}
                    placeholder="E.g. iPhone 13 Pro Max - 256GB"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-400"
                  />
                </div>
                {errors.title && (
                  <p className="text-rose-400 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price (₹)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 group-focus-within:text-emerald-500 transition-colors font-bold text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    {...register("price")}
                    placeholder="Enter your expected price"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-400"
                  />
                </div>
                {errors.price && (
                  <p className="text-rose-400 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location / Region
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <input
                    {...register("location")}
                    placeholder="E.g. Bangalore, India"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-400"
                  />
                </div>
                {errors.location && (
                  <p className="text-rose-400 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Image
                </label>

                <div className="mt-2 flex items-center gap-6">
                  <label className="relative flex flex-col items-center justify-center w-full sm:w-auto px-6 py-6 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-slate-50 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <svg className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <p className="text-sm font-medium text-slate-600 group-hover:text-emerald-600">Click to upload image</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setValue("image", file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>

                  {preview && (
                    <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 shadow-lg">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm bg-black/30 px-2 py-1 rounded">Preview</span>
                      </div>
                    </div>
                  )}
                </div>

                {errors.image && (
                  <p className="text-rose-400 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                disabled={loading}
                className="w-full relative overflow-hidden group/btn font-bold py-4 rounded-xl shadow-lg transition-all duration-300 bg-emerald-600 text-white shadow-emerald-600/30 hover:shadow-emerald-500/50 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing Ad...
                    </>
                  ) : (
                    <>
                      Post Now
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </div>
                {!loading && (
                  <div className="absolute inset-0 w-full h-full bg-emerald-500 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default Sell;
