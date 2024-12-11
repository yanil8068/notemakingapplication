import jwt from "jsonwebtoken";

// Function to create a JSON Web Token
const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// Function to verify a JSON Web Token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export { createToken, verifyToken };
