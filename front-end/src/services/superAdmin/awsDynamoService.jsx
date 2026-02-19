// awsDynamoService.js - DynamoDB service using API Gateway (Web Version)
import { awsConfig } from '../awsConfig';

class AWSDynamoService {
  constructor() {
    this.apiUrl = awsConfig.apiGatewayUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
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

  /**
   * Query DynamoDB
   */
  async query(tableName, params) {
    const data = await this.fetchAPI('/query', {
      method: 'POST',
      body: JSON.stringify({
        tableName,
        ...params,
      }),
    });
    console.log('Query result:', data);
    return {
      items: data.Items || [],
    };
  }

  /**
   * Get single item from DynamoDB
   */
  async getItem(tableName, key) {
    const data = await this.fetchAPI('/get-item', {
      method: 'POST',
      body: JSON.stringify({
        tableName,
        key,
      }),
    });
    console.log('Get item result:', data);
    return {
      item: data.Item,
    };
  }

  /**
   * Put item into DynamoDB
   */
  async putItem(tableName, item) {
    await this.fetchAPI('/put-item', {
      method: 'POST',
      body: JSON.stringify({
        tableName,
        item,
      }),
    });

    return { success: true };
  }

  /**
   * Update item in DynamoDB
   */
  async updateItem(tableName, key, updates) {
    // Validate inputs
    if (!tableName) {
      throw new Error('Table name is required');
    }
    if (!key || Object.keys(key).length === 0) {
      throw new Error('Key is required and cannot be empty');
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Updates object is required and cannot be empty');
    }

    console.log('Updating item:', { tableName, key, updates });

    await this.fetchAPI('/update-item', {
      method: 'POST',
      body: JSON.stringify({
        tableName,
        key,
        updates,
      }),
    });

    return { success: true };
  }

  /**
   * Delete item from DynamoDB
   */
  async deleteItem(tableName, key) {
    await this.fetchAPI('/delete-item', {
      method: 'DELETE',
      body: JSON.stringify({
        tableName,
        key,
      }),
    });

    return { success: true };
  }

  /**
   * Scan DynamoDB table
   */
  async scan(tableName, filters = null) {
    const data = await this.fetchAPI('/scan', {
      method: 'POST',
      body: JSON.stringify({
        tableName,
        filters,
      }),
    });

    return {
      items: data.Items || [],
    };
  }
}

export default new AWSDynamoService();