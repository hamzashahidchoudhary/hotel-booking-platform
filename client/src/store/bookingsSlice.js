import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api.js";

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/bookings", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create booking");
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMine",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/bookings/mine", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load bookings");
    }
  }
);

export const fetchHostBookings = createAsyncThunk(
  "bookings/fetchHost",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/bookings/host", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load bookings");
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Booking not found");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async ({ id, cancellationReason }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/bookings/${id}/cancel`, { cancellationReason });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel booking");
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  "bookings/checkout",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await api.post("/payments/create-checkout-session", { bookingId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start checkout");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    myBookings: [],
    hostBookings: [],
    current: null,
    status: "idle",
    checkoutStatus: "idle",
    error: null,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload.booking;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.myBookings = action.payload.bookings;
      })
      .addCase(fetchHostBookings.fulfilled, (state, action) => {
        state.hostBookings = action.payload.bookings;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.current = action.payload.booking;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.current = action.payload.booking;
        state.myBookings = state.myBookings.map((b) =>
          b._id === action.payload.booking._id ? action.payload.booking : b
        );
        state.hostBookings = state.hostBookings.map((b) =>
          b._id === action.payload.booking._id ? action.payload.booking : b
        );
      })
      .addCase(createCheckoutSession.pending, (state) => {
        state.checkoutStatus = "loading";
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.checkoutStatus = "succeeded";
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.checkoutStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearBookingError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
