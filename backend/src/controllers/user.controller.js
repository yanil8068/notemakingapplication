import User from "../models/user.model.js";
import { createToken } from "../utilities/jwt.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    return res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials email" });
    }
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "Imvalid Credentials password" });
    }
    const token = createToken({ id: user.id }); //jwt.sign used with id secret and expires in
    res.cookie("authToken", token, {
      path: "/",
      expires: new Date(Date.now() + 3600000), // Expires in 1 hour 3600000 milliseconds
      secure: true,
      httpOnly: true, //By marking cookies as HttpOnly, you reduce the risk of XSS attacks.
      sameSite: "None", //security
    });
    return res
      .status(200)
      .send({ message: "User logged in successfully", token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error in logging the user", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    return res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).send({ message: "User logged out failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    // console.log(req.user);
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User deleted sucessfully" });
  } catch (error) {
    return res.status(500).send({ message: "User delete failed" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // `req.user` is set by the authentication middleware
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ user });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error fetching user profile", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userIdFromToken = req.user.id; // Extract the authenticated user's ID from the token
    const { userId } = req.params; // Assume the user ID to update is passed as a route parameter
    const { name, email, password } = req.body;

    // Ensure the authenticated user is updating their own profile
    if (userIdFromToken !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this profile" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Ensure hashing is handled in the model's pre-save hook

    await user.save(); // Save the updated user

    return res.status(200).send({
      message: "User profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error updating user profile", error: error.message });
  }
};

export {
  register,
  login,
  logout,
  deleteUser,
  getUserProfile,
  updateUserProfile,
};
