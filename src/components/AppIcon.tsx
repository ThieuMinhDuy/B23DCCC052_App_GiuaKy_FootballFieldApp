import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Interface props cho AppIcon
interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  solid?: boolean;
}

// Hien thi icon FontAwesome5 regular
export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 18,
  color = '#475569',
  solid = false,
}) => {
  return <FontAwesome5 name={name} size={size} color={color} solid={solid} />;
};

export default AppIcon;
