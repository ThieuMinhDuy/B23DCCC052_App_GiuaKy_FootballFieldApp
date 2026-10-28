import AsyncStorage from '@react-native-async-storage/async-storage';
import { Field } from '../types/field';
import { Booking } from '../types/booking';
import { initialFields, initialBookings } from './mockData';

// Key luu tru danh sach san
const FIELDS_STORAGE_KEY = '@FootballFieldApp:fields';

// Key luu tru danh sach dat san
const BOOKINGS_STORAGE_KEY = '@FootballFieldApp:bookings';

// Doi tuong quan ly storage
export const storage = {
  // Doc danh sach san tu AsyncStorage
  async loadFields(): Promise<Field[]> {
    try {
      const data = await AsyncStorage.getItem(FIELDS_STORAGE_KEY);
      if (data !== null) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(initialFields));
      return initialFields;
    } catch (error) {
      console.error('Lỗi khi đọc danh sách sân từ AsyncStorage:', error);
      return initialFields;
    }
  },

  // Luu danh sach san vao AsyncStorage
  async saveFields(fields: Field[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(fields));
    } catch (error) {
      console.error('Lỗi khi lưu danh sách sân vào AsyncStorage:', error);
    }
  },

  // Doc danh sach dat san tu AsyncStorage
  async loadBookings(): Promise<Booking[]> {
    try {
      const data = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (data !== null) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(initialBookings));
      return initialBookings;
    } catch (error) {
      console.error('Lỗi khi đọc danh sách đặt sân từ AsyncStorage:', error);
      return initialBookings;
    }
  },

  // Luu danh sach dat san vao AsyncStorage
  async saveBookings(bookings: Booking[]): Promise<void> {
    try {
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Lỗi khi lưu danh sách đặt sân vào AsyncStorage:', error);
    }
  },

  // Reset du lieu ve mau ban dau
  async resetToDefault(): Promise<{ fields: Field[]; bookings: Booking[] }> {
    try {
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(initialFields));
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(initialBookings));
      return { fields: initialFields, bookings: initialBookings };
    } catch (error) {
      console.error('Lỗi khi reset dữ liệu:', error);
      return { fields: initialFields, bookings: initialBookings };
    }
  },
};
