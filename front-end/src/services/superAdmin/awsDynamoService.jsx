// awsDynamoService.js
import { awsConfig } from '../awsConfig'; // Check your import path!

class AWSDynamoService {
  // We add 'customUrl' so we can point to different API Gateways
  constructor(customUrl = null) {
    this.apiUrl = customUrl || awsConfig.apiGatewayUrl;
  }

  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`DynamoDB ${endpoint} Error:`, error);
      throw error;
    }
  }

  async query(tableName, params) {
    const data = await this.fetchAPI('/query', {
      method: 'POST',
      body: JSON.stringify({ tableName, ...params }),
    });
    return { items: data.Items || [] };
  }

  async getItem(tableName, key) {
    const data = await this.fetchAPI('/get-item', {
      method: 'POST',
      body: JSON.stringify({ tableName, key }),
    });
    return { item: data.Item };
  }

  async putItem(tableName, item) {
    await this.fetchAPI('/put-item', {
      method: 'POST',
      body: JSON.stringify({ tableName, item }),
    });
    return { success: true };
  }

  async updateItem(tableName, key, updates) {
    if (!tableName) throw new Error('Table name is required');
    if (!key || Object.keys(key).length === 0) throw new Error('Key is required');
    if (!updates || Object.keys(updates).length === 0) throw new Error('Updates required');

    await this.fetchAPI('/update-item', {
      method: 'POST',
      body: JSON.stringify({ tableName, key, updates }),
    });
    return { success: true };
  }

  async deleteItem(tableName, key) {
    await this.fetchAPI('/delete-item', {
      method: 'DELETE',
      body: JSON.stringify({ tableName, key }),
    });
    return { success: true };
  }

  async scan(tableName, filters = null) {
    const data = await this.fetchAPI('/scan', {
      method: 'POST',
      body: JSON.stringify({ tableName, filters }),
    });
    return { items: data.Items || [] };
  }
}

// 1. Export the standard service (Uses the old API Gateway)
export default new AWSDynamoService();

// 2. Export the NEW Admin service (Uses the new oua1bziyn0 API Gateway)
export const adminDynamoService = new AWSDynamoService(awsConfig.adminApiGatewayUrl);