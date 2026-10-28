import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppIcon } from './AppIcon';

// Interface props cho HeaderStats
interface HeaderStatsProps {
  activeCount: number;
  totalCount: number;
}

// Component thong ke ty le san hoat dong o dau danh sach
export const HeaderStats: React.FC<HeaderStatsProps> = ({
  activeCount,
  totalCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <AppIcon name="futbol" size={20} color={colors.primary} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.label}>Tình trạng sân</Text>
        <Text style={styles.statsText}>
          <Text style={styles.highlightCount}>{activeCount}/{totalCount}</Text> sân hoạt động
        </Text>
      </View>
    </View>
  );
};

// Style cho HeaderStats
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statsText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  highlightCount: {
    color: colors.primary,
  },
});

export default HeaderStats;
