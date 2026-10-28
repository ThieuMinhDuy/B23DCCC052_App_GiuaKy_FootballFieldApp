import { Booking } from '../types/booking';

// Kiem tra so dien thoai 10 chu so bat dau bang 0
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phone.trim());
}

// Kiem tra dinh dang ngay dd/mm/yyyy
export function isValidDateFormat(dateStr: string): boolean {
  const dateRegex = /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(dateStr.trim())) return false;

  const [day, month, year] = dateStr.trim().split('/').map(Number);
  const parsedDate = new Date(year, month - 1, day);
  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

// Kiem tra gio bat dau va so gio thue
export function isValidBookingHours(startHour: number, hours: number): {
  valid: boolean;
  message?: string;
} {
  if (isNaN(startHour) || startHour < 6 || startHour > 22) {
    return { valid: false, message: 'Giờ bắt đầu phải từ 6h đến 22h.' };
  }
  if (isNaN(hours) || hours < 1 || hours > 3) {
    return { valid: false, message: 'Số giờ thuê phải từ 1 đến 3 giờ.' };
  }
  if (startHour + hours > 23) {
    return { valid: false, message: 'Giờ kết thúc không được vượt quá 23h.' };
  }
  return { valid: true };
}

// Kiem tra trung lich dat san
export function isBookingOverlap(
  candidate: {
    fieldId: string;
    date: string;
    startHour: number;
    hours: number;
    id?: string;
  },
  existingBookings: Booking[]
): boolean {
  const candidateStart = candidate.startHour;
  const candidateEnd = candidate.startHour + candidate.hours;

  return existingBookings.some((booking) => {
    if (booking.id === candidate.id) return false;
    if (booking.fieldId !== candidate.fieldId) return false;
    if (booking.date.trim() !== candidate.date.trim()) return false;

    const existingStart = booking.startHour;
    const existingEnd = booking.startHour + booking.hours;

    return Math.max(candidateStart, existingStart) < Math.min(candidateEnd, existingEnd);
  });
}
