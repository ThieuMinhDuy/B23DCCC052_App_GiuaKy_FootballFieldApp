import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FieldStatus } from '../types/field';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// Interface props cho StatusBadge
interface StatusBadgeProps {
  status: FieldStatus;
}

// Component nhan trang thai san bong
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === 'Hoạt động';

  return (
    <View
      style={[
        styles.badge,
        isActive ? styles.activeBadge : styles.maintenanceBadge,
      ]}>
      <View
        style={[
          styles.dot,
          isActive ? styles.activeDot : styles.maintenanceDot,
        ]}
      />
      <Text
        style={[
          styles.badgeText,
          isActive ? styles.activeText : styles.maintenanceText,
        ]}>
        {status}
      </Text>
    </View>
  );
};

// Style cho StatusBadge
const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusFull,
  },
  activeBadge: {
    backgroundColor: colors.statusActiveBg,
  },
  maintenanceBadge: {
    backgroundColor: colors.statusMaintenanceBg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 2,
  },
  activeDot: {
    backgroundColor: colors.statusActive,
  },
  maintenanceDot: {
    backgroundColor: colors.statusMaintenance,
  },
  badgeText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
  },
  activeText: {
    color: colors.statusActive,
  },
  maintenanceText: {
    color: colors.statusMaintenance,
  },
});

export default StatusBadge;
