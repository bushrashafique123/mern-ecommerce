import Products from "../models/products.js"; // Import the Products model
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary config

// Create a product
export const createProduct = async (req, res) => {
    try {
        const { title, price, categoryId, image, rating } = req.body;
        console.log("Received data:", req.body); // Log the posted data
        const userId = req.user.id; // Get userId from verified token
        
        let imageUrl = image;
        
        // Upload image to Cloudinary if provided
        if (image) {
            try {
                const result = await cloudinary.v2.uploader.upload(image, {
                    folder: "products", // Organize uploads in a folder
                    resource_type: "auto",
                });
                imageUrl = result.secure_url; // Use secure URL from Cloudinary
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ message: "Error uploading image to Cloudinary", error: uploadError.message });
            }
        }
        
        const newProduct = new Products({
            userId,
            title,
            price,
            categoryId,
            image: imageUrl,
            rating,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, categoryId, image, rating } = req.body;
        
        let imageUrl = image;
        
        // Upload image to Cloudinary if a new image is provided
        if (image && image.startsWith('data:')) {
            try {
                const result = await cloudinary.v2.uploader.upload(image, {
                    folder: "products",
                    resource_type: "auto",
                });
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ message: "Error uploading image to Cloudinary", error: uploadError.message });
            }
        }

        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            { title, price, categoryId, image: imageUrl, rating },
            { new: true }
        ).populate("categoryId", "name");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
            const userId = req.user ? req.user.id : undefined; // Get userId from verified token

        // Find product first
        const product = await Products.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check authorization
            if (product.userId && userId && product.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this product" });
        }

        // Delete image from Cloudinary if it exists
        if (product.image && product.image.includes('cloudinary')) {
            try {
                // Extract public ID from Cloudinary URL
                const publicId = product.image.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`products/${publicId}`);
            } catch (deleteError) {
                console.error("Error deleting image from Cloudinary:", deleteError);
                // Continue with product deletion even if image deletion fails
            }
        }

        // Delete the product
        const deletedProduct = await Products.findOneAndDelete({ _id: id });
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// Get a product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findById(id).populate("categoryId", "name");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Get all products
// Get all products with search, sort, and pagination
export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Build search filter
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive search on title
    }

    // Count total matching products
    const total = await Products.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Build sort object dynamically
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = {};
    sort[sortBy] = sortOrder;

    // Fetch products with pagination, sort, and populate category name
    const products = await Products.find(filter)
      .select(["title", "price", "categoryId", "image", "rating"])
      .populate("categoryId", "name")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};