import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IProduct } from "../../types/product";

export interface ModalState {
  isOpen: boolean;
  product: Partial<IProduct> | null;
}

const initialState: ModalState = {
  isOpen: false,
  product: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Partial<IProduct>>) => {
      state.isOpen = true;
      state.product = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.product = null;
    },
    updateProduct: (state, action: PayloadAction<Partial<IProduct>>) => {
      state.product = { ...state.product, ...action.payload };
    },
  },
});

export const { openModal, closeModal, updateProduct } = modalSlice.actions;
export default modalSlice.reducer;
