const jwt = require("jsonwebtoken");
const User = require("../../models/user");
User;
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};

module.exports = authenticateToken;
