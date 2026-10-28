import { Field } from '../types/field';
import { Booking } from '../types/booking';

// Danh sach san mau ban dau
export const initialFields: Field[] = [
  {
    id: 'field_1',
    name: 'Sân A1',
    type: '5 người',
    pricePerHour: 250000,
    status: 'Hoạt động',
  },
  {
    id: 'field_2',
    name: 'Sân A2',
    type: '5 người',
    pricePerHour: 250000,
    status: 'Hoạt động',
  },
  {
    id: 'field_3',
    name: 'Sân B1',
    type: '7 người',
    pricePerHour: 350000,
    status: 'Hoạt động',
  },
  {
    id: 'field_4',
    name: 'Sân B2',
    type: '7 người',
    pricePerHour: 350000,
    status: 'Bảo trì',
  },
];

// Danh sach luot dat mau ban dau
export const initialBookings: Booking[] = [
  {
    id: 'booking_1',
    fieldId: 'field_1',
    customerName: 'Nguyễn Văn An',
    phone: '0912345678',
    date: '28/10/2026',
    startHour: 17,
    hours: 2,
  },
  {
    id: 'booking_2',
    fieldId: 'field_1',
    customerName: 'Trần Minh Tuấn',
    phone: '0987654321',
    date: '28/10/2026',
    startHour: 19,
    hours: 1,
  },
  {
    id: 'booking_3',
    fieldId: 'field_3',
    customerName: 'Lê Quốc Bảo',
    phone: '0905123456',
    date: '28/10/2026',
    startHour: 18,
    hours: 2,
  },
];
