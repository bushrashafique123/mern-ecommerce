import Products from "../models/products.js"; // Import the Products model
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary config
import Category from '../models/category.js'

// Create a product
export const createProduct = async (req, res) => {
    try {
      const { title, price,  image, rating,stock, categoryId } = req.body;


        console.log("Received data:", req.body); 
        const userId = req.user.id;
        
        let imageUrl = image;
        

        if (image) {
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
        
        const newProduct = new Products({
            userId,
            title,
            price,
            stock,
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

export const getProductsByCategory = async (req, res) => {
  try {
    const { name } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

  
    const category = await Category.findOne({ name });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 🔢 Total count
    const total = await Products.countDocuments({
      categoryId: category._id,
    });

    const totalPages = Math.ceil(total / limit);

 
    const products = await Products.find({
      categoryId: category._id,
    })
      .populate("categoryId", "name")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total,
      totalPages,
      page,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price,  categoryId, image,stock, rating } = req.body;

    let imageUrl = image;
    if (image && image.startsWith("data:")) {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
        resource_type: "auto",
      });
      imageUrl = result.secure_url;
    }
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        title,
        price,
        stock,
        categoryId,
        image: imageUrl,
        rating,
      },
      { new: true }
    ).populate("categoryId", "name");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
            const userId = req.user ? req.user.id : undefined; // Get userId from verified token

       
        const product = await Products.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

   
            if (product.userId && userId && product.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this product" });
        }

 
        if (product.image && product.image.includes('cloudinary')) {
            try {
                const publicId = product.image.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`products/${publicId}`);
            } catch (deleteError) {
                console.error("Error deleting image from Cloudinary:", deleteError);
            }
        }
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

export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Build search filter
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = {};
    sort[sortBy] = sortOrder;
    const products = await Products.find(filter)
      .select(["title", "price", "categoryId", "image", "rating", "stock"])
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