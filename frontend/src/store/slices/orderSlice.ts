import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: false,
    prix: 0, // Added default value
    productName: "", // Added default value
    thankYouButton:true,
  },
  reducers: {
    setOrderState(state, action) {
      state.order = action.payload.order; // true or false from dispatch
      state.prix = action.payload.prix;
      state.productName = action.payload.productName;
      state.thankYouButton = action.payload.thankYouButton;
    },
  },
});

export const { setOrderState } = orderSlice.actions;
export default orderSlice.reducer;