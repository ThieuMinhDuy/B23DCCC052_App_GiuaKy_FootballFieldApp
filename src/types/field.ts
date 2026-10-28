// Kieu loai san
export type FieldType = '5 người' | '7 người';

// Kieu trang thai san
export type FieldStatus = 'Hoạt động' | 'Bảo trì';

// Interface thong tin san bong
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
}
