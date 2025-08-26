# API Documentation

This directory contains comprehensive documentation for the GBIKA Backend API.

## Structure

```
docs/
├── api/                    # API endpoint documentation
│   └── homepage.md        # Homepage API documentation
├── postman/               # Postman collections for testing
│   └── homepage-api.postman_collection.json
└── README.md             # This file
```

## API Endpoints

### Homepage API
- **File**: [api/homepage.md](./api/homepage.md)
- **Endpoint**: `GET /api/pages/homepage`
- **Description**: Aggregated homepage data including latest articles and today's schedule
- **Features**: Rate limiting, Redis caching, parallel data fetching

## Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import" button
3. Select the collection file: `postman/homepage-api.postman_collection.json`
4. The collection will be imported with pre-configured tests

### Environment Variables
The collection uses the following variable:
- `base_url`: Set to `http://localhost:3000` (default)

To change the base URL:
1. Go to Environments in Postman
2. Create a new environment or edit existing
3. Add variable `base_url` with your server URL

### Available Tests

#### 1. Get Homepage Data
- **Purpose**: Basic functionality test
- **Tests**: Response status, structure, performance, rate limit headers

#### 2. Rate Limit Test
- **Purpose**: Verify rate limiting implementation
- **Tests**: Rate limit headers presence, appropriate response codes

#### 3. Cache Test (First Request)
- **Purpose**: Populate cache and measure baseline performance
- **Tests**: Successful response, stores response time

#### 4. Cache Test (Second Request)
- **Purpose**: Verify caching performance improvement
- **Tests**: Cached response performance comparison

### Running Tests

1. **Individual Request**: Click on any request and hit "Send"
2. **Collection Runner**: 
   - Click on collection name
   - Click "Run collection"
   - Configure iterations and delay if needed
   - Click "Run Homepage API Collection"

### Test Results

Each test includes assertions for:
- ✅ Response status codes
- ✅ Response time performance
- ✅ Data structure validation
- ✅ Rate limiting functionality
- ✅ Caching performance
- ✅ Required headers presence

## Development Notes

### Rate Limiting
- **Production**: 30 requests per minute per IP
- **Test Environment**: 1000 requests per minute per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Caching Strategy
- **Cache Store**: Redis
- **TTL**: 5 minutes
- **Cache Key**: `homepage:data`
- **Invalidation**: Automatic after TTL expiry

### Performance Targets
- **Response Time**: < 500ms
- **Cached Response**: Significantly faster than fresh data fetch
- **Parallel Processing**: Articles and schedule fetched concurrently

## API Standards

### Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": object | array,
  "message": string
}
```

### Error Handling
- **4xx**: Client errors (bad request, unauthorized, rate limited)
- **5xx**: Server errors (internal server error, service unavailable)

### Headers
- **Content-Type**: `application/json`
- **Rate Limit Headers**: Present on all rate-limited endpoints

## Contributing

When adding new API endpoints:

1. **Documentation**: Create markdown file in `api/` directory
2. **Postman Collection**: Add requests to appropriate collection
3. **Tests**: Include comprehensive test scripts
4. **Update README**: Add endpoint to this documentation

### Documentation Template

For new API endpoints, follow this structure:
- Overview and purpose
- Request/response specifications
- Error codes and messages
- Rate limiting details
- Caching strategy (if applicable)
- Example usage
- Dependencies

## Support

For questions about the API documentation:
- Check existing documentation files
- Review Postman test results
- Consult the main project README