import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Field } from '../types/field';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { HeaderStats } from '../components/HeaderStats';
import { FieldCard } from '../components/FieldCard';
import { EmptyState } from '../components/EmptyState';
import { AppIcon } from '../components/AppIcon';

// Man hinh danh sach san bong
export const FieldListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { fields, deleteField } = useApp();

  // So luong san hoat dong va tong so san
  const activeCount = fields.filter((f) => f.status === 'Hoạt động').length;
  const totalCount = fields.length;

  // Xu ly su kien xoa san bong
  const handleDeletePress = (field: Field) => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá ${field.name} không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteField(field.id);
            if (!result.success) {
              Alert.alert('Không thể xoá', result.error);
            }
          },
        },
      ]
    );
  };

  // Chuyen den man hinh them san
  const handleNavigateToAddField = () => {
    navigation.navigate('FieldForm');
  };

  // Chuyen den man hinh chi tiet san
  const handleNavigateToDetail = (fieldId: string) => {
    navigation.navigate('FieldDetail', { fieldId });
  };

  // Chuyen den man hinh sua san
  const handleNavigateToEditField = (fieldId: string) => {
    navigation.navigate('FieldForm', { fieldId });
  };

  // Render moi dong trong danh sach
  const renderFieldItem = ({ item }: { item: Field }) => {
    return (
      <FieldCard
        field={item}
        onPress={() => handleNavigateToDetail(item.id)}
        onDelete={() => handleDeletePress(item)}
        onEdit={() => handleNavigateToEditField(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={fields}
        keyExtractor={(item) => item.id}
        renderItem={renderFieldItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <HeaderStats activeCount={activeCount} totalCount={totalCount} />
        }
        ListEmptyComponent={
          <EmptyState message="Chưa có sân bóng nào. Hãy thêm sân mới!" />
        }
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.addButton}
        onPress={handleNavigateToAddField}>
        <AppIcon name="plus" size={16} color={colors.textWhite} solid={false} />
        <Text style={styles.addButtonText}>Thêm sân</Text>
      </TouchableOpacity>
    </View>
  );
};

// Style cho FieldListScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl * 2,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusFull,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: typography.fontWeightBold,
    marginLeft: spacing.xs,
  },
});

export default FieldListScreen;
