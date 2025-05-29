# Floof Finder API Documentation

This is the API documentation for the Floof Finder missing pets application. The API provides endpoints for user authentication, managing missing pet reports, sightings, and comments.

## Base URL

http://localhost:3000

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

Authorization: Bearer <your_jwt_token>

---

## Authentication Endpoints

### POST /register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": null,
    "lastName": null
  },
  "access_token": "jwt_token_here"
}

### POST /login
Login with email and password.

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "access_token": "jwt_token_here"
}

### POST /login/google
Login with Google OAuth.

Request Body:
{
  "id_token": "google_id_token"
}

Response (200/201):
{
  "message": "Google login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "https://..."
  },
  "access_token": "jwt_token_here"
}

## Missing Pets Endpoints
### GET /missing-pets
Get all missing pets (public endpoint).

Response (200):
{
  "message": "Missing pets retrieved successfully",
  "count": 5,
  "missingPets": [
    {
      "id": 1,
      "petName": "Fluffy",
      "petType": "cat",
      "breed": "Persian",
      "color": "white",
      "petPhoto": "https://cloudinary.com/...",
      "lastSeenLocation": "Central Park",
      "lastSeenDate": "2024-01-15",
      "contactInfo": "john@example.com",
      "status": "missing",
      "description": "AI generated description",
      "User": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}

### GET /missing-pets/:id
Get specific missing pet details (public endpoint).

Response (200):
{
  "message": "Missing pet details retrieved successfully",
  "missingPet": {
    "id": 1,
    "petName": "Fluffy",
    "petType": "cat",
    "breed": "Persian",
    "color": "white",
    "petPhoto": "https://cloudinary.com/...",
    "lastSeenLocation": "Central Park",
    "lastSeenDate": "2024-01-15",
    "contactInfo": "john@example.com",
    "status": "missing",
    "description": "AI generated description",
    "User": { /* user details */ },
    "Sightings": [ /* array of sightings */ ],
    "Comments": [ /* array of comments */ ]
  }
}


### POST /missing-pets
Create a new missing pet report (requires authentication).

Headers:

Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Request Body (form-data):

petName: "string"
petType: "string"
breed: "string"
color: "string"
lastSeenLocation: "string"
lastSeenDate: "YYYY-MM-DD"
contactInfo: "string"
petPhoto: file (optional)


Response (201):

{
  "message": "Missing pet reported successfully",
  "missingPet": {
    "id": 1,
    "userId": 1,
    "petName": "Fluffy",
    "petType": "cat",
    "breed": "Persian",
    "color": "white",
    "petPhoto": "https://cloudinary.com/...",
    "lastSeenLocation": "Central Park",
    "lastSeenDate": "2024-01-15",
    "contactInfo": "john@example.com",
    "status": "missing"
  },
  "uploadedPhoto": {
    "url": "https://cloudinary.com/...",
    "uploaded": true
  }
}


### PATCH /missing-pets/:id/status
Update pet status (requires authentication, owner only).

Headers:

Authorization: Bearer <jwt_token>


{
  "status": "missing" | "found" | "closed"
}

{
  "message": "Pet status updated to: found",
  "missingPet": { /* updated pet object */ }
}

### PATCH /missing-pets/:id/generate-description
Generate AI description for pet (requires authentication, owner only).

Headers:

Authorization: Bearer <jwt_token>

Response (200):

{
  "message": "Pet description generated successfully",
  "description": "AI generated description in Bahasa Indonesia",
  "petName": "Fluffy",
  "includedSightings": 2,
  "includedComments": 1
}


## Sightings Endpoints
### GET /missing-pets/:id/sightings
Get all sightings for a specific missing pet (public endpoint).

Response (200):

{
  "message": "Sightings retrieved successfully",
  "petName": "Fluffy",
  "count": 3,
  "sightings": [
    {
      "id": 1,
      "missingPetId": 1,
      "reporterId": 2,
      "location": "Near Central Park",
      "sightingDate": "2024-01-16",
      "description": "Saw a white cat matching the description",
      "isVerified": false,
      "User": {
        "id": 2,
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe"
      }
    }
  ]
}


### POST /sightings
Report a pet sighting (requires authentication).

Headers:

Authorization: Bearer <jwt_token>

Request Body:

{
  "missingPetId": 1,
  "location": "string",
  "sightingDate": "YYYY-MM-DD",
  "description": "string"
}

Response (201):

{
  "message": "Sighting reported successfully",
  "sighting": {
    "id": 1,
    "missingPetId": 1,
    "reporterId": 2,
    "location": "Near Central Park",
    "sightingDate": "2024-01-16",
    "description": "Saw a white cat matching the description",
    "isVerified": false,
    "User": { /* reporter details */ }
  }
}


## Comments Endpoints
### GET /missing-pets/:id/comments
Get all comments for a specific missing pet (public endpoint).

Response (200):


{
  "message": "Comments retrieved successfully",
  "petName": "Fluffy",
  "count": 2,
  "comments": [
    {
      "id": 1,
      "missingPetId": 1,
      "userId": 2,
      "content": "I hope you find Fluffy soon!",
      "createdAt": "2024-01-15T10:30:00Z",
      "User": {
        "id": 2,
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe"
      }
    }
  ]
}


### POST /comments
Add a comment to a missing pet case (requires authentication).

Headers:

Authorization: Bearer <jwt_token>


Request Body:

{
  "missingPetId": 1,
  "content": "string"
}


Response (201):


{
  "message": "Comment added successfully",
  "comment": {
    "id": 1,
    "missingPetId": 1,
    "userId": 2,
    "content": "I hope you find Fluffy soon!",
    "User": { /* commenter details */ }
  }
}

### DELETE /comments/:id
Delete own comment (requires authentication, owner only).

Headers:

Authorization: Bearer <jwt_token>


Response (200):

{
  "message": "Comment deleted successfully"
}

## Test Endpoint
### GET /
Test if API is working.

Response (200):

{
  "message": "Missing Pets API is working!"
}


## Error Responses
All endpoints may return these common error responses:

400 Bad Request:

{
  "message": "Error description"
}


401 Unauthorized:

{
  "message": "Invalid email or password"
}

403 Forbidden:

{
  "message": "You can only update your own resources"
}

404 Not Found:

{
  "message": "Resource not found"
}

500 Internal Server Error:

{
  "message": "Internal server error"
}