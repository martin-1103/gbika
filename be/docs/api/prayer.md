# Prayer Request API Documentation

## Overview
The Prayer Request API allows users to submit prayer requests to the church prayer team. All requests are validated, sanitized, and notifications are sent to the prayer team.

## Endpoints

### POST /api/services/prayer

Submit a new prayer request to the prayer team.

#### Request
- **Method**: POST
- **URL**: `/api/services/prayer`
- **Headers**: 
  - `Content-Type: application/json`
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Body**:

```json
{
  "name": "string",
  "contact": "string", 
  "content": "string",
  "is_anonymous": "boolean"
}
```

#### Request Body Parameters

| Parameter | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `name` | string | Yes | Name of the person requesting prayer | 1-100 characters, sanitized |
| `contact` | string | Yes | Contact information (email/phone) | 1-200 characters, sanitized |
| `content` | string | Yes | Prayer request content | 1-2000 characters, sanitized |
| `is_anonymous` | boolean | Yes | Whether to keep the request anonymous | true or false |

#### Response

**Success Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "contact": "string",
    "content": "string",
    "isAnonymous": "boolean",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  },
  "message": "Prayer request submitted successfully"
}
```

**Error Response (422 Unprocessable Entity)**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "string",
      "msg": "string",
      "path": "string",
      "location": "body"
    }
  ]
}
```

**Error Response (429 Too Many Requests)**
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Failed to submit prayer request"
}
```

## Validation Rules

### Name Field
- Required: Yes
- Type: String
- Length: 1-100 characters
- Sanitization: HTML tags removed, special characters escaped

### Contact Field
- Required: Yes
- Type: String
- Length: 1-200 characters
- Sanitization: HTML tags removed, special characters escaped

### Content Field
- Required: Yes
- Type: String
- Length: 1-2000 characters
- Sanitization: HTML tags removed, special characters escaped
- Validation: Cannot be empty or contain only whitespace

### Is Anonymous Field
- Required: Yes
- Type: Boolean
- Values: true or false

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Input Sanitization**: All text inputs are sanitized using DOMPurify
- **Validation**: Comprehensive server-side validation using express-validator
- **CORS Protection**: Configured CORS headers

## Notifications

When a prayer request is successfully submitted:
1. The request is saved to the database
2. A notification is sent to the prayer team via Redis pub/sub
3. Console logging for monitoring purposes
4. Future: Email notifications to prayer team members

## Example Usage

### Submit Prayer Request

```bash
curl -X POST http://localhost:3000/api/services/prayer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "contact": "john.doe@email.com",
    "content": "Please pray for my family's health and well-being.",
    "is_anonymous": false
  }'
```

### Submit Anonymous Prayer Request

```bash
curl -X POST http://localhost:3000/api/services/prayer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anonymous",
    "contact": "anonymous@example.com",
    "content": "Please pray for healing and strength.",
    "is_anonymous": true
  }'
```

## Database Schema

The prayer requests are stored in the `prayer_requests` table with the following structure:

```sql
CREATE TABLE prayer_requests (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  isAnonymous BOOLEAN NOT NULL DEFAULT false,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL
);
```

## Testing

Comprehensive test coverage includes:
- Unit tests for prayer service functions
- Integration tests for API endpoints
- Validation tests for input sanitization
- Rate limiting tests
- Error handling tests

Run tests with:
```bash
npm test tests/service.test.ts
```