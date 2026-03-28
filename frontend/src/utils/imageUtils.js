export const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath; // Cloudinary or other full URLs
    return `http://localhost:5005${imagePath}`; // Local uploads
};
