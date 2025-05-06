import UserModel from "../models/UserModel.js";
import cloudinary from '../cloudinaryConfig/cloudinaryConfig.js';


// Get a User
export const getUserbyId = async (req, res) => {
  const id = req.params.id;

  try {
    let query = UserModel.findById(id);
    if (req.admin) {
      query = query.populate('exam').populate('subExam');
    }
    const user = await query;
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json({
        status: 200,
        message: "data found",
        data: otherDetails
      });
    } else {
      res.status(404).json({
        message: "No such User"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user",
      error: error.message
    });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    let query = UserModel.find();
    if (req.admin) {
      query = query.populate('exam').populate('subExam');
    }
    let users = await query;
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });

    res.status(200).json({
      status: 200,
      message: "user found",
      data: users
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// udpate a user
export const updateUser = async (req, res) => {
  const userId = req.params.id; // User ID from the request params
  const requestBody = req.body; // Updated user profile details

  try {
    // Retrieve the user from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    // Ensure that the update is only allowed for the authenticated user
    if (userId !== user._id.toString()) {
      return res.status(403).json({ status: 'failed', message: 'Access Denied! You can update only your own Account.' });
    }

    // Exclude the password field from the update, even if it's provided in the request
    if (requestBody.password) {
      delete requestBody.password; // Remove password field from the request body
    }

    // Update the user's profile with the provided fields
    Object.assign(user, requestBody);

    // Save the updated user profile
    const updatedUser = await user.save();

    // Generate a new JWT token with updated user details (if needed)
    // const token = jwt.sign({ username: updatedUser.username, id: updatedUser._id }, process.env.JWTKEY, { expiresIn: '1h' });

    // Respond with the updated user and token
    res.status(200).json({ status: 'success', message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ status: 'failed', message: 'Unable to update user profile' });
  }
};


export const updateUserProfilePicture = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'user_profile_pictures',
      public_id: userId,
      overwrite: true
    });

    user.profilePicture = result.secure_url;
    const updatedUser = await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ status: 'failed', message: 'Unable to update profile picture' });
  }
};

// Delete a user
export const deleteUserById = async (req, res) => {
  const userId = req.params.id; // User ID from the request parameters

  try {
    // Retrieve the user from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    await UserModel.findByIdAndDelete(userId);

    // Respond with a success message
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 'failed', message: 'Unable to delete user' });
  }
};