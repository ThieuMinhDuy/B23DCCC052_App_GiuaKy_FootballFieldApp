import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Field } from '../types/field';
import { Booking } from '../types/booking';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/formatters';
import {
  isValidPhone,
  isValidDateFormat,
  isValidBookingHours,
} from '../utils/validators';
import { CustomInput } from './CustomInput';
import { AppIcon } from './AppIcon';

// Interface props cho BookingModal
interface BookingModalProps {
  visible: boolean;
  field: Field;
  onClose: () => void;
  onSubmit: (
    bookingData: Omit<Booking, 'id'>
  ) => Promise<{ success: boolean; error?: string }>;
}

// Modal nhap thong tin dat san co tinh tien tu dong
export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  field,
  onClose,
  onSubmit,
}) => {
  // State luu thong tin form dat san
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startHour, setStartHour] = useState<string>('');
  const [hours, setHours] = useState<string>('1');

  // State luu thong bao loi cho tung truong
  const [errors, setErrors] = useState<{
    customerName?: string;
    phone?: string;
    date?: string;
    startHour?: string;
    hours?: string;
    general?: string;
  }>({});

  // Tinh toan thanh tien ngay khi so gio thay doi
  const parsedHours = Number(hours.trim());
  const validHours = !isNaN(parsedHours) && parsedHours >= 1 && parsedHours <= 3;
  const currentTotalPrice = validHours ? field.pricePerHour * parsedHours : 0;

  // Reset cac o nhap ve trang thai ban dau
  const resetForm = () => {
    setCustomerName('');
    setPhone('');
    setDate('');
    setStartHour('');
    setHours('1');
    setErrors({});
  };

  // Dong modal va lam sach form
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Kiem tra du lieu dat san truoc khi gui
  const validateForm = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!customerName.trim()) {
      nextErrors.customerName = 'Tên khách hàng không được để trống.';
    }

    if (!phone.trim()) {
      nextErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!isValidPhone(phone)) {
      nextErrors.phone = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.';
    }

    if (!date.trim()) {
      nextErrors.date = 'Ngày đặt không được để trống.';
    } else if (!isValidDateFormat(date)) {
      nextErrors.date = 'Ngày đặt phải có định dạng dd/mm/yyyy (ví dụ: 28/10/2026).';
    }

    const parsedStart = Number(startHour.trim());
    const parsedH = Number(hours.trim());

    if (!startHour.trim()) {
      nextErrors.startHour = 'Giờ bắt đầu không được để trống.';
    } else if (isNaN(parsedStart) || parsedStart < 6 || parsedStart > 22) {
      nextErrors.startHour = 'Giờ bắt đầu phải là số từ 6 đến 22.';
    }

    if (!hours.trim()) {
      nextErrors.hours = 'Số giờ thuê không được để trống.';
    } else if (isNaN(parsedH) || parsedH < 1 || parsedH > 3) {
      nextErrors.hours = 'Số giờ thuê phải là số từ 1 đến 3.';
    }

    if (!nextErrors.startHour && !nextErrors.hours) {
      const hoursCheck = isValidBookingHours(parsedStart, parsedH);
      if (!hoursCheck.valid) {
        nextErrors.hours = hoursCheck.message;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Xu ly su kien xac nhan dat san
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const parsedStart = Number(startHour.trim());
    const parsedH = Number(hours.trim());

    const result = await onSubmit({
      fieldId: field.id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      date: date.trim(),
      startHour: parsedStart,
      hours: parsedH,
    });

    if (!result.success) {
      setErrors({ general: result.error });
      return;
    }

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đặt Sân: {field.name}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={handleClose}>
              <AppIcon name="times" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {errors.general && (
              <View style={styles.generalErrorBox}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            <CustomInput
              label="Tên khách hàng *"
              placeholder="Nhập họ và tên..."
              value={customerName}
              onChangeText={(text) => {
                setCustomerName(text);
                if (errors.customerName || errors.general) {
                  setErrors((prev) => ({
                    ...prev,
                    customerName: undefined,
                    general: undefined,
                  }));
                }
              }}
              error={errors.customerName}
            />

            <CustomInput
              label="Số điện thoại *"
              placeholder="Ví dụ: 0912345678 (10 số)"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone || errors.general) {
                  setErrors((prev) => ({
                    ...prev,
                    phone: undefined,
                    general: undefined,
                  }));
                }
              }}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
            />

            <CustomInput
              label="Ngày đặt (dd/mm/yyyy) *"
              placeholder="Ví dụ: 28/10/2026"
              value={date}
              onChangeText={(text) => {
                setDate(text);
                if (errors.date || errors.general) {
                  setErrors((prev) => ({
                    ...prev,
                    date: undefined,
                    general: undefined,
                  }));
                }
              }}
              error={errors.date}
            />

            <View style={styles.timeInputsRow}>
              <View style={styles.timeInputCol}>
                <CustomInput
                  label="Giờ bắt đầu (6 - 22) *"
                  placeholder="Ví dụ: 17"
                  value={startHour}
                  onChangeText={(text) => {
                    setStartHour(text);
                    if (errors.startHour || errors.general) {
                      setErrors((prev) => ({
                        ...prev,
                        startHour: undefined,
                        general: undefined,
                      }));
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  error={errors.startHour}
                />
              </View>

              <View style={styles.timeInputCol}>
                <CustomInput
                  label="Số giờ thuê (1 - 3) *"
                  placeholder="Ví dụ: 2"
                  value={hours}
                  onChangeText={(text) => {
                    setHours(text);
                    if (errors.hours || errors.general) {
                      setErrors((prev) => ({
                        ...prev,
                        hours: undefined,
                        general: undefined,
                      }));
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  error={errors.hours}
                />
              </View>
            </View>

            <View style={styles.priceCalculationBox}>
              <Text style={styles.calculationLabel}>Thành tiền tạm tính:</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(currentTotalPrice)}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.cancelBtn}
                onPress={handleClose}>
                <Text style={styles.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.submitBtn}
                onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Xác nhận đặt</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Style cho BookingModal
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  generalErrorBox: {
    backgroundColor: colors.dangerBg,
    padding: spacing.sm,
    borderRadius: spacing.radiusSm,
    marginBottom: spacing.md,
  },
  generalErrorText: {
    color: colors.danger,
    fontSize: typography.fontSizeSm,
    textAlign: 'center',
  },
  timeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputCol: {
    flex: 0.48,
  },
  priceCalculationBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  calculationLabel: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightMedium,
    color: colors.textPrimary,
  },
  calculationValue: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  cancelBtn: {
    flex: 0.35,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cancelBtnText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 0.6,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primary,
  },
  submitBtnText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textWhite,
  },
});

export default BookingModal;
