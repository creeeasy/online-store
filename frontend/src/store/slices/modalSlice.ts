import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IProduct } from "../../types/product";

export type ModalType = 'deleteProduct' | 'editProduct' | 'createProduct' | 'viewProduct';

// Interface for opening modal with different configurations
interface OpenModalPayload {
  modalType: ModalType;
  product?: IProduct;
}

// Modal state interface following best practices
export interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  product: IProduct | null;
  isLoading: boolean; 
  error: string | null;
}

// Initial state with proper defaults
const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  product: null,
  isLoading: false,
  error: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // Open modal with specific type and configuration
    openModal: (state, action: PayloadAction<OpenModalPayload>) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.product = action.payload.product || null;
      state.error = null;
    },

    // Close modal and reset all related state
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.product = null;
      state.isLoading = false;
      state.error = null;
    },

    // Update product data in modal (for edit operations)
    updateModalProduct: (state, action: PayloadAction<Partial<IProduct>>) => {
      if (state.product) {
        state.product = { ...state.product, ...action.payload };
      }
    },

    // Set loading state for async operations
    setModalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when starting new operation
      }
    },

    // Set error state
    setModalError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false; // Stop loading when error occurs
    },

    clearModalError: (state) => {
      state.error = null;
    },

    // Reset modal to initial state (useful for cleanup)
    resetModal: () => initialState,
  },
});

export const {
  openModal,
  closeModal,
  updateModalProduct,
  setModalLoading,
  setModalError,
  clearModalError,
  resetModal,
} = modalSlice.actions;

export default modalSlice.reducer;

export const selectModal = (state: { modal: ModalState }) => state.modal;
export const selectIsModalOpen = (state: { modal: ModalState }) => state.modal.isOpen;
export const selectModalType = (state: { modal: ModalState }) => state.modal.modalType;
export const selectModalProduct = (state: { modal: ModalState }) => state.modal.product;
export const selectModalLoading = (state: { modal: ModalState }) => state.modal.isLoading;
export const selectModalError = (state: { modal: ModalState }) => state.modal.error;

export const isDeleteModal = (modalType: ModalType | null): modalType is 'deleteProduct' => 
  modalType === 'deleteProduct';

export const isEditModal = (modalType: ModalType | null): modalType is 'editProduct' => 
  modalType === 'editProduct';
