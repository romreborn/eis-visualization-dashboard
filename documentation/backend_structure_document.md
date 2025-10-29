# Backend Structure Document

This document outlines the backend architecture, hosting setup, and infrastructure components for the Executive Information System (EIS) visualization dashboard. It is written in clear, everyday language so that anyone can understand how the backend works, how data flows, and how we ensure security and performance.

## 1. Backend Architecture

Overall, the backend is composed of two main parts:

1. An existing ASP.NET C# Web API that handles data access and business logic.  
2. A Next.js application (App Router) that serves the dashboard UI and fetches data from the C# API on the server side.

Key design patterns and frameworks:

- ASP.NET Web API (MVC-ish pattern) for data access and endpoint routing.  
- Entity Framework (or ADO.NET) on the C# side for database queries and data mapping.  
- Next.js server components for secure, server-side data fetching and page rendering.  
- React functional components with shadcn/ui and Tailwind CSS for a modular, component-based UI.

How it supports scalability, maintainability, and performance:

- Separation of concerns: the C# API handles all database queries and business rules, while Next.js focuses on rendering and user interface.  
- Server-side rendering (SSR) in Next.js keeps sensitive API details hidden from browsers and speeds up time to first meaningful paint.  
- Microservice-style decoupling: the dashboard can scale independently of the main ASP.NET application.  
- Clear folder structure (`/app`, `/components`, `/lib`) makes it easy to find and extend code.

## 2. Database Management

We use a relational database to store circuit data and related entities.

Database technology:

- Microsoft SQL Server (SQL) hosted in a managed environment (e.g., Azure SQL or on-premises).  

Data storage and access:

- Tables represent entities like Circuits, Customers, Partners, and Regions.  
- The ASP.NET API executes parameterized SQL queries (or uses Entity Framework) to read and write data.  
- Optional caching layer (Redis) can store frequent query results, reducing database load.  
- Backup and restore practices ensure data is protected (nightly full backups, hourly transaction‐log backups).

## 3. Database Schema

Below is a human-readable description of the key tables and their columns, followed by a sample SQL schema.

Circuits Table:
- CircuitID (primary key, integer)  
- CustomerDescription (text)  
- Status (text)  
- ServiceType (text)  
- PartnerID (foreign key to Partners)  
- Region (text)  
- LatitudeStart, LongitudeStart (float)  
- LatitudeEnd, LongitudeEnd (float)

Partners Table:
- PartnerID (primary key, integer)  
- PartnerName (text)

Sample SQL schema (SQL Server):
```sql
CREATE TABLE Partners (
  PartnerID INT IDENTITY(1,1) PRIMARY KEY,
  PartnerName NVARCHAR(100) NOT NULL
);

CREATE TABLE Circuits (
  CircuitID INT IDENTITY(1,1) PRIMARY KEY,
  CustomerDescription NVARCHAR(200) NOT NULL,
  Status NVARCHAR(50) NOT NULL,
  ServiceType NVARCHAR(50) NOT NULL,
  PartnerID INT NOT NULL FOREIGN KEY REFERENCES Partners(PartnerID),
  Region NVARCHAR(50) NOT NULL,
  LatitudeStart FLOAT NULL,
  LongitudeStart FLOAT NULL,
  LatitudeEnd FLOAT NULL,
  LongitudeEnd FLOAT NULL
);

-- Index to speed up queries by status or partner
CREATE INDEX IX_Circuits_Status ON Circuits(Status);
CREATE INDEX IX_Circuits_PartnerID ON Circuits(PartnerID);
``` 

## 4. API Design and Endpoints

We follow a RESTful approach on the ASP.NET C# side. Next.js does not expose its own API routes; it fetches directly from the C# API.

Key endpoints:

- **GET /api/circuits/report**  
  • Purpose: Retrieve a list of circuit records (can accept optional query parameters like `status`, `partnerId`, `page`, `pageSize`).  
  • Response: JSON array of circuit objects with fields matching the database schema.  

- **Authentication endpoints** (if using ASP.NET Identity and JWT):  
  • POST /api/auth/login  
  • POST /api/auth/register  
  • GET /api/auth/me  

How they facilitate frontend-backend communication:

- Next.js server components use `fetch()` with the appropriate authentication token (e.g., JWT in `Authorization` header) to call these endpoints.  
- Responses are returned as JSON, validated in Next.js (using Zod) and passed to React components for rendering.

## 5. Hosting Solutions

We use managed cloud services to maximize reliability and cost-efficiency.

ASP.NET C# API:
- Hosted on Azure App Service (Windows) or AWS Elastic Beanstalk (.NET platform).  
- Connected to Azure SQL Database (or Amazon RDS for SQL Server).

Next.js Dashboard:
- Deployed to Vercel for global edge delivery and automatic SSL.  
- Alternatively, containerized with Docker and deployed to Azure Container Instances (ACI) or AWS Fargate.

Benefits:
- Automatic scaling handles traffic spikes.  
- Managed backups and high-availability SLAs.  
- Pay-as-you-go pricing keeps costs tied to actual usage.

## 6. Infrastructure Components

To ensure fast, reliable performance and a smooth user experience, we include:

- **Load Balancer:**  
  • Azure Load Balancer or AWS ALB in front of the ASP.NET API to distribute traffic across instances.

- **Caching:**  
  • Azure Cache for Redis (or AWS ElastiCache) for caching common query results like popular status lists.

- **Content Delivery Network (CDN):**  
  • Vercel’s global CDN automatically caches static assets of the Next.js app (CSS, JavaScript bundles).

- **SSL/TLS Certificates:**  
  • Managed by Azure App Service / Vercel to secure all data in transit.

These components work together to minimize latency, balance load, and offload repetitive tasks (caching) from the primary servers.

## 7. Security Measures

We implement multiple layers of security:

- **Authentication & Authorization:**  
  • JWT-based tokens issued by the ASP.NET API.  
  • Next.js server components include the token in each request.  

- **Transport Security:**  
  • HTTPS enforced everywhere.  
  • TLS 1.2+ only.

- **Data Encryption:**  
  • Encryption at rest for the SQL database (Transparent Data Encryption).  
  • Encryption in transit via SSL/TLS.

- **Input Validation & Sanitization:**  
  • Parameterized SQL queries or Entity Framework to prevent SQL injection.  
  • Zod validation in Next.js to ensure the API response matches expected types.

- **CORS Policy:**  
  • Strictly allow only the dashboard origin to call the API, if calling from the browser.  

- **Rate Limiting & DDoS Protection:**  
  • Built-in protections from Azure App Service or AWS Shield.

## 8. Monitoring and Maintenance

We use a combination of services and tools to keep the backend healthy and troubleshoot issues quickly:

- **Application Insights (Azure) or CloudWatch (AWS):**  
  • Track API response times, error rates, and request volumes.  

- **Logging:**  
  • Serilog (C#) for structured logs in JSON format.  
  • Vercel Analytics for Next.js performance metrics.

- **Error Tracking:**  
  • Sentry for front-end and back-end error capturing and alerting.

- **Database Monitoring:**  
  • Azure SQL metrics or RDS performance insights to watch CPU, memory, and query latency.

- **Maintenance Strategy:**  
  • Automated database backups with point-in-time restore.  
  • Monthly dependency updates via CI/CD pipeline.  
  • Quarterly security reviews.

## 9. Conclusion and Overall Backend Summary

This backend setup combines a proven ASP.NET C# API with a modern Next.js visualization layer. It delivers:

- Clear separation of concerns, allowing independent scaling and updates.  
- A relational SQL Server database with a straightforward schema for circuit data.  
- Secure, JWT-protected REST endpoints for data access.  
- A high-performance hosting environment using managed cloud services and CDNs.  
- Robust security, monitoring, and maintenance practices to keep the system reliable.

By following this structure, the EIS visualization dashboard can grow over time—adding new data sources, richer visualizations, and higher traffic loads—without sacrificing clarity, performance, or security.