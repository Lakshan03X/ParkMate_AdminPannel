// vehicleOwnerService.js - Vehicle Owner CRUD operations 
import awsDynamoService from './awsDynamoService';
import { awsConfig } from '../awsConfig';

const COLLECTION_NAME = awsConfig.usersTable;

class VehicleOwnerService {
  /**
   * Get all vehicle owners from DynamoDB
   */
  async getAllOwners() {
    try {
      const result = await awsDynamoService.scan(COLLECTION_NAME);

      // Filter only vehicle owners (userType === 'vehicle_owner')
      const ownerItems = (result.items || []).filter(
        (item) => item.userType === 'vehicle_owner'
      );

      const owners = ownerItems.map((data) => ({
        id: data.id || data.vehicleOwnerId,
        userId: data.userId,
        name: data.name,
        mobileNumber: data.mobileNumber,
        status: data.status || 'online',
        nicNumber: data.nicNumber,
        email: data.email || '',
        registeredDate: data.registeredDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }));

      // Sort desc by createdAt
      owners.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      console.log('Owners fetched:', owners);
      return owners;
    } catch (error) {
      console.error('Error getting vehicle owners:', error);
      throw new Error('Failed to fetch vehicle owners');
    }
  }

  /**
   * Update an existing vehicle owner
   */
  async updateOwner(ownerId, updates) {
    try {
      await awsDynamoService.updateItem(
        COLLECTION_NAME,
        { userId: ownerId },
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error updating vehicle owner:', error);
      throw new Error('Failed to update vehicle owner');
    }
  }

  /**
   * Delete a vehicle owner
   */
  async deleteOwner(ownerId) {
    try {
      await awsDynamoService.deleteItem(COLLECTION_NAME, { userId: ownerId });
    } catch (error) {
      console.error('Error deleting vehicle owner:', error);
      throw new Error('Failed to delete vehicle owner');
    }
  }

  /**
   * Search owners by name or mobile number
   */
  async searchOwners(searchTerm) {
    try {
      const allOwners = await this.getAllOwners();

      if (!searchTerm || searchTerm.trim() === '') {
        return allOwners;
      }

      const searchLower = searchTerm.toLowerCase();
      
      return allOwners.filter(
        (owner) =>
          owner.name.toLowerCase().includes(searchLower) ||
          owner.mobileNumber.includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching vehicle owners:', error);
      throw new Error('Failed to search vehicle owners');
    }
  }

  /**
   * Get owners by status
   */
  async getOwnersByStatus(status) {
    try {
      const allOwners = await this.getAllOwners();

      return allOwners.filter((owner) => owner.status === status);
    } catch (error) {
      console.error('Error getting owners by status:', error);
      throw new Error('Failed to fetch owners by status');
    }
  }

  /**
   * Get owner by NIC number
   */
  async getOwnerByNIC(nicNumber) {
    try {
      const allOwners = await this.getAllOwners();

      return allOwners.find((owner) => owner.nicNumber === nicNumber) || null;
    } catch (error) {
      console.error('Error getting owner by NIC:', error);
      throw new Error('Failed to fetch owner by NIC');
    }
  }
}

export default new VehicleOwnerService();