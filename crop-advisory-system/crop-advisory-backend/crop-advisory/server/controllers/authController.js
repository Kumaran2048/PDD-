const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendRealTimeEmail, sendRealTimeSMS } = require("../utils/notificationService");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ── @POST /api/auth/register ─────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, district, state } = req.body;
    const { SUPPORTED_REGIONS, LANGUAGE_MAP } = require("../utils/constants");

    // Check if state is supported
    if (!SUPPORTED_REGIONS[state]) {
      return res.status(400).json({ 
        message: "Service currently available only in selected states: Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana, Maharashtra" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Determine preferred language based on state
    const preferredLanguage = LANGUAGE_MAP[state] || "English";

    // Create new user (password auto-hashed in model)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "farmer",
      district,
      state,
      preferredLanguage
    });

    // Send real-time welcome notifications
    sendRealTimeEmail(
      user.email,
      "Welcome to CropAdvisor!",
      `Hello ${user.name},\n\nWelcome to CropAdvisor - Smart farming for every field! Your account as a ${user.role} has been created successfully.`
    );
    if (user.phone) {
      sendRealTimeSMS(
        user.phone,
        `Hello ${user.name}, Welcome to CropAdvisor! Your registration as ${user.role} is successful.`
      );
    }

    // Return user data + token
    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        state: user.state,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ── @POST /api/auth/login ────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated. Contact admin." });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`Login successful for: ${email}`);

    // Return user data + token
    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        state: user.state,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ── @GET /api/auth/me ────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};

// ── @PUT /api/auth/change-password ──────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save hash

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

// ── @PUT /api/auth/profile ──────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// ── @POST /api/auth/send-otp ─────────────────────────────────────
const sendOTP = async (req, res) => {
  try {
    const { phoneOrEmail } = req.body;
    if (!phoneOrEmail) {
      return res.status(400).json({ message: "Please provide registered phone number or email" });
    }

    // Find user by phone or email
    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { phone: phoneOrEmail },
          { email: phoneOrEmail }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "No registered account found with this phone number or email" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated. Contact admin." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send via email & SMS
    await sendRealTimeEmail(
      user.email,
      "CropAdvisor OTP Code",
      `Your verification code is: ${otp}. It is valid for 5 minutes.`
    );
    if (user.phone) {
      await sendRealTimeSMS(
        user.phone,
        `Your CropAdvisor verification OTP is: ${otp}. Valid for 5 minutes.`
      );
    }

    res.json({ message: "OTP sent successfully to registered mobile and email", phone: user.phone });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ── @POST /api/auth/login-otp ────────────────────────────────────
const loginOTP = async (req, res) => {
  try {
    const { phoneOrEmail, otp } = req.body;
    if (!phoneOrEmail || !otp) {
      return res.status(400).json({ message: "Please provide phone number/email and OTP" });
    }

    // Find user
    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { phone: phoneOrEmail },
          { email: phoneOrEmail }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated. Contact admin." });
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        state: user.state,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { register, login, getMe, changePassword, updateProfile, sendOTP, loginOTP };
