import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { IssueCard } from '@/src/components/IssueCard';
import { useIssues } from '@/src/state/issues';

const filters = ['All', 'Pending', 'Approved', 'Resolved'];

export default function IssuesScreen() {
  const { issues } = useIssues();
  const [filter, setFilter] = useState('All');

  const data = useMemo(() => {
    if (filter === 'All') return issues;
    return issues.filter((x) => x.status === filter);
  }, [filter, issues]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md }}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: spacing.md, flexWrap: 'wrap' }}>
        {filters.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: active ? colors.primary : 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                borderColor: colors.border,
              }}>
              <Text style={{ color: active ? '#0B1220' : colors.text, fontWeight: '900' }}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IssueCard issue={item} onPress={() => router.push(`/issue/${item.id}`)} />}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No issues found.</Text>}
      />
    </View>
  );
}

