import AppError from "../utils/AppError.js";
import {
  getUserProfileService,
  updateUserProfileService,
  changePasswordService,
  deleteUserService,
  getAllUsersService,
} from "../services/userService.js";

// GET USER PROFILE
export async function getUserProfile(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    
    const userProfile = await getUserProfileService(user_uuid);
    
    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch user profile", 500));
  }
}

// UPDATE USER PROFILE
export async function updateProfile(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    const updateData = req.body;

    const updatedUser = await updateUserProfileService(user_uuid, updateData);
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to update profile", 400));
  }
}

// CHANGE PASSWORD
export async function changePassword(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    const { currentPassword, newPassword } = req.body;

    await changePasswordService(user_uuid, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to change password", 400));
  }
}

// DELETE USER ACCOUNT
export async function deleteAccount(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    const { password } = req.body; // Confirm with password

    await deleteUserService(user_uuid, password);
    
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to delete account", 400));
  }
}

// GET ALL USERS (Admin only - if you implement roles)
export async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    
    const users = await getAllUsersService({ page, limit, role, status });
    
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch users", 500));
  }
}

// LOGOUT USER
export async function logout(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    
    // If you implement token blacklisting, add it here
    // await blacklistTokenService(req.token);
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to logout", 500));
  }
}

// GET USER DASHBOARD DATA
export async function getUserDashboard(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    
    // Get user's events and registrations summary
    const dashboardData = await getUserDashboardService(user_uuid);
    
    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch dashboard data", 500));
  }
}

// UPLOAD USER AVATAR (if you implement file uploads)
export async function uploadAvatar(req, res, next) {
    try {
        const user_uuid = req.user.user_uuid;
        const file = req.file;

        if (!file) {
            return next(new AppError("No file uploaded", 400));
        }

        const updatedUser = await updateUserProfileService(user_uuid, { file });

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(new AppError(error.message || "Failed to upload avatar", 500));
    }
}