# VeloTask REST API Documentation 📑

This document outlines the REST API endpoints, request headers, payload structures, and success/error responses designed for the VeloTask backend server.

### 🌐 Base URL
All API requests should be sent to:
```
http://localhost:5000/api
```

---

## 🔒 Request Headers

### Public Endpoints
No authentication headers are required for public endpoints (Signup and Login).
```http
Content-Type: application/json
```

### Protected Endpoints
Protected endpoints require a valid JWT token returned during Signup or Login.
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔑 Authentication Endpoints

### 1️⃣ Register a New User
* **Endpoint**: `POST /auth/signup`
* **Access**: Public
* **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
* **Success Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
* **Error Response (400 Bad Request / 409 Conflict)**:
```json
{
  "status": "error",
  "message": "An account with this email address already exists."
}
```

---

### 2️⃣ Log In an Existing User
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Logged in successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "created_at": "2026-06-02T02:40:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
* **Error Response (401 Unauthorized)**:
```json
{
  "status": "error",
  "message": "Invalid email address or password."
}
```

---

## 📋 Protected Task Endpoints
*All task endpoints require a valid `Authorization: Bearer <token>` request header.*

### 1️⃣ Retrieve All Tasks
* **Endpoint**: `GET /tasks`
* **Query Parameters** (Optional):
  - `status`: Filter by status (`pending` or `completed`)
  - `search`: Case-insensitive title search string
* **Example URL**: `/tasks?status=pending&search=design`
* **Success Response (200 OK)**:
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "tasks": [
      {
        "id": 12,
        "user_id": 1,
        "title": "Design landing wireframe layouts",
        "description": "Establish structural grid setups",
        "status": "pending",
        "created_at": "2026-06-02T02:45:00.000Z",
        "updated_at": "2026-06-02T02:45:00.000Z"
      }
    ]
  }
}
```

---

### 2️⃣ Retrieve Dashboard Statistics
* **Endpoint**: `GET /tasks/stats`
* **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": 5,
      "completed": 2,
      "pending": 3
    }
  }
}
```

---

### 3️⃣ Create a New Task
* **Endpoint**: `POST /tasks`
* **Request Body**:
```json
{
  "title": "Build API Router maps",
  "description": "Map auth and task endpoints to controller routes"
}
```
* **Success Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Task created successfully.",
  "data": {
    "task": {
      "id": 13,
      "user_id": 1,
      "title": "Build API Router maps",
      "description": "Map auth and task endpoints to controller routes",
      "status": "pending",
      "created_at": "2026-06-02T02:50:00.000Z",
      "updated_at": "2026-06-02T02:50:00.000Z"
    }
  }
}
```

---

### 4️⃣ Retrieve a Single Task by ID
* **Endpoint**: `GET /tasks/:id`
* **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "task": {
      "id": 13,
      "user_id": 1,
      "title": "Build API Router maps",
      "description": "Map auth and task endpoints to controller routes",
      "status": "pending",
      "created_at": "2026-06-02T02:50:00.000Z",
      "updated_at": "2026-06-02T02:50:00.000Z"
    }
  }
}
```
* **Error Response (404 Not Found)**:
```json
{
  "status": "error",
  "message": "Task not found or unauthorized."
}
```

---

### 5️⃣ Update an Existing Task (Partial updates supported)
* **Endpoint**: `PATCH /tasks/:id`
* **Request Body** (Any properties can be omitted):
```json
{
  "title": "Updated Task Title",
  "status": "completed"
}
```
* **Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Task updated successfully.",
  "data": {
    "task": {
      "id": 13,
      "user_id": 1,
      "title": "Updated Task Title",
      "description": "Map auth and task endpoints to controller routes",
      "status": "completed",
      "created_at": "2026-06-02T02:50:00.000Z",
      "updated_at": "2026-06-02T02:55:00.000Z"
    }
  }
}
```

---

### 6️⃣ Delete a Task
* **Endpoint**: `DELETE /tasks/:id`
* **Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Task deleted successfully."
}
```
* **Error Response (404 Not Found)**:
```json
{
  "status": "error",
  "message": "Task not found or unauthorized."
}
```
