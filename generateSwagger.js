const fs = require('fs');

// Replace with the path to your Swagger configuration file
const swaggerConfigPath = './swagger.js';

// Define your routes and their descriptions
const routes = [
  {
    path: '/',
    summary: 'Home route',
    description: 'This is the home route of your application.',
  },
  {
    path: '/users',
    summary: 'Get all users',
    description: 'Retrieve a list of all users.',
  },
  {
    path: '/home',
    summary: 'Home page',
    description: 'Displays the home page.',
  },
  {
    path: '/userhome',
    summary: 'User home page',
    description: 'Displays the user home page.',
  },
  {
    path: '/registration',
    summary: 'User registration page',
    description: 'Displays the user registration page.',
  },
  {
    path: '/account',
    summary: 'User account page',
    description: 'Displays the user account page.',
  },
  {
    path: '/update',
    summary: 'Update user information page',
    description: 'Displays the page to update user information.',
  },
  {
    path: '/delete',
    summary: 'Delete user page',
    description: 'Displays the page to delete a user account.',
  },
  {
    path: '/test',
    summary: 'Test page',
    description: 'Displays the test page.',
  },
  {
    path: '/login',
    summary: 'Login page',
    description: 'Displays the login page.',
  },
  {
    path: '/forgot_password',
    summary: 'Forgot password page',
    description: 'Displays the forgot password page.',
  },
  {
    path: '/reset-password',
    summary: 'Reset password page',
    description: 'Displays the reset password page.',
  },
  {
    path: '/books',
    summary: 'Books page',
    description: 'Displays the books page.',
  },
];

// Read the existing Swagger configuration file
const swaggerConfig = require(swaggerConfigPath);

// Add the dynamically generated routes and descriptions
swaggerConfig.apis = routes.map((route) => ({
  path: route.path,
  operations: [
    {
      httpMethod: 'GET', // You can customize this as needed for each route
      summary: route.summary,
      notes: route.description,
      responseClass: 'string', // You can customize the response type
    },
  ],
}));

// Write the updated Swagger configuration back to the file
fs.writeFileSync(swaggerConfigPath, `module.exports = ${JSON.stringify(swaggerConfig, null, 2)};`, 'utf-8');

console.log('Swagger documentation updated successfully.');