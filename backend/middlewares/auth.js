import jwt from "jsonwebtoken";

export let verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader);
        
        if (!authHeader) {
            console.log('No auth header provided');
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log('Invalid token format');
            return res.status(401).json({ message: "Invalid token format" });
        }

        console.log('Verifying token...');
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('Token verification failed:', err.message);
                return res.status(401).json({ 
                    auth: false, 
                    message: "Failed to authenticate token" 
                });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.log('Auth middleware error:', error.message);
        return res.status(500).json({ message: "Server error in auth" });
    }
}

export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not found in token" });
            }

            if (req.user.role !== "admin") {
                return res.status(403).json({ 
                    message: "Admin access required" 
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Server error checking admin" });
        }
    });
};
