import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Booking } from '../types/booking';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency, formatTimeRange } from '../utils/formatters';
import { AppIcon } from './AppIcon';

// Interface props cho BookingItem
interface BookingItemProps {
  booking: Booking;
  pricePerHour: number;
  onCancel: () => void;
}

// Component the hien thi thong tin mot luot dat san
export const BookingItem: React.FC<BookingItemProps> = ({
  booking,
  pricePerHour,
  onCancel,
}) => {
  const totalPrice = pricePerHour * booking.hours;

  // Hoi xac nhan truoc khi huy luot dat
  const handleConfirmCancel = () => {
    Alert.alert(
      'Xác nhận huỷ',
      `Bạn có chắc chắn muốn huỷ lượt đặt của ${booking.customerName} không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Huỷ đặt',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.customerInfo}>
          <AppIcon name="user" size={14} color={colors.primary} />
          <Text style={styles.customerName}>{booking.customerName}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.cancelButton}
          onPress={handleConfirmCancel}>
          <AppIcon name="trash-alt" size={13} color={colors.danger} />
          <Text style={styles.cancelText}>Huỷ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Số điện thoại:</Text>
          <Text style={styles.infoValue}>{booking.phone}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Ngày đặt:</Text>
          <Text style={styles.infoValue}>{booking.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.timeBadge}>
          <AppIcon name="clock" size={13} color={colors.primary} />
          <Text style={styles.timeText}>
            {formatTimeRange(booking.startHour, booking.hours)} ({booking.hours}h)
          </Text>
        </View>

        <View style={styles.totalPriceWrapper}>
          <Text style={styles.totalLabel}>Thành tiền:</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

// Style cho BookingItem
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginLeft: spacing.xs + 2,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  cancelText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.danger,
    marginLeft: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightMedium,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  timeText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  totalPriceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  totalValue: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
});

export default BookingItem;
