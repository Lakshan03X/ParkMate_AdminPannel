const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize DynamoDB DocumentClient
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Environment variables (set these in Lambda configuration)
const USERS_TABLE = process.env.USERS_TABLE || 'AdminUsers';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h'; // Token expiration

/**
 * Lambda handler for user login
 */
exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, replace with your frontend domain
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Email and password are required'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Invalid email format'
        })
      };
    }

    // Query DynamoDB for user
    const params = {
      TableName: USERS_TABLE,
      Key: {
        email: email.toLowerCase() // Store emails in lowercase for consistency
      }
    };

    const result = await dynamodb.get(params).promise();

    // Check if user exists
    if (!result.Item) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          message: 'Invalid email or password'
        })
      };
    }

    const user = result.Item;

    // Check if user account is active
    if (user.status !== 'ACTIVE') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          message: 'Your account has been deactivated. Please contact the administrator.'
        })
      };
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          message: 'Invalid email or password'
        })
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update last login timestamp
    await dynamodb.update({
      TableName: USERS_TABLE,
      Key: { email: user.email },
      UpdateExpression: 'SET lastLogin = :timestamp',
      ExpressionAttributeValues: {
        ':timestamp': new Date().toISOString()
      }
    }).promise();

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Login successful',
        token,
        role: user.role,
        name: user.name,
        email: user.email
      })
    };

  } catch (error) {
    console.error('Login error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};