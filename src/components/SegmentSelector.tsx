import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// Interface props cho SegmentSelector
interface SegmentSelectorProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: any) => void;
  activeColor?: string;
}

// Component cum nut bam lua chon bang button
export const SegmentSelector: React.FC<SegmentSelectorProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
  activeColor = colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonGroup}>
        {options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.7}
              style={[
                styles.button,
                isSelected && {
                  backgroundColor: activeColor,
                  borderColor: activeColor,
                },
              ]}
              onPress={() => onSelect(option)}>
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.buttonTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Style cho SegmentSelector
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusMd,
    marginRight: spacing.sm,
  },
  buttonText: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  buttonTextSelected: {
    color: colors.textWhite,
    fontWeight: typography.fontWeightBold,
  },
});

export default SegmentSelector;
