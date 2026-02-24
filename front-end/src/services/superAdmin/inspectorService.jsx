// Parking Inspector CRUD operations
import awsDynamoService from './awsDynamoService';
import { awsConfig } from '../awsConfig';

const COLLECTION_NAME = awsConfig.usersTable;

/**
 * Generate auto increment inspector ID 
 */
const generateInspectorId = async () => {
  // Get all inspectors
  const result = await awsDynamoService.scan(COLLECTION_NAME);

  const inspectorItems = (result.items || []).filter(
    (item) => item.userType === 'inspector' && item.inspectorId
  );

  if (inspectorItems.length === 0) {
    return 'Ins0001';
  }

  // Extract numeric part
  const numbers = inspectorItems.map((item) => {
    const num = parseInt(item.inspectorId.replace('Ins', ''), 10);
    return isNaN(num) ? 0 : num;
  });

  const maxNumber = Math.max(...numbers);
  const nextNumber = maxNumber + 1;

  return `Ins${nextNumber.toString().padStart(4, '0')}`;
};


class InspectorService {
  /**
   * Get all parking inspectors from DynamoDB
   */
  async getAllInspectors() {
    try {
      const result = await awsDynamoService.scan(COLLECTION_NAME);

      // Filter only inspectors (userType === 'inspector')
      const inspectorItems = (result.items || []).filter(
        (item) => item.userType === 'inspector'
      );

      const inspectors = inspectorItems.map((item) => ({
        id: item.id || item.inspectorId || item.userId || generateInspectorId(),
        userId: item.userId,
        inspectorId: item.inspectorId,
        name: item.name,
        email: item.email || '',
        mobileNumber: item.mobileNumber,
        status: item.status || 'online',
        municipalCouncil: item.municipalCouncil,
        assignedZone: item.assignedZone,
        isAssigned: item.isAssigned || false,
        registeredDate: item.registeredDate,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      // Sort desc by createdAt
      inspectors.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      console.log('Inspectors fetched successfully:', inspectors.length);
      return inspectors;
    } catch (error) {
      console.error('Error getting inspectors:', error);
      throw new Error('Failed to fetch inspectors');
    }
  }

  /**
   * Add a new inspector with hashed password
    
   */
  async addInspector(inspectorData) {
    try {
      const inspectorId = inspectorData.inspectorId || await generateInspectorId();


      const newInspector = {
        userId: inspectorId, 
        id: inspectorId,
        inspectorId,
        name: inspectorData.name,
        email: inspectorData.email,
        mobileNumber: inspectorData.mobileNumber,
        password: inspectorData.password, // Should already be hashed
        userType: 'inspector', // Identify as inspector
        status: inspectorData.status || 'offline', // Default to offline
        municipalCouncil: inspectorData.municipalCouncil || undefined,
        assignedZone: inspectorData.assignedZone || undefined,
        isAssigned: inspectorData.isAssigned || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await awsDynamoService.putItem(COLLECTION_NAME, newInspector);

      console.log(' Inspector added successfully:', inspectorId);
      return {
        success: true,
        message: 'Inspector added successfully',
        inspectorId,
      };
    } catch (error) {
      console.error('Error adding inspector:', error);
      throw new Error('Failed to add inspector');
    }
  }

  /**
   * Update an existing inspector
   Password cannot be updated through this method
   */
  async updateInspector(inspectorId, updates) {
    try {
      // Remove password from updates if accidentally included

      //i am channged add _ for pass and remove lint is have error remove  _
      const { _password, ...safeUpdates } = updates;

      await awsDynamoService.updateItem(
        COLLECTION_NAME,
        { userId: inspectorId },
        {
          ...safeUpdates,
          updatedAt: new Date().toISOString(),
        }
      );

      console.log(' Inspector updated successfully');
      return {
        success: true,
        message: 'Inspector updated successfully',
      };
    } catch (error) {
      console.error('Error updating inspector:', error);
      throw new Error('Failed to update inspector');
    }
  }

  /**
   * Delete an inspector
   */
  async deleteInspector(inspectorId) {
    try {
      await awsDynamoService.deleteItem(COLLECTION_NAME, { userId: inspectorId });

      console.log(' Inspector deleted successfully');
      return {
        success: true,
        message: 'Inspector deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting inspector:', error);
      throw new Error('Failed to delete inspector');
    }
  }

  /**
   * Update inspector status (online/offline)
   */
  async updateInspectorStatus(inspectorId, status) {
    try {
      await awsDynamoService.updateItem(
        COLLECTION_NAME,
        { userId: inspectorId },
        {
          status,
          updatedAt: new Date().toISOString(),
        }
      );

      console.log(` Inspector status updated to ${status}`);
      return {
        success: true,
        message: `Status updated to ${status}`,
      };
    } catch (error) {
      console.error('Error updating inspector status:', error);
      throw new Error('Failed to update status');
    }
  }

  /**
   * Search inspectors by name, email, or mobile number
   */
  async searchInspectors(searchTerm) {
    try {
      const allInspectors = await this.getAllInspectors();

      if (!searchTerm || searchTerm.trim() === '') {
        return allInspectors;
      }

      const searchLower = searchTerm.toLowerCase();

      return allInspectors.filter(
        (inspector) =>
          inspector.name.toLowerCase().includes(searchLower) ||
          inspector.mobileNumber.includes(searchTerm) ||
          (inspector.email && inspector.email.toLowerCase().includes(searchLower)) ||
          (inspector.inspectorId && inspector.inspectorId.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching inspectors:', error);
      throw new Error('Failed to search inspectors');
    }
  }

  /**
   * Get inspectors by status
   */
  async getInspectorsByStatus(status) {
    try {
      const allInspectors = await this.getAllInspectors();
      return allInspectors.filter((inspector) => inspector.status === status);
    } catch (error) {
      console.error('Error getting inspectors by status:', error);
      throw new Error('Failed to fetch inspectors by status');
    }
  }

  /**
   * Get inspector by ID
   */
  async getInspectorById(inspectorId) {
    try {
      const result = await awsDynamoService.getItem(COLLECTION_NAME, {
        userId: inspectorId,
      });

      if (!result.item) {
        return null;
      }

      const data = result.item;
      return {
        id: data.id || data.inspectorId || data.userId,
        userId: data.userId,
        inspectorId: data.inspectorId,
        name: data.name,
        email: data.email || '',
        mobileNumber: data.mobileNumber,
        status: data.status || 'online',
        municipalCouncil: data.municipalCouncil,
        assignedZone: data.assignedZone,
        isAssigned: data.isAssigned || false,
        registeredDate: data.registeredDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch (error) {
      console.error('Error getting inspector by ID:', error);
      return null;
    }
  }

  /**
   * Assign zone to inspector (called by Council Admin)
   */
  async assignZoneToInspector(inspectorId, zoneId, municipalCouncil) {
    try {
      await awsDynamoService.updateItem(
        COLLECTION_NAME,
        { userId: inspectorId },
        {
          assignedZone: zoneId,
          municipalCouncil,
          isAssigned: true,
          updatedAt: new Date().toISOString(),
        }
      );

      console.log(' Zone assigned successfully');
      return {
        success: true,
        message: 'Zone assigned successfully',
      };
    } catch (error) {
      console.error('Error assigning zone:', error);
      throw new Error('Failed to assign zone');
    }
  }
}

export default new InspectorService();