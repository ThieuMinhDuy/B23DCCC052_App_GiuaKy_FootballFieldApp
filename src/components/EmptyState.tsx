import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppIcon } from './AppIcon';

// Interface props cho EmptyState
interface EmptyStateProps {
  message: string;
  iconName?: string;
}

// Component hien thi khi danh sach trong
export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  iconName = 'inbox',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <AppIcon name={iconName} size={32} color={colors.textMuted} />
      </View>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

// Style cho EmptyState
const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  messageText: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
