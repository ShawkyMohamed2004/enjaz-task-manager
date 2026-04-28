const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const authModel = require("../Models/Model");
const dataModel = require("../Models/DataModel");
const emailService = require("../Utils/emailService");

// --- Auth Controllers ---

// Sign Up
exports.signup = async (req, res) => {
  const { userName, email, password } = req.body;
  const normalizedEmail = email ? email.toLowerCase() : "";
  try {
    const user = await authModel.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(409).json({ message: "Account already exists, please log in" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newAuth = new authModel({
      userName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await newAuth.save();
    
    // Send welcome email asynchronously
    emailService.sendWelcomeEmail(savedUser.email, savedUser.userName).catch(e => console.error("Welcome email error:", e));
    
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Local Login
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
    req.logIn(user, async (err) => {
      if (err) return next(err);
      
      // Handle First Login Logic
      if (user.isFirstLogin) {
        user.isFirstLogin = false;
        await user.save();
      } else {
        // Get device info from headers
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        // Send login alert asynchronously
        emailService.sendNewLoginAlert(user.email, user.userName, userAgent).catch(e => console.error("Login alert error:", e));
      }

      return res.json({ success: true, message: "successfully logged in" });
    });
  })(req, res, next);
};

// Social Placeholders (Handled in routes mostly, but logic here if needed)
exports.socialPlaceholder = (req, res) => {
  const { provider } = req.query; // Or passed from route
  res.redirect(`${process.env.FRONTEND_DOMAIN}/?provider=${provider}&status=coming-soon`);
};

// Firebase Auth Sync
exports.firebaseAuth = async (req, res) => {
  const { email, name, picUrl, googleId } = req.body;
  const normalizedEmail = email ? email.toLowerCase() : "";
  try {
    let user = await authModel.findOne({ email: normalizedEmail });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await new authModel({
        userName: name,
        email: normalizedEmail,
        googleId: googleId,
        picUrl: picUrl
      }).save();
    } else {
      // Sync latest info from Google
      let isUpdated = false;
      if (picUrl && user.picUrl !== picUrl) {
        user.picUrl = picUrl;
        isUpdated = true;
      }
      if (googleId && user.googleId !== googleId) {
        user.googleId = googleId;
        isUpdated = true;
      }
      if (isUpdated) {
        await user.save();
      }
    }
    
    req.login(user, async (err) => {
      if (err) return res.json({ success: false, message: "Session login failed" });

      if (isNewUser) {
        emailService.sendWelcomeEmail(user.email, user.userName).catch(e => console.error("Welcome email error:", e));
      } 
      
      if (user.isFirstLogin) {
        user.isFirstLogin = false;
        await user.save();
      } else if (!isNewUser) {
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        emailService.sendNewLoginAlert(user.email, user.userName, userAgent).catch(e => console.error("Login alert error:", e));
      }

      res.json({ success: true, user });
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error during firebase linking" });
  }
};

// Logout
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    req.logOut((err) => {
      if (err) res.send(err);
      else res.json({ success: true, message: "Logged out successfully" });
    });
  });
};

// Get Current User
exports.getUser = (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
};

// --- Password Reset Controllers ---

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email ? email.toLowerCase() : "";
  try {
    const user = await authModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({ Status: "Email not registered. Please sign up." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
    const resetLink = `${process.env.FRONTEND_DOMAIN}/ResetPass/${user._id}/${token}`;
    
    console.log("------------------------------------------");
    console.log("PASSWORD RESET REQUEST");
    console.log(`User: ${normalizedEmail}`);
    console.log(`Link: ${resetLink}`);
    console.log("------------------------------------------");

    await emailService.sendPasswordResetEmail(normalizedEmail, resetLink);
    return res.json({ Status: "success" });

  } catch (err) {
    console.error("Forgot Password Controller Error:", err);
    res.status(500).json({ Status: "Server error", Error: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, encode) => {
    if (err) return res.send({ Status: "Try again after few minutes" });
    
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const user = await authModel.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
      
      if (user) {
        await emailService.sendPasswordChangeConfirmation(user.email, user.userName)
          .catch(e => console.error("Confirmation Email Error:", e));
        res.send({ Status: "success" });
      } else {
        res.send({ Status: "User not found" });
      }
    } catch (err) {
      res.send({ Status: err.message });
    }
  });
};

// --- Profile Controllers ---

// Edit Profile (Name)
exports.editProfile = async (req, res) => {
  const { newName } = req.body;
  if (!newName) return res.status(400).send("Name required");
  try {
     await authModel.findByIdAndUpdate(req.user._id, { userName: newName });
     res.json({ success: true, newName });
   } catch (err) {
     res.status(500).send("Error updating");
   }
};

// Update Full Profile
exports.updateFullProfile = async (req, res) => {
  const { userName, email, picUrl, oldPassword, newPassword } = req.body;
  const normalizedEmail = email ? email.toLowerCase() : undefined;
  try {
     const user = await authModel.findById(req.user._id);
     if (!user) return res.status(404).send("User not found");

     let updates = { userName, email: normalizedEmail || user.email, picUrl };

     if (newPassword && newPassword.trim() !== "") {
       if (!oldPassword) return res.json({ success: false, message: "Please provide your current password" });
       const isValid = await bcrypt.compare(oldPassword, user.password);
       if (!isValid) return res.json({ success: false, message: "Incorrect current password" });
       
       const salt = await bcrypt.genSalt(10);
       updates.password = await bcrypt.hash(newPassword, salt);
     }

     await authModel.findByIdAndUpdate(req.user._id, updates);
     res.json({ success: true, message: "Profile updated" });
   } catch (err) {
     res.status(500).send("Error updating");
   }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.user._id;

  try {
    const user = await authModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // For OAuth users (no password)
    if (!user.password && user.providerId) {
      // Allow deletion without password if it's a social login
    } else {
      // Normal users must provide a password
      if (!password) {
        return res.status(400).json({ success: false, message: "Password is required to delete your account" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
    }

    // Delete user from auth database
    await authModel.findByIdAndDelete(userId);
    // Delete user's data (tasks, notes, todos) from data database
    await dataModel.findByIdAndDelete(userId);

    // Destroy session and cookies
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Server error during account deletion" });
  }
};

// Update Notification Settings
exports.updateNotifSettings = async (req, res) => {
  const { dailyReminders, reminderTime } = req.body;
  const userId = req.user ? req.user._id : null;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  
  try {
    const updateData = {};
    if (dailyReminders !== undefined) updateData.dailyReminders = dailyReminders;
    if (reminderTime !== undefined) updateData.reminderTime = reminderTime;
    
    await authModel.findByIdAndUpdate(userId, updateData);
    
    res.status(200).json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};
