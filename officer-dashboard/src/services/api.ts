// API service to interact with the backend server
const API_BASE_URL = 'http://localhost:3001/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Utility function to make fetch requests with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Retry logic for failed requests
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options);
      
      // If response is ok or it's a client error (4xx), don't retry
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }
      
      // Server error (5xx), retry
      if (i < retries - 1) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 5000);
        console.log(`Retrying request in ${waitTime}ms... (attempt ${i + 2}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    } catch (error: any) {
      if (i === retries - 1) {
        throw error;
      }
      
      // Only retry on network errors or timeouts
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 5000);
        console.log(`Network error, retrying in ${waitTime}ms... (attempt ${i + 2}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  
  throw new Error('Max retries exceeded');
}

export interface Report {
  _id: string;
  id: string;
  violationType: string;
  aiConfidence: number;
  zone: string;
  timestamp: string;
  status: "Pending" | "Verified" | "Rejected";
  thumbnail: string;
  vehicleNumber?: string;
  location?: string;
  fineAmount?: number;
}

export interface DashboardStats {
  totalReports: number;
  verifiedReports: number;
  pendingReports: number;
  totalFines: number;
  violationTypes: Array<{ _id: string; count: number }>;
  weeklyTrend: Array<{ _id: string; count: number }>;
}

export const fetchReports = async (): Promise<Report[]> => {
  try {
    console.log('📥 Fetching reports from API...');
    const response = await fetchWithRetry(`${API_BASE_URL}/reports`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch reports`);
    }
    
    const reports = await response.json();
    console.log(`✅ Received ${reports.length} reports from API`);
    console.log('📋 Sample report from MongoDB:', reports[0]);
    
    // Map MongoDB data to frontend format - flexible field mapping
    return reports.map((report: any) => {
      // Handle different possible field names from MongoDB
      const reportId = report.reportId || report.id || report._id?.toString() || 'N/A';
      const timestamp = report.timestamp || report.createdAt || report.date || new Date();
      const imageUrl = report.imageUrl || report.thumbnail || report.image || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100&h=100&fit=crop';
      
      // Handle location - could be string or object
      let locationString = '';
      if (typeof report.location === 'string') {
        locationString = report.location;
      } else if (typeof report.location === 'object' && report.location !== null) {
        // If location is an object, extract meaningful parts
        locationString = report.location.address || report.location.landmark || 
                        (report.location.coordinates ? `${report.location.coordinates[0]}, ${report.location.coordinates[1]}` : '');
      } else if (report.address) {
        locationString = report.address;
      }
      
      return {
        _id: report._id?.toString() || '',
        id: reportId,
        violationType: report.violationType || report.violation || report.type || 'Unknown',
        aiConfidence: typeof report.aiConfidence === 'number' ? Math.min(100, Math.max(0, report.aiConfidence)) : 
                     typeof report.confidence === 'number' ? Math.min(100, Math.max(0, report.confidence)) : 0,
        zone: report.zone || report.area || 'Unknown',
        timestamp: timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString(),
        status: ['Pending', 'Verified', 'Rejected'].includes(report.status) ? report.status : 'Pending',
        thumbnail: imageUrl,
        vehicleNumber: report.vehicleNumber || report.vehicleNo || report.vehicle || '',
        location: locationString,
        fineAmount: typeof report.fineAmount === 'number' ? report.fineAmount : 
                   typeof report.fine === 'number' ? report.fine : 0
      };
    });
  } catch (error: any) {
    console.error('❌ Error fetching reports:', error);
    
    // Provide user-friendly error message
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    
    throw error;
  }
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log('📊 Fetching dashboard statistics from API...');
    const response = await fetchWithRetry(`${API_BASE_URL}/dashboard/stats`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch dashboard stats`);
    }
    
    const stats = await response.json();
    console.log('✅ Dashboard statistics received successfully');
    
    // Validate and sanitize the data
    return {
      totalReports: typeof stats.totalReports === 'number' ? stats.totalReports : 0,
      verifiedReports: typeof stats.verifiedReports === 'number' ? stats.verifiedReports : 0,
      pendingReports: typeof stats.pendingReports === 'number' ? stats.pendingReports : 0,
      totalFines: typeof stats.totalFines === 'number' ? stats.totalFines : 0,
      violationTypes: Array.isArray(stats.violationTypes) ? stats.violationTypes.map((vt: any) => ({
        _id: vt._id || 'Unknown',
        count: typeof vt.count === 'number' ? vt.count : 0
      })) : [],
      weeklyTrend: Array.isArray(stats.weeklyTrend) ? stats.weeklyTrend.map((wt: any) => ({
        _id: wt._id || '',
        count: typeof wt.count === 'number' ? wt.count : 0
      })) : []
    };
  } catch (error: any) {
    console.error('❌ Error fetching dashboard stats:', error);
    
    // Provide user-friendly error message
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    
    throw error;
  }
};

export const updateReportStatus = async (reportId: string, status: "Verified" | "Rejected" | "Pending") => {
  try {
    console.log(`📝 Updating report ${reportId} to status: ${status}`);
    const response = await fetchWithRetry(`${API_BASE_URL}/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Failed to update report status`);
    }
    
    const result = await response.json();
    console.log('✅ Report status updated successfully');
    return result;
  } catch (error: any) {
    console.error('❌ Error updating report status:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    
    throw error;
  }
};

// Health check function
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
    if (response.ok) {
      const data = await response.json();
      return data.status === 'OK' && data.database === 'connected';
    }
    return false;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
