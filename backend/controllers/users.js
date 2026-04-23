import Users from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendmails.js";
import crypto from 'crypto';


export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;

    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // ✅ string
    console.log("🔐 OTP for", email, "is:", otp);
    // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
const otpExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      otp,
      otpExpiry,
      status: "pending"
    });

    await newUser.save();

  const emailSent = await sendMail(email, otp);

if (!emailSent) {
  console.log("⚠ Email failed, but continuing...");
}

await newUser.save();
console.log("✅ USER SAVED:", newUser);
res.status(201).json({
  message: "User created successfully",
});

  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Compare OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

const { password: _, ...userWithoutPassword } = user.toObject();

res.status(200).json({
  message: "Login successful",
  token,
  user: userWithoutPassword
});
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error: error.message });
  }
  


};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    try {
        const user = req.user; // Provided by token middleware

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found in request" });
        }

        const isMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isMatched) {
            return res.status(401).json({ message: "Invalid old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;

    // Build search filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },  // case-insensitive
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate total count
    const total = await Users.countDocuments(filter);

    // Fetch users with pagination & sorting
    const users = await Users.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      users,
      total,
      totalPages: Math.ceil(total / limit),
      page: Number(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, role } = req.body;

    // Only admins can change role
    if (role && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (role) {
      if (!['user','admin','moderator'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
      user.role = role;
    }

    await user.save();
    const { password, ...u } = user.toObject();
    res.status(200).json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admins can delete; prevent self-delete
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    if (req.user.id === id) return res.status(400).json({ message: 'Cannot delete yourself' });

    const deleted = await Users.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    // optional: log deletion
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await Users.findOne({ email });
        // Always return success to avoid email enumeration
        if (!user) return res.status(200).json({ message: 'If an account exists, an OTP was sent' });

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        console.log("🔐 Password Reset OTP for", email, "is:", otp);
        
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // send OTP email
        await sendMail(email, otp);

        return res.status(200).json({ message: 'If an account exists, an OTP was sent' });
    } catch (err) {
        return res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) return res.status(400).json({ message: 'All fields are required' });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};


export const deleteOwnAccount = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { password } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (!password) return res.status(400).json({ message: 'Password is required' });

        const user = await Users.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) return res.status(401).json({ message: 'Invalid password' });

        // Perform deletion. Consider soft-delete in production.
        await Users.findByIdAndDelete(userId);

        // Optionally: revoke tokens / clear sessions here

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting account', error: err.message });
    }
};