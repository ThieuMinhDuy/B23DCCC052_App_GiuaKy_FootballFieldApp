import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { FieldType, FieldStatus } from '../types/field';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { CustomInput } from '../components/CustomInput';
import { SegmentSelector } from '../components/SegmentSelector';

// Kieu route prop cho FieldFormScreen
type FieldFormRouteProp = RouteProp<RootStackParamList, 'FieldForm'>;

// Danh sach lua chon loai san
const FIELD_TYPE_OPTIONS: FieldType[] = ['5 người', '7 người'];

// Danh sach lua chon trang thai san
const FIELD_STATUS_OPTIONS: FieldStatus[] = ['Hoạt động', 'Bảo trì'];

// Man hinh them hoac sua san bong
export const FieldFormScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<FieldFormRouteProp>();
  const { addField, updateField, getFieldById, fields } = useApp();

  // Lay fieldId tu tham so dieu huong
  const fieldId = route.params?.fieldId;
  const isEditMode = !!fieldId;
  const existingField = fieldId ? getFieldById(fieldId) : undefined;

  // State cho cac truong nhap lieu
  const [name, setName] = useState<string>(existingField?.name || '');
  const [type, setType] = useState<FieldType>(existingField?.type || '5 người');
  const [pricePerHour, setPricePerHour] = useState<string>(
    existingField ? existingField.pricePerHour.toString() : ''
  );
  const [status, setStatus] = useState<FieldStatus>(
    existingField?.status || 'Hoạt động'
  );

  // State luu thong bao loi cho tung o nhap
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  // Cap nhat tieu de thanh tieu de theo che do them hoac sua
  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Sửa Thông Tin Sân' : 'Thêm Sân Mới',
    });
  }, [isEditMode, navigation]);

  // Kiem tra du lieu hop le truoc khi luu
  const validateForm = (): boolean => {
    const nextErrors: { name?: string; price?: string } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      nextErrors.name = 'Tên sân không được để trống.';
    } else {
      const isDuplicate = fields.some(
        (f) =>
          f.id !== fieldId &&
          f.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        nextErrors.name = 'Tên sân đã tồn tại, vui lòng chọn tên khác.';
      }
    }

    const trimmedPrice = pricePerHour.trim();
    const parsedPrice = Number(trimmedPrice);
    if (!trimmedPrice) {
      nextErrors.price = 'Giá thuê không được để trống.';
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = 'Giá thuê phải là số lớn hơn 0.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Xu ly su kien luu san bong
  const handleSave = async () => {
    if (!validateForm()) return;

    const parsedPrice = Number(pricePerHour.trim());

    if (isEditMode && existingField) {
      const result = await updateField({
        id: existingField.id,
        name: name.trim(),
        type,
        pricePerHour: parsedPrice,
        status,
      });

      if (!result.success) {
        setErrors({ name: result.error });
        return;
      }
    } else {
      const result = await addField({
        name: name.trim(),
        type,
        pricePerHour: parsedPrice,
        status,
      });

      if (!result.success) {
        setErrors({ name: result.error });
        return;
      }
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <CustomInput
            label="Tên sân bóng *"
            placeholder="Ví dụ: Sân A1, Sân B2..."
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            error={errors.name}
          />

          <SegmentSelector
            label="Loại sân *"
            options={FIELD_TYPE_OPTIONS}
            selectedOption={type}
            onSelect={(selected) => setType(selected as FieldType)}
            activeColor={colors.primary}
          />

          <CustomInput
            label="Giá thuê mỗi giờ (VNĐ) *"
            placeholder="Ví dụ: 300000"
            value={pricePerHour}
            onChangeText={(text) => {
              setPricePerHour(text);
              if (errors.price) {
                setErrors((prev) => ({ ...prev, price: undefined }));
              }
            }}
            keyboardType="numeric"
            error={errors.price}
          />

          <SegmentSelector
            label="Trạng thái sân *"
            options={FIELD_STATUS_OPTIONS}
            selectedOption={status}
            onSelect={(selected) => setStatus(selected as FieldStatus)}
            activeColor={
              status === 'Hoạt động'
                ? colors.statusActive
                : colors.statusMaintenance
            }
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.saveButton}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditMode ? 'Cập Nhật Sân' : 'Lưu Sân Bóng'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Style cho FieldFormScreen
const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.radiusMd,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: colors.textWhite,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
});

export default FieldFormScreen;
