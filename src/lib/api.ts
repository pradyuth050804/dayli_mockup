/**
 * API service layer for communicating with the Spring Boot backend.
 * All backend endpoints remain unchanged — this module adapts the
 * frontend Supabase auth tokens to the backend's expected format.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ─── Response wrapper matching com.mendrx.backend.model.response.ApiResponse ───

export interface ApiResponse<T> {
  data: T | null;
  status: string;
  message: string;
}

// ─── Parameter & Blood Marker types (matching backend shared models) ───

export interface ParameterInfo {
  minValue: number;
  maxValue: number;
}

export interface ParameterData {
  parameterName: string;
  value: string;
  units: string;
  parameterInfo: ParameterInfo | null;
}

export interface ParameterUnitMismatch {
  parameterName: string;
  extractedUnit: string;
  expectedUnit: string;
}

export type BloodMarkerResult = 'LOW' | 'OPTIMAL' | 'HIGH';
export type BloodPanelStatus = 'GOOD' | 'FAIR' | 'POOR';

export interface BloodMarker extends ParameterData {
  result: BloodMarkerResult;
  deviation: number;
  reason: string | null;
}

export interface BloodPanel {
  name: string;
  healthScore: string;
  status: BloodPanelStatus;
}

// ─── Client ───

export interface ClientInfo {
  id: string;
  name: string;
  phoneNumber: string;
  gender: string;
  birthMonth: string;
  email: string;
}

// ─── /readfile response ───

export interface ReadFileResponse {
  data: Record<string, ParameterData[]>;
  message: string;
  reportId: string;
  largelyDeviatedParams: string[];
  unitMismatches: ParameterUnitMismatch[] | null;
}

// ─── /analyse request & response ───

export interface AnalysisRequest {
  reportId: string;
  bloodReportData: ParameterData[];
}

export interface Report {
  id: string;
  client: ClientInfo;
  reportDate: string;
  height: number | null;
  weight: number | null;
  waist: number | null;
  diet: string | null;
  lifestyleHabits: string[];
  existingConditions: string[];
  bloodPanelListMap: Record<string, BloodMarker[]>;
  notes: string;
  bmi: number | null;
  gender: string;
  currentAge: number;
  ageOnReportDate: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResponse {
  report: Report;
  consumedCredits: number;
  updatedCredits: number;
}

// ─── User DTO ───

export interface UserDTO {
  email: string;
  type: string;
  credits: number;
  subscriptionExpiry: string;
}

// ─── Helper: build headers ───

function authHeaders(token: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${token}`,
  };
}

// ─── API Functions ───

/**
 * Check if the current user is registered in the backend.
 * Returns user info if found, null data if not.
 */
export async function getUser(token: string): Promise<ApiResponse<UserDTO>> {
  const res = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  return res.json();
}

/**
 * Fetch existing clients for the current user.
 */
export async function getClients(token: string): Promise<ApiResponse<{ content: ClientInfo[] }>> {
  const res = await fetch(`${API_URL}/clients?page=0&size=100`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  return res.json();
}

/**
 * Register the current Supabase user in the backend.
 * Backend creates User + Parent + Subscription records.
 */
export async function registerUser(token: string, email: string): Promise<ApiResponse<UserDTO>> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const json = await res.json();
  // If user already exists, treat as success and fetch their info
  if (!res.ok && json.status === 'REGISTRATION_FAILED' && json.message?.includes('already exists')) {
    const userRes = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: authHeaders(token),
    });
    return userRes.json();
  }
  return json;
}

/**
 * Create a client (patient) record in the backend.
 */
export async function createClient(
  token: string,
  data: { name: string; phoneNumber: string; gender: string; birthMonth: string; email?: string }
): Promise<ApiResponse<ClientInfo>> {
  const res = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();

  // If client already exists, fetch existing clients and return the matching one
  if (!res.ok && json.status === 'DUPLICATE_CLIENT') {
    const listRes = await fetch(`${API_URL}/clients?page=0&size=100`, {
      method: 'GET',
      headers: authHeaders(token),
    });
    const listJson = await listRes.json();
    const clients = listJson.data?.content || [];
    const match = clients.find(
      (c: ClientInfo) => c.name === data.name && c.phoneNumber === data.phoneNumber && c.gender === data.gender
    );
    if (match) {
      return { data: match, status: 'OK', message: 'Using existing client' };
    }
    // If no exact match found, return the first client as fallback
    if (clients.length > 0) {
      return { data: clients[0], status: 'OK', message: 'Using existing client' };
    }
  }
  return json;
}

/**
 * Upload blood report PDF(s) to extract biomarkers.
 * Maps to POST /readfile — multipart/form-data.
 */
export async function uploadReport(
  token: string,
  files: File[],
  clientId: string,
  reportDate: string,
  surveyData?: {
    height?: number;
    weight?: number;
    waist?: number;
    diet?: string;
    lifestyleHabits?: string[];
    existingConditions?: string[];
  }
): Promise<ApiResponse<ReadFileResponse>> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  formData.append('clientId', clientId);
  formData.append('reportDate', reportDate);

  if (surveyData?.height) formData.append('height', String(surveyData.height));
  if (surveyData?.weight) formData.append('weight', String(surveyData.weight));
  if (surveyData?.waist) formData.append('waist', String(surveyData.waist));
  if (surveyData?.diet) formData.append('diet', surveyData.diet);
  if (surveyData?.lifestyleHabits) {
    surveyData.lifestyleHabits.forEach((h) => formData.append('lifestyleHabits', h));
  }
  if (surveyData?.existingConditions) {
    surveyData.existingConditions.forEach((c) => formData.append('existingConditions', c));
  }

  const res = await fetch(`${API_URL}/readfile`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });
  return res.json();
}

/**
 * Trigger full analysis (RCA) for a previously uploaded report.
 * Maps to POST /analyse — JSON body.
 */
export async function analyseReport(
  token: string,
  reportId: string,
  bloodReportData: ParameterData[]
): Promise<ApiResponse<AnalysisResponse>> {
  const res = await fetch(`${API_URL}/analyse`, {
    method: 'POST',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reportId, bloodReportData }),
  });
  return res.json();
}

/**
 * Fetch a previously generated report.
 * Maps to GET /report/:reportId
 */
export async function getReport(token: string, reportId: string): Promise<ApiResponse<Report>> {
  const res = await fetch(`${API_URL}/report/${reportId}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  return res.json();
}
