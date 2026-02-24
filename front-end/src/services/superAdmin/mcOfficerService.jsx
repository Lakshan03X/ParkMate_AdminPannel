// mcOfficerService.js - Municipal Council Officer CRUD operations 
import awsDynamoService from './awsDynamoService';
import { awsConfig } from '../awsConfig';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = awsConfig.usersTable;
const SALT_ROUNDS = 10;

class MCOfficerService {
  /**
    Generate unique officer ID 
   */
  async generateOfficerId() {
    try {
      const allOfficers = await this.getAllOfficers();
      
      // Find highest officer number
      let maxNumber = 0;
      allOfficers.forEach((officer) => {
        if (officer.officerId) {
          const match = officer.officerId.match(/MCC(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        }
      });

      // Generate next ID
      const nextNumber = maxNumber + 1;
      return `MCC${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating officer ID:', error);
      // Fallback to timestamp-based ID
      return `MCC${Date.now().toString().slice(-6)}`;
    }
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
    Get all MC Officers from DynamoDB
   */
  async getAllOfficers() {
    try {
      const result = await awsDynamoService.scan(COLLECTION_NAME);

      // Filter only MC officers (userType === 'mc_officer')
      const officerItems = (result.items || []).filter(
        (item) => item.userType === 'mc_officer'
      );

      const officers = officerItems.map((data) => ({
        id: data.id,
        userId: data.userId,
        name: data.name,
        mobileNumber: data.mobileNumber,
        status: data.status || 'online',
        email: data.email,
        officerId: data.officerId,
        registeredDate: data.registeredDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        selectedCouncil: data.selectedCouncil,
        councilId: data.councilId,
        scheduleStartDate: data.scheduleStartDate,
        scheduleEndDate: data.scheduleEndDate,
        scheduleStartTime: data.scheduleStartTime,
        scheduleEndTime: data.scheduleEndTime,
      }));

      // Sort desc by createdAt
      officers.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      return officers;
    } catch (error) {
      console.error('Error getting MC officers:', error);
      throw new Error('Failed to fetch MC officers');
    }
  }

  /**
    Add a new MC Officer
   */
  async addOfficer(officerData) {
    try {
      const id = `OFFICER_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const officerId = await this.generateOfficerId();

      // Hash password
      const hashedPassword = await this.hashPassword(officerData.password);

      const newOfficer = {
        userId: id, // DynamoDB partition key
        id,
        officerId,
        ...officerData,
        password: hashedPassword,
        userType: 'mc_officer', // Identify as MC officer
        status: officerData.status || 'online',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await awsDynamoService.putItem(COLLECTION_NAME, newOfficer);

      return newOfficer;
    } catch (error) {
      console.error('Error adding MC officer:', error);
      throw new Error('Failed to add MC officer');
    }
  }

  /**
    Update an existing MC Officer (cannot update password)
   */
  async updateOfficer(officerId, updates) {
    try {
      // Remove password from updates if present
      //i am channged add _ for pass and remove lint is have error remove  _
      const { _password, ...safeUpdates } = updates;

      await awsDynamoService.updateItem(
        COLLECTION_NAME,
        { userId: officerId },
        {
          ...safeUpdates,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error updating MC officer:', error);
      throw new Error('Failed to update MC officer');
    }
  }

//delete officer by userId
  async deleteOfficer(officerId) {
    try {
      await awsDynamoService.deleteItem(COLLECTION_NAME, { userId: officerId });
    } catch (error) {
      console.error('Error deleting MC officer:', error);
      throw new Error('Failed to delete MC officer');
    }
  }

 
 //Search MC Officers by name or mobile number
 
  async searchOfficers(searchTerm) {
    try {
      const allOfficers = await this.getAllOfficers();

      if (!searchTerm || searchTerm.trim() === '') {
        return allOfficers;
      }

      const searchLower = searchTerm.toLowerCase();

      return allOfficers.filter(
        (officer) =>
          officer.name.toLowerCase().includes(searchLower) ||
          officer.mobileNumber.includes(searchTerm) ||
          (officer.email && officer.email.toLowerCase().includes(searchLower)) ||
          (officer.officerId && officer.officerId.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching MC officers:', error);
      throw new Error('Failed to search MC officers');
    }
  }

  /**
   Get MC Officers by status
   */
  async getOfficersByStatus(status) {
    try {
      const allOfficers = await this.getAllOfficers();
      return allOfficers.filter((officer) => officer.status === status);
    } catch (error) {
      console.error('Error getting MC officers by status:', error);
      throw new Error('Failed to fetch MC officers by status');
    }
  }
}

export default new MCOfficerService();