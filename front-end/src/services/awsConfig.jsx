// awsConfig.js - AWS Configuration for Web
// use .env file for secret values

export const awsConfig = {
  // User API
  apiGatewayUrl: import.meta.env.VITE_AWS_API_GATEWAY_URL,
  usersTable: import.meta.env.VITE_DYNAMODB_USERS_TABLE,

  // Admin API
  adminApiGatewayUrl: import.meta.env.VITE_AWS_API_GATEWAY_URL_LOGIN,
  adminUsersTable: import.meta.env.VITE_DYNAMODB_USERS_TABLE_ADMIN,

  // General environment settings
  region: import.meta.env.VITE_AWS_REGION,
  environment: import.meta.env.VITE_ENV,
};

// Log configuration in development
if (awsConfig.environment === 'development') {
  console.log('AWS Config loaded:', {
    apiGatewayUrl: awsConfig.apiGatewayUrl,
    usersTable: awsConfig.usersTable,
    adminApiGatewayUrl: awsConfig.adminApiGatewayUrl,
    adminUsersTable: awsConfig.adminUsersTable,
    region: awsConfig.region,       
  });
}

export default awsConfig;