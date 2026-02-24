import mongoose from 'mongoose';
import Category from '../models/category.js' ; // Assuming the model is in the models folder

// Create a new category
export let createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category', details: error.message });
    }
};

export let getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: 'i' } },
                      { description: { $regex: search, $options: 'i' } }
                  ]
              }
            : {};

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const categories = await Category.find(filter)
            .sort(sortOptions)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const total = await Category.countDocuments(filter);

        res.status(200).json({
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            categories
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};


// Get a single category by ID
export let getCategoryById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// Update a category by ID
export let updateCategory = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete a category by ID
export let deleteCategory = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
