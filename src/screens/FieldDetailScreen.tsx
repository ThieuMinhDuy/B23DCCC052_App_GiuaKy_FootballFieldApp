import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrencyPerHour } from '../utils/formatters';
import { StatusBadge } from '../components/StatusBadge';
import { BookingItem } from '../components/BookingItem';
import { BookingModal } from '../components/BookingModal';
import { EmptyState } from '../components/EmptyState';
import { AppIcon } from '../components/AppIcon';

// Kieu route prop cho FieldDetailScreen
type FieldDetailRouteProp = RouteProp<RootStackParamList, 'FieldDetail'>;

// Man hinh chi tiet san bong va quan ly lich dat
export const FieldDetailScreen: React.FC = () => {
  const route = useRoute<FieldDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getFieldById, getBookingsByField, addBooking, cancelBooking } = useApp();

  // State dieu khien hien thi modal dat san
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Lay thong tin san va danh sach luot dat cua san
  const fieldId = route.params.fieldId;
  const field = getFieldById(fieldId);
  const bookings = getBookingsByField(fieldId);

  // Truong hop khong tim thay san bong
  if (!field) {
    return (
      <View style={styles.notFoundContainer}>
        <EmptyState message="Không tìm thấy thông tin sân bóng." />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isMaintenance = field.status === 'Bảo trì';

  // Chuyen den man hinh sua thong tin san
  const handleNavigateToEdit = () => {
    navigation.navigate('FieldForm', { fieldId: field.id });
  };

  // Mo modal dat san neu san dang hoat dong
  const handleOpenBookingModal = () => {
    if (isMaintenance) return;
    setModalVisible(true);
  };

  // Xu ly huy mot luot dat san
  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId);
  };

  // Render header cua danh sach chi tiet san
  const renderListHeader = () => {
    return (
      <View>
        <View style={styles.fieldInfoCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.fieldName}>{field.name}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{field.type}</Text>
              </View>
            </View>
            <StatusBadge status={field.status} />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giá thuê:</Text>
            <Text style={styles.infoPrice}>
              {formatCurrencyPerHour(field.pricePerHour)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.editFieldBtn}
            onPress={handleNavigateToEdit}>
            <AppIcon name="edit" size={14} color={colors.primary} />
            <Text style={styles.editFieldText}>Sửa thông tin sân</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bookingActionSection}>
          <TouchableOpacity
            activeOpacity={isMaintenance ? 1 : 0.8}
            disabled={isMaintenance}
            style={[
              styles.bookingBtn,
              isMaintenance && styles.bookingBtnDisabled,
            ]}
            onPress={handleOpenBookingModal}>
            <AppIcon
              name="calendar-plus"
              size={18}
              color={isMaintenance ? colors.disabledText : colors.textWhite}
            />
            <Text
              style={[
                styles.bookingBtnText,
                isMaintenance && styles.bookingBtnTextDisabled,
              ]}>
              {isMaintenance ? 'Sân Đang Bảo Trì' : 'Đặt Sân Ngay'}
            </Text>
          </TouchableOpacity>

          {isMaintenance && (
            <Text style={styles.maintenanceNotice}>
              * Sân đang trong trạng thái bảo trì nên không thể đặt lịch.
            </Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Danh sách lịch đặt ({bookings.length})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingItem
            booking={item}
            pricePerHour={field.pricePerHour}
            onCancel={() => handleCancelBooking(item.id)}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyState message="Chưa có lượt đặt nào cho sân này." />
        }
        contentContainerStyle={styles.listContent}
      />

      <BookingModal
        visible={modalVisible}
        field={field}
        onClose={() => setModalVisible(false)}
        onSubmit={addBooking}
      />
    </View>
  );
};

// Style cho FieldDetailScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  backButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusMd,
  },
  backButtonText: {
    color: colors.textWhite,
    fontWeight: typography.fontWeightSemiBold,
  },
  fieldInfoCard: {
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
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fieldName: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBadgeText: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  infoPrice: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  editFieldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.radiusSm,
  },
  editFieldText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  bookingActionSection: {
    marginBottom: spacing.md,
  },
  bookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusMd,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingBtnDisabled: {
    backgroundColor: colors.disabledBg,
    elevation: 0,
    shadowOpacity: 0,
  },
  bookingBtnText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textWhite,
    marginLeft: spacing.xs + 2,
  },
  bookingBtnTextDisabled: {
    color: colors.disabledText,
  },
  maintenanceNotice: {
    fontSize: typography.fontSizeXs,
    color: colors.statusMaintenance,
    marginTop: spacing.xs + 2,
    textAlign: 'center',
  },
  sectionHeader: {
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
});

export default FieldDetailScreen;
