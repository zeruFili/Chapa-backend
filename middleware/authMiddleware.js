const jwt = require("jsonwebtoken");
const User = require("../models/User_Model.js");

const protect = async (req, res, next) => {
	try {
		
		const accessToken = req.cookies.accessToken;
		

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

		

			// Attach user information to req.user
			req.user = {
				_id: user._id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				phone_number: user.phone_number,
				role: user.role, // Include the role here
			};

			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

const adminValidator = (req, res, next) => {
	
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};

module.exports = {
	protect,
	adminValidator,
};