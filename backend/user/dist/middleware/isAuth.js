import jwt, {} from 'jsonwebtoken';
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Please login - No auth header provided' });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'JWT secret is not configured' });
            return;
        }
        // Here you would typically verify the token (e.g., using JWT)
        // For now, we'll just simulate a successful verification
        // In a real application, you would use a library like jsonwebtoken
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded as IUser;
        const decodedValue = jwt.verify(token, jwtSecret);
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        req.user = decodedValue.user;
        next();
        return;
    }
    catch (error) {
        res.status(401).json({ message: 'Please login - JWT Error' });
        return;
    }
};
//# sourceMappingURL=isAuth.js.map