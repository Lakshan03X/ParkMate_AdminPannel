// awsConfig.js - AWS Configuration for Web
// Reads from environment variables set in .env file

export const awsConfig = {
  apiGatewayUrl: import.meta.env.VITE_AWS_API_GATEWAY_URL,
                 
  region: import.meta.env.VITE_AWS_REGION ,
  usersTable: import.meta.env.VITE_DYNAMODB_USERS_TABLE ,
  environment: import.meta.env.VITE_ENV 
};

// Log configuration in development (helps with debugging)
if (awsConfig.environment === 'development') {
  console.log('AWS Config loaded:', {
    apiGatewayUrl: awsConfig.apiGatewayUrl,
    region: awsConfig.region,
    usersTable: awsConfig.usersTable,
  });
}

export default awsConfig;