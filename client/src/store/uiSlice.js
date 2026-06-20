import { createSlice } from "@reduxjs/toolkit";

let toastId = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toasts: [], // { id, message, type: 'success' | 'error' | 'info' }
  },
  reducers: {
    showToast: (state, action) => {
      state.toasts.push({ id: ++toastId, ...action.payload });
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
