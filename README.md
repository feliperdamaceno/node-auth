# Node Authorization API

- [Overview](#overview)
- [Environmental Variables](#environmental-variables)
- [Routes](#routes)
  - [Public Routes](#public-routes)
  - [Private Routes](#private-routes)
- [Authentication and Authorization](#authentication-and-authorization)
- [JWT Token Expiry](#jwt-token-expiry)
- [Docker-Compose and MongoDB Setup](#docker-compose-and-mongodb-setup)
- [Getting Started](#getting-started)
- [License](#license)
- [Contributors](#contributors)
- [Contact me](#contact-me)

## Overview

This Node Authorization API allows users to perform authentication and authorization actions through a set of RESTful routes. The key technologies used in this project include:

- **bcrypt**: Used for hashing passwords securely.
- **cookie-parser**: Parses cookies attached to the client's request.
- **cors**: Enables Cross-Origin Resource Sharing.
- **dotenv**: Loads environment variables from a .env file.
- **express**: A fast, unopinionated, minimalist web framework for Node.js.
- **joi**: A schema description language and data validator.
- **jsonwebtoken**: Generates and verifies JSON Web Tokens (JWT).
- **mongoose**: An ODM library for MongoDB and Node.js.

## Environmental Variables

Ensure the following environmental variables are set:

**PORT**: Port number for the server.

**MONGODB_URL**: URL for the MongoDB database.

**JWT_SECRET**: Secret key for JWT token generation and verification.

## Routes

### Public Routes:

- **POST /signup**: Create a new user.
- **POST /login**: Log in with existing credentials.

### Private Routes:

- **GET /**: Retrieve all users (requires authentication).
- **GET /:email**: Retrieve a specific user by email (requires authentication).
- **POST /:email**: Update a user by email (requires authentication).
- **DELETE /:email**: Delete a user by email (requires authentication).

## Authentication and Authorization

- Users can only access the login and signup routes publicly.
- Other routes are private and require authentication, implemented through middleware and a validation function.

## JWT Token Expiry

- JWT tokens have a 3-day expiration, requiring users to log in again after that time.

## Docker-Compose and MongoDB Setup

- The project includes a docker-compose file for creating a MongoDB database.
- MongoDB is accessible via the Mongo Express service for database management.
- The admin passphrase in the docker-compose file is for development only and should be a stronger password in production.

## Getting Started

1. Clone the repository.
2. Set up the environmental variables in a **.env** file.
3. Run docker-compose up -d to start the MongoDB and Mongo Express services.
4. Install dependencies with npm install.
5. Start the server with npm start.
6. Explore the API using the provided routes.

## License

This is an open-source library and is available under the [**MIT License**](LICENSE). You are free to use, modify, and distribute the code in accordance with the terms of the license.

## Contributors

[feliperdamaceno](https://github.com/feliperdamaceno)

## Contact me

Linkedin: [feliperdamaceno](https://www.linkedin.com/in/feliperdamaceno
