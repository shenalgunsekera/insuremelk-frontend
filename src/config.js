// Configuration for API endpoints
const config = {
  // Development - local backend
  development: {
    API_URL: 'http://localhost:5000'
  },
  // Production - Choreo backend (will be updated with actual URL)
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://579586dd-5a3e-4c3d-80d1-8f287ca07733-prod.e1-us-east-azure.choreoapis.dev/default/insuremelk-backend/v1.0'
  }
};

// Get the current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_URL = config[environment].API_URL;

export default config[environment]; 