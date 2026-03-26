import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/src/constants/colors';

function statusColor(status) {
  if (status === 'Resolved') return colors.success;
  if (status === 'Approved') return colors.primary;
  if (status === 'Rejected') return colors.danger;
  return colors.warning;
}

export function StatusBadge({ status }) {
  const c = statusColor(status);
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: c,
      }}>
      <Text style={{ color: colors.text, fontWeight: '800' }}>{status}</Text>
    </View>
  );
}

