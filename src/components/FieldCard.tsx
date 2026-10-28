import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Field } from '../types/field';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrencyPerHour } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';
import { AppIcon } from './AppIcon';

// Interface props cho FieldCard
interface FieldCardProps {
  field: Field;
  onPress: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

// Component the hien thi thong tin san trong danh sach
export const FieldCard: React.FC<FieldCardProps> = ({
  field,
  onPress,
  onDelete,
  onEdit,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{field.type}</Text>
          </View>
        </View>
        <StatusBadge status={field.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá thuê:</Text>
          <Text style={styles.priceValue}>
            {formatCurrencyPerHour(field.pricePerHour)}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.editButton}
              onPress={onEdit}>
              <AppIcon name="edit" size={14} color={colors.primary} />
              <Text style={styles.editText}>Sửa</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.deleteButton}
            onPress={onDelete}>
            <AppIcon name="trash-alt" size={14} color={colors.danger} />
            <Text style={styles.deleteText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Style cho FieldCard
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldName: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  typeBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeText: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  priceValue: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primaryLight,
    marginRight: spacing.sm,
  },
  editText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.dangerBg,
  },
  deleteText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.danger,
    marginLeft: spacing.xs,
  },
});

export default FieldCard;
