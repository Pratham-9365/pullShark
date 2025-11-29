import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/auth";

// ======================================================
// FETCH THUNK
// ======================================================
export const fetchReposThunk = createAsyncThunk(
  "repos/fetch",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/auth/repos?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      return res.data; // { success, repos, pagination }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch repos" }
      );
    }
  }
);

// ======================================================
// SLICE
// ======================================================
const repoSlice = createSlice({
  name: "repos",

  initialState: {
    repos: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },

  reducers: {
    changePage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // --------------------
      // PENDING
      // --------------------
      .addCase(fetchReposThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // --------------------
      // SUCCESS
      // --------------------
      .addCase(fetchReposThunk.fulfilled, (state, action) => {
        state.loading = false;

        // Update repo list
        state.repos = action.payload.repos || [];

        // Replace pagination completely to avoid stale values
        const p = action.payload.pagination || {};
        state.pagination = {
          page: p.page ?? 1,
          hasNextPage: p.hasNextPage ?? false,
          hasPrevPage: p.hasPrevPage ?? false,
        };
      })

      // --------------------
      // ERROR
      // --------------------
      .addCase(fetchReposThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch repos";
      });
  },
});

export const { changePage } = repoSlice.actions;
export default repoSlice.reducer;
