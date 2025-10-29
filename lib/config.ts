/**
 * Centralized configuration management for the EIS Dashboard
 * Provides type-safe access to environment variables with defaults
 */

// Environment variable interface for type safety
export interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  apiRetryAttempts: number;
  apiRetryDelay: number;

  // Authentication Configuration
  betterAuthSecret: string;
  betterAuthUrl: string;
  publicBetterAuthUrl: string;

  // Database Configuration
  databaseUrl: string;
  postgresDb: string;
  postgresUser: string;
  postgresPassword: string;

  // Application Configuration
  nodeEnv: string;
  appUrl: string;
  appPort: string;

  // CORS Configuration
  allowedOrigins: string[];

  // Feature Flags
  enableMockData: boolean;
  enableDebugLogging: boolean;
}

/**
 * Get required environment variable or throw error
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Required environment variable ${key} is missing or empty`);
  }
  return value.trim();
}

/**
 * Get optional environment variable with default value
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  const value = process.env[key];
  return (value && value.trim() !== '') ? value.trim() : defaultValue;
}

/**
 * Parse boolean environment variable
 */
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
}

/**
 * Parse number environment variable
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse comma-separated list into array
 */
function parseArray(value: string | undefined, defaultValue: string[] = []): string[] {
  if (!value || value.trim() === '') return defaultValue;
  return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
}

/**
 * Application configuration object
 */
export const config: AppConfig = {
  // API Configuration
  apiBaseUrl: getOptionalEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:5000/api'),
  apiTimeout: parseNumber(getOptionalEnv('API_TIMEOUT', '30000'), 30000),
  apiRetryAttempts: parseNumber(getOptionalEnv('API_RETRY_ATTEMPTS', '3'), 3),
  apiRetryDelay: parseNumber(getOptionalEnv('API_RETRY_DELAY', '1000'), 1000),

  // Authentication Configuration
  betterAuthSecret: getRequiredEnv('BETTER_AUTH_SECRET'),
  betterAuthUrl: getOptionalEnv('BETTER_AUTH_URL', 'http://localhost:3000'),
  publicBetterAuthUrl: getOptionalEnv('NEXT_PUBLIC_BETTER_AUTH_URL', 'http://localhost:3000'),

  // Database Configuration
  databaseUrl: getOptionalEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5433/postgres'),
  postgresDb: getOptionalEnv('POSTGRES_DB', 'postgres'),
  postgresUser: getOptionalEnv('POSTGRES_USER', 'postgres'),
  postgresPassword: getOptionalEnv('POSTGRES_PASSWORD', 'postgres'),

  // Application Configuration
  nodeEnv: getOptionalEnv('NODE_ENV', 'development'),
  appUrl: getOptionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  appPort: getOptionalEnv('PORT', '3000'),

  // CORS Configuration
  allowedOrigins: parseArray(
    getOptionalEnv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001'),
    ['http://localhost:3000', 'http://localhost:3001']
  ),

  // Feature Flags
  enableMockData: parseBoolean(getOptionalEnv('ENABLE_MOCK_DATA', 'false'), false),
  enableDebugLogging: parseBoolean(getOptionalEnv('ENABLE_DEBUG_LOGGING', process.env.NODE_ENV === 'development'), true),
};

/**
 * Validate that all required environment variables are present
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    // This will throw if required variables are missing
    getRequiredEnv('BETTER_AUTH_SECRET');
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    }
  }

  // Validate URL formats
  try {
    new URL(config.apiBaseUrl);
  } catch {
    errors.push(`Invalid API_BASE_URL: ${config.apiBaseUrl}`);
  }

  try {
    new URL(config.betterAuthUrl);
  } catch {
    errors.push(`Invalid BETTER_AUTH_URL: ${config.betterAuthUrl}`);
  }

  try {
    new URL(config.publicBetterAuthUrl);
  } catch {
    errors.push(`Invalid NEXT_PUBLIC_BETTER_AUTH_URL: ${config.publicBetterAuthUrl}`);
  }

  // Validate numeric values
  if (config.apiTimeout <= 0) {
    errors.push('API_TIMEOUT must be greater than 0');
  }

  if (config.apiRetryAttempts < 0) {
    errors.push('API_RETRY_ATTEMPTS must be non-negative');
  }

  if (config.apiRetryDelay < 0) {
    errors.push('API_RETRY_DELAY must be non-negative');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Log configuration summary (for debugging purposes)
 */
export function logConfigSummary(): void {
  if (!config.enableDebugLogging) return;

  console.log('📊 EIS Dashboard Configuration Summary:');
  console.log(`   • API Base URL: ${config.apiBaseUrl}`);
  console.log(`   • Auth URL: ${config.publicBetterAuthUrl}`);
  console.log(`   • Environment: ${config.nodeEnv}`);
  console.log(`   • Debug Logging: ${config.enableDebugLogging}`);
  console.log(`   • Mock Data: ${config.enableMockData}`);
  console.log(`   • API Timeout: ${config.apiTimeout}ms`);
  console.log(`   • Retry Attempts: ${config.apiRetryAttempts}`);
  console.log(`   • Allowed Origins: ${config.allowedOrigins.join(', ')}`);
}

/**
 * Get database configuration object
 */
export function getDatabaseConfig() {
  return {
    url: config.databaseUrl,
    database: config.postgresDb,
    user: config.postgresUser,
    password: config.postgresPassword,
  };
}

/**
 * Get API configuration object
 */
export function getApiConfig() {
  return {
    baseUrl: config.apiBaseUrl,
    timeout: config.apiTimeout,
    retryAttempts: config.apiRetryAttempts,
    retryDelay: config.apiRetryDelay,
  };
}

/**
 * Get CORS configuration object
 */
export function getCorsConfig() {
  return {
    origin: config.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
}

/**
 * Environment-specific configurations
 */
export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
export const isTest = config.nodeEnv === 'test';

export default config;