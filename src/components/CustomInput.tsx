import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// Interface props cho CustomInput
interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
}

// Component o nhap lieu co bao loi inline va vien do
export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  style,
  ...restProps
}) => {
  const hasError = !!error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        {...restProps}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Style cho CustomInput
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
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.borderError,
  },
  errorText: {
    fontSize: typography.fontSizeXs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

export default CustomInput;
