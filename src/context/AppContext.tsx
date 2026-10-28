import React, { createContext, useContext, useState, useEffect } from 'react';
import { Field } from '../types/field';
import { Booking } from '../types/booking';
import { storage } from '../services/storage';
import { isBookingOverlap } from '../utils/validators';

// Interface dinh nghia kieu AppContext
export interface AppContextType {
  fields: Field[];
  bookings: Booking[];
  isLoading: boolean;
  addField: (fieldData: Omit<Field, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateField: (field: Field) => Promise<{ success: boolean; error?: string }>;
  deleteField: (fieldId: string) => Promise<{ success: boolean; error?: string }>;
  addBooking: (bookingData: Omit<Booking, 'id'>) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean }>;
  hasBookings: (fieldId: string) => boolean;
  getBookingsByField: (fieldId: string) => Booking[];
  getFieldById: (fieldId: string) => Field | undefined;
  refreshData: () => Promise<void>;
}

// Khoi tao Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Interface props cho AppProvider
interface AppProviderProps {
  children: React.ReactNode;
}

// Component Provider cung cap state toan cuc
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State danh sach san
  const [fields, setFields] = useState<Field[]>([]);

  // State danh sach dat san
  const [bookings, setBookings] = useState<Booking[]>([]);

  // State trang thai loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tai du lieu ban dau tu storage
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const loadedFields = await storage.loadFields();
      const loadedBookings = await storage.loadBookings();
      setFields(loadedFields);
      setBookings(loadedBookings);
    } catch (error) {
      console.error('Lỗi khi nạp dữ liệu từ storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Them san bong moi
  const addField = async (
    fieldData: Omit<Field, 'id'>
  ): Promise<{ success: boolean; error?: string }> => {
    const isDuplicate = fields.some(
      (f) => f.name.trim().toLowerCase() === fieldData.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'Tên sân đã tồn tại, vui lòng chọn tên khác.' };
    }

    const newField: Field = {
      ...fieldData,
      id: 'field_' + Date.now().toString(),
    };
    const nextFields = [...fields, newField];
    setFields(nextFields);
    await storage.saveFields(nextFields);
    return { success: true };
  };

  // Cap nhat thong tin san bong
  const updateField = async (field: Field): Promise<{ success: boolean; error?: string }> => {
    const isDuplicate = fields.some(
      (f) => f.id !== field.id && f.name.trim().toLowerCase() === field.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'Tên sân đã tồn tại, vui lòng chọn tên khác.' };
    }

    const nextFields = fields.map((f) => (f.id === field.id ? field : f));
    setFields(nextFields);
    await storage.saveFields(nextFields);
    return { success: true };
  };

  // Xoa san bong
  const deleteField = async (fieldId: string): Promise<{ success: boolean; error?: string }> => {
    const isUsed = bookings.some((b) => b.fieldId === fieldId);
    if (isUsed) {
      return { success: false, error: 'Không thể xoá sân đang có lượt đặt!' };
    }

    const nextFields = fields.filter((f) => f.id !== fieldId);
    setFields(nextFields);
    await storage.saveFields(nextFields);
    return { success: true };
  };

  // Them luot dat san moi
  const addBooking = async (
    bookingData: Omit<Booking, 'id'>
  ): Promise<{ success: boolean; error?: string }> => {
    const overlap = isBookingOverlap(bookingData, bookings);
    if (overlap) {
      return { success: false, error: 'Khung giờ đặt sân đã bị trùng với lượt đặt khác!' };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: 'booking_' + Date.now().toString(),
    };
    const nextBookings = [...bookings, newBooking];
    setBookings(nextBookings);
    await storage.saveBookings(nextBookings);
    return { success: true };
  };

  // Huy luot dat san
  const cancelBooking = async (bookingId: string): Promise<{ success: boolean }> => {
    const nextBookings = bookings.filter((b) => b.id !== bookingId);
    setBookings(nextBookings);
    await storage.saveBookings(nextBookings);
    return { success: true };
  };

  // Kiem tra san co luot dat hay khong
  const hasBookings = (fieldId: string): boolean => {
    return bookings.some((b) => b.fieldId === fieldId);
  };

  // Lay danh sach dat san theo id san
  const getBookingsByField = (fieldId: string): Booking[] => {
    return bookings.filter((b) => b.fieldId === fieldId);
  };

  // Lay thong tin san theo id
  const getFieldById = (fieldId: string): Field | undefined => {
    return fields.find((f) => f.id === fieldId);
  };

  // Lam moi du lieu
  const refreshData = async (): Promise<void> => {
    await loadInitialData();
  };

  // Gia tri chia se trong Context
  const value: AppContextType = {
    fields,
    bookings,
    isLoading,
    addField,
    updateField,
    deleteField,
    addBooking,
    cancelBooking,
    hasBookings,
    getBookingsByField,
    getFieldById,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook su dung AppContext
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp phải được sử dụng bên trong AppProvider');
  }
  return context;
};
