# Homepage API Documentation

## Overview
The Homepage API provides aggregated data for the application's homepage, including latest articles and today's program schedule.

## Endpoints

### GET /api/pages/homepage

Retrieve aggregated homepage data including latest articles and today's schedule.

#### Request
- **Method**: GET
- **URL**: `/api/pages/homepage`
- **Headers**: None required
- **Body**: None

#### Response

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "latest_articles": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "excerpt": "string",
        "published_at": "ISO 8601 datetime",
        "author_id": "string",
        "category_id": "string",
        "tags": ["string"],
        "featured_image": "string",
        "slug": "string",
        "status": "published"
      }
    ],
    "today_schedule": [
      {
        "time": "HH:MM",
        "endTime": "HH:MM",
        "program_name": "string",
        "program_id": "string",
        "description": "string"
      }
    ]
  },
  "message": "Homepage data retrieved successfully"
}
```

**Error Response (429 Too Many Requests)**
```json
{
  "success": false,
  "message": "Too many requests for homepage data, please try again later."
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Failed to retrieve homepage data"
}
```

#### Rate Limiting
- **Limit**: 30 requests per minute per IP address
- **Window**: 1 minute
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

#### Caching
- **Strategy**: Redis caching with 5-minute TTL
- **Cache Key**: `homepage:data`
- **Behavior**: 
  - First request fetches fresh data and caches it
  - Subsequent requests serve cached data until TTL expires
  - Cache is automatically invalidated after 5 minutes

#### Performance
- **Expected Response Time**: < 500ms
- **Data Freshness**: Up to 5 minutes (due to caching)
- **Parallel Processing**: Articles and schedule data fetched concurrently using Promise.all

#### Dependencies
- **Database**: PostgreSQL (via Prisma)
- **Cache**: Redis
- **Services**: 
  - `article.service.ts` - for latest articles
  - `program.service.ts` - for today's schedule
  - `homepage.service.js` - orchestration and caching

#### Example Usage

**cURL**
```bash
curl -X GET http://localhost:3000/api/pages/homepage
```

**JavaScript (Fetch)**
```javascript
fetch('http://localhost:3000/api/pages/homepage')
  .then(response => response.json())
  .then(data => {
    console.log('Homepage data:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

**Response Headers**
```
Content-Type: application/json
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1640995200
```