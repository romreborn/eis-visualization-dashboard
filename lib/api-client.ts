// TypeScript interfaces for the EIS circuit data based on the SQL query structure

import { getApiConfig, config } from './config';

export interface CircuitData {
  circuitNdx: number;
  circuitID: string;
  custID: string;
  circuitDesc: string;
  remdesc1: string;
  remdesc2: string;
  remID1: string;
  remIN1: string;
  remID2: string;
  remIN2: string;
  pop_number: string;
  status: string;
  servicetype: string;
  linkCat: string;
  partner: string;
  vrf: string;
  vlanGrpId: string;
  mpnGrpId: string;
  cpeId: string;
  wanIp1: string;
  subnetWanIp1: string;
  wanIp2: string;
  subnetWanIp2: string;
  lanIp1: string;
  subnetLanIp1: string;
  lanIp2: string;
  subnetLanIp2: string;
  cir1: string;
  cir2: string;
  mir1: string;
  mir2: string;
  mrc: string;
  cid1: string;
  cid2: string;
  frq1: string;
  frq2: string;
  modmpn1: string;
  mod1: string;
  fecType1: string;
  codingRate1: string;
  modmpn2: string;
  mod2: string;
  fecType2: string;
  codingRate2: string;
  lfrq1: string;
  lfrq2: string;
  ant1: string;
  ant2: string;
  odu1: string;
  odu2: string;
  idu1: string;
  idu2: string;
  lat1: string;
  long1: string;
  remAddress1: string;
  remRegion1: string;
  contactPerson1: string;
  contactNumber1: string;
  lat2: string;
  long2: string;
  remAddress2: string;
  remRegion2: string;
  contactPerson2: string;
  contactNumber2: string;
  nagHost: string;
  nagDesc: string;
  nagIp: string;
  pm: string;
  postPm: string;
  am: string;
  notes1: string;
  notes2: string;
  notes3: string;
  longNotes: string;
  email1: string;
  email2: string;
  termBackhaulMpls: string;
  impactBackhaulMpls: string;
  impactBackhaulToHo: string;
  protected: string;
  createDate: string;
  createBy: string;
  editDate: string;
  editBy: string;
  sts: string;
  hq: string;
  rfUp1: string;
  rfDown1: string;
  allocated1: string;
  rfUp2: string;
  rfDown2: string;
  allocated2: string;
  oprBy: string;
  oprDate: string;
  activateBy: string;
  activateDate: string;
  dismantleBy: string;
  dismantleDate: string;
  atmId: string;
  custDesc: string;
  remdesc: string;
  remId: string;
  lat: string;
  long: string;
  custIdNumber: string;
  remCity1: string;
  remcity2: string;
  remRegion2: string;
  addOns: string;
  macAddress: string;
  vnoId: string;
  systemCode: string;
  docUrl: string;
  docSd: string;
  docEd: string;
  docSla: string;
  cnc1: string;
  cnc2: string;
  power1: string;
  power2: string;
  rolloff1: string;
  rolloff2: string;
  orf: string;
  poNumber: string;
  reseller: string;
  antenaOwner: string;
  uploadPaketName: string;
  siteName: string;
  starlinkActive: string;
  starlinkDismantle: string;
  starlinkSetOpt: string;
  starlinkCurrentPrioData: number;
  starlinkCurrentOptData: number;
  starlinkIsOpt: string;
  uploadNewPaket: string;
  partnerName: string;
}

// API Response interface
export interface DashboardResponse {
  success: boolean;
  data: CircuitData[];
  message?: string;
  totalRecords?: number;
  timestamp?: string;
}

// Error interface for typed error handling
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// Error types for categorization
export type ErrorType = 'network' | 'auth' | 'server' | 'client' | 'unknown';

// Configuration interface
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Import centralized configuration
import { getApiConfig, config } from './config';

// Default configuration from centralized config
const DEFAULT_CONFIG: ApiConfig = getApiConfig();

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly details?: any;

  constructor(code: string, message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.type = this.categorizeError(statusCode);
  }

  private categorizeError(statusCode: number): ErrorType {
    if (statusCode >= 500) return 'server';
    if (statusCode === 401 || statusCode === 403) return 'auth';
    if (statusCode >= 400 && statusCode < 500) return 'client';
    if (statusCode === 0) return 'network';
    return 'unknown';
  }
}

/**
 * Get authentication token from session
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const { getSession } = await import('./auth-client');
    const session = await getSession();
    return session?.data?.token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make authenticated API requests with retry logic
 */
async function makeRequest<T>(
  url: string,
  options: RequestInit = {},
  config: ApiConfig = DEFAULT_CONFIG
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
    try {
      // Get auth token for each attempt
      const token = await getAuthToken();

      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle successful responses
        if (response.ok) {
          return await response.json();
        }

        // Handle error responses
        const errorData = await response.json().catch(() => ({}));
        throw new ApiClientError(
          errorData.code || 'API_ERROR',
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      } catch (fetchError) {
        clearTimeout(timeoutId);

        // Re-throw ApiClientError as-is
        if (fetchError instanceof ApiClientError) {
          throw fetchError;
        }

        // Handle network errors or timeout
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new ApiClientError(
              'TIMEOUT_ERROR',
              'Request timeout',
              0,
              { timeout: config.timeout }
            );
          }

          if (fetchError.message.includes('fetch')) {
            throw new ApiClientError(
              'NETWORK_ERROR',
              'Network connection failed',
              0,
              { originalError: fetchError.message }
            );
          }
        }

        throw fetchError;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on authentication errors or client errors (4xx)
      if (lastError instanceof ApiClientError &&
          (lastError.type === 'auth' || lastError.type === 'client')) {
        break;
      }

      // If this is the last attempt, don't wait
      if (attempt < config.retryAttempts) {
        console.warn(`API request failed (attempt ${attempt}/${config.retryAttempts}):`, lastError.message);
        await sleep(config.retryDelay * attempt); // Exponential backoff
      }
    }
  }

  // All attempts failed
  throw lastError || new Error('Unknown error occurred');
}

/**
 * Fetch dashboard data from the ASP.NET backend API
 */
export async function getDashboardData(
  params?: {
    limit?: number;
    offset?: number;
    status?: string;
    servicetype?: string;
    partner?: string;
  }
): Promise<DashboardResponse> {
  const config = { ...DEFAULT_CONFIG };

  // Build query string
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.servicetype) searchParams.append('servicetype', params.servicetype);
  if (params?.partner) searchParams.append('partner', params.partner);

  const queryString = searchParams.toString();
  const url = `${config.baseUrl}/circuits/report${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await makeRequest<DashboardResponse>(url, undefined, config);
    return response;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
}

/**
 * Test API connectivity
 */
export async function testApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const config = { ...DEFAULT_CONFIG };
    const url = `${config.baseUrl}/health`;

    await makeRequest(url, undefined, config);

    return {
      success: true,
      message: 'API connection successful'
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        message: `API connection failed: ${error.message}`
      };
    }

    return {
      success: false,
      message: 'Unknown error occurred during API connection test'
    };
  }
}

/**
 * Get aggregated statistics for dashboard
 */
export async function getDashboardStats(): Promise<{
  totalCircuits: number;
  activeCircuits: number;
  circuitsByStatus: Record<string, number>;
  circuitsByServiceType: Record<string, number>;
  circuitsByPartner: Record<string, number>;
}> {
  try {
    const response = await getDashboardData();

    if (!response.success || !response.data) {
      throw new Error('Invalid response from API');
    }

    const circuits = response.data;

    // Calculate statistics
    const totalCircuits = circuits.length;
    const activeCircuits = circuits.filter(c => c.status === 'Active').length;

    const circuitsByStatus = circuits.reduce((acc, circuit) => {
      const status = circuit.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const circuitsByServiceType = circuits.reduce((acc, circuit) => {
      const serviceType = circuit.servicetype || 'Unknown';
      acc[serviceType] = (acc[serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const circuitsByPartner = circuits.reduce((acc, circuit) => {
      const partner = circuit.partnerName || circuit.partner || 'Unknown';
      acc[partner] = (acc[partner] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCircuits,
      activeCircuits,
      circuitsByStatus,
      circuitsByServiceType,
      circuitsByPartner,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

export default {
  getDashboardData,
  testApiConnection,
  getDashboardStats,
};