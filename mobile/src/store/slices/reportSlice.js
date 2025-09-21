import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,
  totalReports: 0,
  verifiedReports: 0,
  totalEarnings: 0,
  successRate: 0,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
      // Update calculated stats
      state.totalReports = action.payload.length;
      state.verifiedReports = action.payload.filter(r => r.status === 'verified').length;
      state.totalEarnings = action.payload.reduce((sum, r) => sum + (r.reward || 0), 0);
      state.successRate = state.totalReports > 0 ? Math.round((state.verifiedReports / state.totalReports) * 100) : 0;
    },
    addReport: (state, action) => {
      state.reports.unshift(action.payload);
      // Update calculated stats
      state.totalReports = state.reports.length;
      state.verifiedReports = state.reports.filter(r => r.status === 'verified').length;
      state.totalEarnings = state.reports.reduce((sum, r) => sum + (r.reward || 0), 0);
      state.successRate = state.totalReports > 0 ? Math.round((state.verifiedReports / state.totalReports) * 100) : 0;
    },
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateReport: (state, action) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...action.payload };
        // Update calculated stats
        state.verifiedReports = state.reports.filter(r => r.status === 'verified').length;
        state.totalEarnings = state.reports.reduce((sum, r) => sum + (r.reward || 0), 0);
        state.successRate = state.totalReports > 0 ? Math.round((state.verifiedReports / state.totalReports) * 100) : 0;
      }
    },
    // Simulate police verification (for demo purposes)
    verifyReport: (state, action) => {
      const { reportId, isApproved, reward } = action.payload;
      const index = state.reports.findIndex(report => report.id === reportId);
      if (index !== -1) {
        state.reports[index].status = isApproved ? 'verified' : 'rejected';
        if (isApproved) {
          state.reports[index].reward = reward || Math.floor(Math.random() * 450) + 50; // Random reward 50-500
        }
        // Update calculated stats
        state.verifiedReports = state.reports.filter(r => r.status === 'verified').length;
        state.totalEarnings = state.reports.reduce((sum, r) => sum + (r.reward || 0), 0);
        state.successRate = state.totalReports > 0 ? Math.round((state.verifiedReports / state.totalReports) * 100) : 0;
      }
    },
  },
});

export const {
  setLoading,
  setReports,
  addReport,
  setCurrentReport,
  setError,
  clearError,
  updateReport,
  verifyReport
} = reportSlice.actions;
export default reportSlice.reducer;
