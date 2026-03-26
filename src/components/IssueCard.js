import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { StatusBadge } from '@/src/components/StatusBadge';

export function IssueCard({ issue, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
      }}>
      <Image source={{ uri: issue.imageUri }} style={{ height: 160, width: '100%' }} />
      <View style={{ padding: spacing.md, gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{ color: colors.text, fontSize: 16, fontWeight: '900', flex: 1, paddingRight: 10 }}
            numberOfLines={1}>
            {issue.title}
          </Text>
          <StatusBadge status={issue.status} />
        </View>
        <Text style={{ color: colors.muted }} numberOfLines={2}>
          {issue.description}
        </Text>
        <Text style={{ color: colors.muted, fontWeight: '800' }}>{issue.category}</Text>
      </View>
    </Pressable>
  );
}

