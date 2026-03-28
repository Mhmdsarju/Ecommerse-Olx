import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProductInDB } from "../redux/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { getImageUrl } from "../utils/imageUtils";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [preview, setPreview] = useState(null);

  const imageFile = watch("image");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);

        if (res.data.soldOut) {
          toast.error("Sold products cannot be edited", { style: { background: "#ffffff", color: "#0f172a" } });
          navigate("/my-products", { replace: true });
          return;
        }

        setValue("title", res.data.title);
        setValue("price", res.data.price);
        setValue("location", res.data.location);
        setPreview(getImageUrl(res.data.image));
        setSoldOut(res.data.soldOut);
        setPageLoading(false);
      } catch {
        toast.error("Failed to load product", { style: { background: "#ffffff", color: "#0f172a" } });
        navigate("/my-products", { replace: true });
      }
    };

    fetchProduct();
  }, [id, navigate, setValue]);

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      setPreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile]);

  const onSubmit = (data) => {
    if (soldOut) return;

    setBtnLoading(true);

    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("price", data.price);
    fd.append("location", data.location);
    if (data.image?.[0]) fd.append("image", data.image[0]);

    dispatch(updateProductInDB({ id, data: fd })).then((res) => {
      setBtnLoading(false);

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Listing updated successfully ✨", {
          style: { background: "#ffffff", color: "#0f172a" },
          iconTheme: { primary: "#f59e0b", secondary: "#ffffff" }
        });
        navigate("/my-products", { replace: true });
      } else {
        toast.error("Update failed", { style: { background: "#ffffff", color: "#0f172a" } });
      }
    });
  };

  if (pageLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 pt-28 pb-12 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-2">
                Edit Listing
              </h1>
              <p className="text-slate-500 text-lg">Update the details of your posted ad.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:border-slate-400 shadow-sm transition-all text-sm font-medium"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 space-y-6"
          >
            {preview && (
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group mb-8">
                <img
                  src={preview}
                  alt="Current Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 text-xs font-bold text-white bg-black/50 backdrop-blur-md rounded uppercase tracking-wider border border-white/10">Active Image</span>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ad Title
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </div>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter updated title"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder-slate-400"
                  />
                </div>
                {errors.title && <p className="text-rose-400 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price (₹)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 group-focus-within:text-amber-500 transition-colors font-bold text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    {...register("price", { required: "Price is required" })}
                    placeholder="Enter updated price"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder-slate-400"
                  />
                </div>
                {errors.price && <p className="text-rose-400 text-sm mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location / Region
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <input
                    {...register("location", { required: "Location is required" })}
                    placeholder="Update location details"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder-slate-400"
                  />
                </div>
                {errors.location && <p className="text-rose-400 text-sm mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Update Image (optional)
                </label>
                <div className="mt-1">
                  <label className="relative flex items-center justify-center w-full px-6 py-4 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:border-amber-500 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-amber-600">Click to choose a new image...</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      {...register("image")}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <button
                disabled={btnLoading}
                className="w-full relative overflow-hidden group/btn font-bold py-4 rounded-xl shadow-lg transition-all duration-300 bg-amber-600 text-white shadow-amber-600/30 hover:shadow-amber-500/50 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {btnLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Update Product Details
                    </>
                  )}
                </div>
                {!btnLoading && (
                  <div className="absolute inset-0 w-full h-full bg-amber-500 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
