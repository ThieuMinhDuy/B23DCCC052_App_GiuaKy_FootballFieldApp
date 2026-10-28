// Dinh dang gia thue san theo gio
export function formatCurrencyPerHour(price: number): string {
  if (isNaN(price)) return '0 đ/giờ';
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} đ/giờ`;
}

// Dinh dang tong tien
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '0 đ';
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} đ`;
}

// Dinh dang khung gio thue
export function formatTimeRange(startHour: number, hours: number): string {
  const endHour = startHour + hours;
  return `${startHour}h - ${endHour}h`;
}
