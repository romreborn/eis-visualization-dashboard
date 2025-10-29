# API Configuration Guide

This document explains how to configure the EIS Dashboard to connect to your ASP.NET backend API.

## Environment Variables

Create a `.env.local` file in the root of your project (copy from `.env.example`) and configure the following variables:

### Required Variables

```bash
# ASP.NET Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```
- **Description**: The base URL of your ASP.NET backend API
- **Default**: `http://localhost:5000/api`
- **Example**: `https://your-backend-domain.com/api`

```bash
BETTER_AUTH_SECRET=your_secret_key_here_please_change_this_in_production
```
- **Description**: Secret key for authentication (use a strong, unique value in production)
- **Required**: Yes
- **Generate**: Use `openssl rand -base64 32` to generate a secure secret

### Optional Variables

```bash
# API Request Configuration
API_TIMEOUT=30000
```
- **Description**: Timeout for API requests in milliseconds
- **Default**: `30000` (30 seconds)

```bash
API_RETRY_ATTEMPTS=3
```
- **Description**: Number of retry attempts for failed API requests
- **Default**: `3`

```bash
API_RETRY_DELAY=1000
```
- **Description**: Delay between retry attempts in milliseconds (exponential backoff)
- **Default**: `1000` (1 second)

```bash
# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```
- **Description**: Comma-separated list of allowed origins for CORS
- **Default**: `http://localhost:3000,http://localhost:3001`

```bash
# Feature Flags
ENABLE_MOCK_DATA=false
```
- **Description**: Enable mock data for development/testing
- **Default**: `false`

```bash
ENABLE_DEBUG_LOGGING=true
```
- **Description**: Enable debug logging in development
- **Default**: `true` in development, `false` in production

## Backend API Requirements

Your ASP.NET backend should implement the following endpoints:

### 1. Circuit Report Endpoint

```
GET /api/circuits/report
```

**Query Parameters (optional):**
- `limit`: Number of records to return
- `offset`: Number of records to skip
- `status`: Filter by circuit status
- `servicetype`: Filter by service type
- `partner`: Filter by partner

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "circuitNdx": 1,
      "circuitID": "CIR-001",
      "custID": "CUST-001",
      "circuitDesc": "Main Office - Backup Office",
      "status": "Active",
      "servicetype": "STARLINK",
      "partner": "Partner Name",
      "custDesc": "Customer Name",
      "remRegion1": "Region Name",
      "wanIp1": "192.168.1.1",
      "mrc": "500.00",
      // ... other fields from SQL query
    }
  ],
  "totalRecords": 150,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### 2. Health Check Endpoint (Optional)

```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## CORS Configuration

Your ASP.NET backend must be configured to accept CORS requests from your frontend domain. Add the following to your backend configuration:

```csharp
// In Startup.cs or Program.cs
services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});

app.UseCors();
```

## Authentication

The API client automatically includes authentication tokens from the user session in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

Your ASP.NET backend should validate this token and return appropriate responses:

- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Token is valid but user lacks permission
- **200 OK**: Token is valid and request can proceed

## Testing the Configuration

### 1. Environment Validation

The application automatically validates required environment variables on startup. Check the console for any validation errors.

### 2. API Connection Test

You can test the API connection using the built-in test function:

```typescript
import { testApiConnection } from '@/lib/api-client';

const testConnection = async () => {
  const result = await testApiConnection();
  console.log(result);
  // { success: true, message: 'API connection successful' }
};
```

### 3. Development Debugging

Enable debug logging to see detailed API request information:

```bash
ENABLE_DEBUG_LOGGING=true
```

This will log:
- API request URLs and parameters
- Authentication token status
- Response times and status codes
- Error details

## Production Deployment

For production deployment:

1. **Use HTTPS**: Ensure your API URL uses HTTPS
2. **Strong Authentication Secret**: Generate a secure `BETTER_AUTH_SECRET`
3. **Environment-Specific Configuration**: Set appropriate values for each environment
4. **CORS Origins**: Update `CORS_ALLOWED_ORIGINS` to include your production domain
5. **Disable Debug Logging**: Set `ENABLE_DEBUG_LOGGING=false`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check that your backend allows requests from your frontend domain
2. **401 Unauthorized**: Verify authentication is working and tokens are being sent
3. **Network Errors**: Check that the API URL is correct and accessible
4. **Timeout Errors**: Increase `API_TIMEOUT` if your API is slow to respond

### Debug Mode

Enable debug mode to get detailed logging:

```bash
ENABLE_DEBUG_LOGGING=true
```

This will show detailed information about API requests, responses, and errors in the browser console.

## Example .env.local File

```bash
# Development Environment
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
BETTER_AUTH_SECRET=your_super_secret_key_here_change_in_production
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ENABLE_MOCK_DATA=false
ENABLE_DEBUG_LOGGING=true
```

```bash
# Production Environment
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
BETTER_AUTH_SECRET=generated_secure_secret_key_here
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
ENABLE_MOCK_DATA=false
ENABLE_DEBUG_LOGGING=false
```