import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { StatusBadge } from '@/src/components/StatusBadge';
import { useIssues } from '@/src/state/issues';

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getIssueById, updateStatus } = useIssues();

  const issue = id ? getIssueById(String(id)) : undefined;
  if (!issue) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md }}>
        <Text style={{ color: colors.text, fontWeight: '900' }}>Issue not found.</Text>
      </View>
    );
  }

  const actions = ['Pending', 'Approved', 'Resolved', 'Rejected'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Image source={{ uri: issue.imageUri }} style={{ width: '100%', height: 260 }} />
      <View style={{ padding: spacing.md, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{ color: colors.text, fontSize: 18, fontWeight: '900', flex: 1, paddingRight: 12 }}
            numberOfLines={2}>
            {issue.title}
          </Text>
          <StatusBadge status={issue.status} />
        </View>

        <Text style={{ color: colors.muted }}>{issue.description}</Text>
        <Text style={{ color: colors.text, fontWeight: '800' }}>
          Category: <Text style={{ color: colors.muted }}>{issue.category}</Text>
        </Text>
        <Text style={{ color: colors.text, fontWeight: '800' }}>
          Location: <Text style={{ color: colors.muted }}>{issue.latitude}, {issue.longitude}</Text>
        </Text>

        <View style={{ marginTop: 8, gap: 10 }}>
          <Text style={{ color: colors.text, fontWeight: '900' }}>Admin actions (UI demo)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {actions.map((s) => (
              <Pressable
                key={s}
                onPress={() => updateStatus(issue.id, s)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <Text style={{ color: colors.text, fontWeight: '900' }}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

