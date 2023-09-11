module.exports = {
  "openapi": "3.0.0",
  "info": {
    "title": "Your API Documentation",
    "version": "1.0.0",
    "description": "Documentation for your Express API"
  },
  "paths": {},
  "components": {},
  "tags": [],
  "apis": [
    {
      "path": "/",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Home route",
          "notes": "This is the home route of your application.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/users",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Get all users",
          "notes": "Retrieve a list of all users.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/home",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Home page",
          "notes": "Displays the home page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/userhome",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "User home page",
          "notes": "Displays the user home page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/registration",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "User registration page",
          "notes": "Displays the user registration page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/account",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "User account page",
          "notes": "Displays the user account page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/update",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Update user information page",
          "notes": "Displays the page to update user information.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/delete",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Delete user page",
          "notes": "Displays the page to delete a user account.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/test",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Test page",
          "notes": "Displays the test page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/login",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Login page",
          "notes": "Displays the login page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/forgot_password",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Forgot password page",
          "notes": "Displays the forgot password page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/reset-password",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Reset password page",
          "notes": "Displays the reset password page.",
          "responseClass": "string"
        }
      ]
    },
    {
      "path": "/books",
      "operations": [
        {
          "httpMethod": "GET",
          "summary": "Books page",
          "notes": "Displays the books page.",
          "responseClass": "string"
        }
      ]
    }
  ]
};