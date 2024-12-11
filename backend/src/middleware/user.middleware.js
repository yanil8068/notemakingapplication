import { verifyToken } from "../utilities/jwt.js";
import User from "../models/user.model.js";

// Middleware to authenticate the user
const authentication = async (req, res, next) => {
  try {
    console.log("req.headers.authorization", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1] || null; //req.cookies.authToken;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error in authorizing the user", error: error.message });
  }
};

export { authentication };
