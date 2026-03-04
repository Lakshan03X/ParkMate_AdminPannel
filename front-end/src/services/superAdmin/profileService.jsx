import awsDynamoService from "./awsDynamoService";
import { awsconfig } from '../awsConfig';

const COLLECTION_NAME = awsconfig.usersTable;

//update admin profile details
export const updateAdminProfile = async (adminId, profileData) => {
  try {   
    if (!adminId) {
      throw new Error('Admin ID is required');
    }
    if (!profileData || Object.keys(profileData).length === 0) {
      throw new Error('Profile data is required and cannot be empty');
    }
    const updates = {};
    if (profileData.name) {
      updates.name = profileData.name;
    }
    if (profileData.email) {
        updates.email = profileData.email;

    }
       
    
    if (Object.keys(updates).length === 0) {
      throw new Error('No valid profile fields provided for update');
    }   
    await awsDynamoService.updateItem(COLLECTION_NAME, { userId: adminId }, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw new Error('Failed to update admin profile');
  }
};