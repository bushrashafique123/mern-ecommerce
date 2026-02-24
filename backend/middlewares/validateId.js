import mongoose from 'mongoose';

const validateId = (req, res, next) => {
    const { id } = req.params;

    // Only validate if an `id` param is present
    if (!id) {
        return next();
    }

    // Optional: explicitly skip known routes without IDs
    const skipPaths = ['/login', '/register'];
    if (skipPaths.some(path => req.originalUrl.startsWith(path))) {
        return next();
    }

    // Validate ID format
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    next();
};

export default validateId;
