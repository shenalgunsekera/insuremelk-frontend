// Configuration for API endpoints
const config = {
  // Development - local backend
  development: {
    API_URL: 'http://localhost:3000'
  },
  // Production - Choreo backend
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://insuremelk-backend-org.choreo.dev'
  }
};

// Get the current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_URL = config[environment].API_URL;

export default config[environment]; 