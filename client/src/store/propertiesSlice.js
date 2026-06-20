import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api.js";

export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/properties", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load properties");
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Property not found");
    }
  }
);

export const fetchMyProperties = createAsyncThunk(
  "properties/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/properties/host/mine");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load your listings");
    }
  }
);

export const createProperty = createAsyncThunk(
  "properties/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create listing");
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update listing");
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/properties/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete listing");
    }
  }
);

const initialFilters = {
  city: "",
  minPrice: "",
  maxPrice: "",
  guests: "",
  propertyType: "",
  amenities: [],
  checkIn: "",
  checkOut: "",
  sort: "newest",
  page: 1,
  search: "",
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState: {
    list: [],
    total: 0,
    pages: 1,
    page: 1,
    current: null,
    unavailableRanges: [],
    myProperties: [],
    filters: initialFilters,
    status: "idle",
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    clearCurrentProperty: (state) => {
      state.current = null;
      state.unavailableRanges = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.properties;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.status = "loading";
        state.current = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload.property;
        state.unavailableRanges = action.payload.unavailableRanges;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myProperties = action.payload.properties;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.myProperties.unshift(action.payload.property);
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        const idx = state.myProperties.findIndex((p) => p._id === action.payload.property._id);
        if (idx > -1) state.myProperties[idx] = action.payload.property;
        if (state.current?._id === action.payload.property._id) {
          state.current = action.payload.property;
        }
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.myProperties = state.myProperties.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setFilters, setPage, resetFilters, clearCurrentProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;
