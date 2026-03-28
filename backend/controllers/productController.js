import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, price, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = await Product.create({
      title,
      price,
      location,
      image: imageUrl,
      createdBy: req.user.id,
      soldOut: false,
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Error adding product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (product.soldOut) {
      return res
        .status(400)
        .json({ message: "Sold product cannot be edited" });
    }

    const { title, price, location } = req.body;

    product.title = title;
    product.price = price;
    product.location = location;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.status(200).json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

export const checkoutProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        message: "productIds must be a non-empty array",
      });
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { soldOut: true } }
    );

    res.status(200).json({
      message: "Checkout success",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      message: "Checkout failed",
    });
  }
};
