import mongoose from 'mongoose';

const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next();
    }
    const skipPaths = ['/login', '/register'];
    if (skipPaths.some(path => req.originalUrl.startsWith(path))) {
        return next();
    }
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    next();
};

export default validateId;
