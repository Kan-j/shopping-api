**Backend API - Node.js Express**

This is the backend API for managing **Products** and **Carts** in an e-commerce platform, built with **Node.js** and **Express**. The API provides endpoints for managing products, handling shopping carts, and user authentication.

-----
**Table of Contents**

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Products Endpoints](#products-endpoints)
  - [Cart Endpoints](#cart-endpoints)
  - [Users Endpoints](#users-endpoints)
- [Authentication](#authentication)
- [CORS Handling](#cors-handling)
- [Testing](#testing)
- [License](#license)
-----
**Installation**

**Prerequisites**

Ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

**Steps to Install**

1. Clone the repository to your local machine:

   bash

   Copy code

   git clone <repository-url>

1. Navigate into the project folder:

   bash

   Copy code

   cd <project-folder>

1. Install dependencies:

   bash

   Copy code

   npm install

1. Start the server:

   bash

   Copy code

   npm start

1. The server will start on port 5000 by default. You can change the port by setting the PORT environment variable.
-----
**API Endpoints**

**Products Endpoints**

**GET /products**

- **Description**: Retrieve a list of all products.
- **Response**:

  json

  Copy code

  {

  `  `"products": [

  `    `{

  `      `"id": 1,

  `      `"name": "Product Name",

  `      `"description": "Product description",

  `      `"price": 100

  `    `}

  `  `]

  }

**GET /products/:id**

- **Description**: Retrieve details of a specific product by ID.
- **Parameters**:
  - id (required): Product ID.
- **Response**:

  json

  Copy code

  {

  `  `"id": 1,

  `  `"name": "Product Name",

  `  `"description": "Product description",

  `  `"price": 100

  }

**POST /products**

- **Description**: Add a new product (Admin only).
- **Request Body**:

  json

  Copy code

  {

  `  `"name": "New Product",

  `  `"description": "Product description",

  `  `"price": 100

  }

**PUT /products/:id**

- **Description**: Update an existing product (Admin only).
- **Parameters**:
  - id (required): Product ID.
- **Request Body**:

  json

  Copy code

  {

  `  `"name": "Updated Product",

  `  `"description": "Updated description",

  `  `"price": 150

  }

**DELETE /products/:id**

- **Description**: Delete a product (Admin only).
- **Parameters**:
  - id (required): Product ID.
- **Response**:

  json

  Copy code

  {

  `  `"message": "Product deleted successfully"

  }

-----
**Cart Endpoints**

**GET /cart**

- **Description**: Retrieve the current state of the shopping cart.
- **Response**:

  json

  Copy code

  {

  `  `"cart": [

  `    `{

  `      `"product\_id": 1,

  `      `"name": "Product Name",

  `      `"quantity": 2,

  `      `"price": 100

  `    `}

  `  `]

  }

**POST /cart**

- **Description**: Add a product to the cart.
- **Request Body**:

  json

  Copy code

  {

  `  `"product\_id": 1,

  `  `"quantity": 2

  }

**PUT /cart/:id**

- **Description**: Update the quantity of a product in the cart.
- **Parameters**:
  - id (required): Cart item ID.
- **Request Body**:

  json

  Copy code

  {

  `  `"quantity": 3

  }

**DELETE /cart/:id**

- **Description**: Remove a product from the cart.
- **Parameters**:
  - id (required): Cart item ID.
- **Response**:

  json

  Copy code

  {

  `  `"message": "Product removed from cart"

  }

-----
**Users Endpoints**

**POST /api/users/register**

- **Description**: Register a new user.
- **Request Body**:

  json

  Copy code

  {

  `  `"name": "John Doe",

  `  `"email": "john.doe@example.com",

  `  `"password": "securepassword123"

  }

**POST /api/users/login**

- **Description**: Log in a user and return a JWT token.
- **Request Body**:

  json

  Copy code

  {

  `  `"email": "john.doe@example.com",

  `  `"password": "securepassword123"

  }

**POST /api/users/login/admin**

- **Description**: Log in an admin user and return a JWT token.
- **Request Body**:

  json

  Copy code

  {

  `  `"email": "admin@example.com",

  `  `"password": "adminpassword123"

  }

**POST /api/users/admin/register**

- **Description**: Register a new admin user (Admin only).
- **Request Body**:

  json

  Copy code

  {

  `  `"name": "Admin User",

  `  `"email": "admin.user@example.com",

  `  `"password": "adminpassword123"

  }

-----
**Authentication**

Authentication is handled using **JWT (JSON Web Tokens)**. Upon successful login, a token is returned that should be included in the Authorization header for accessing protected routes.

Example:

http

Copy code

Authorization: Bearer <JWT\_TOKEN>

- **User Login**: POST /api/users/login
- **Admin Login**: POST /api/users/login/admin
-----
**CORS Handling**

The server supports **CORS** (Cross-Origin Resource Sharing) to allow cross-origin requests. By default, all origins are allowed. However, this can be customized in the server configuration.

javascript

Copy code

app.use(cors({

`  `origin: '\*', // Allow all origins

`  `methods: 'GET, POST, PUT, DELETE',

`  `allowedHeaders: 'Content-Type, Authorization',

`  `credentials: false

}));

-----
**Testing**

You can test the API endpoints using tools like **Postman** or **Insomnia**. The Postman collection for this API is available [here](https://documenter.getpostman.com/view/28541498/2sAYJ1khqR).

-----
**License**

This project is licensed under the MIT License - see the LICENSE file for details.

-----
**Additional Notes**

- **Environment Variables**: The API requires certain environment variables such as PORT and JWT\_SECRET for configuration. Make sure to set them up in your .env file.

