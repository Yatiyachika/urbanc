import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md, gap: 8 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900' }}>Profile</Text>
      <Text style={{ color: colors.muted }}>User info + settings will come here.</Text>
    </View>
  );
}

