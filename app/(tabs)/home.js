import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { useIssues } from '@/src/state/issues';
import { StatusBadge } from '@/src/components/StatusBadge';

const categories = ['Cleanliness', 'Roads', 'Water', 'Lights', 'Public Safety', 'Other'];

function categoryIcon(name) {
  switch (name) {
    case 'Cleanliness':
      return 'trash-outline';
    case 'Roads':
      return 'car-outline';
    case 'Water':
      return 'water-outline';
    case 'Lights':
      return 'bulb-outline';
    case 'Public Safety':
      return 'shield-checkmark-outline';
    default:
      return 'alert-circle-outline';
  }
}

function ActionCard({ title, subtitle, icon, onPress, tone }) {
  const bg = tone === 'primary' ? 'rgba(79, 140, 255, 0.22)' : 'rgba(255,255,255,0.06)';
  const border = tone === 'primary' ? 'rgba(79, 140, 255, 0.45)' : colors.border;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        borderRadius: 16,
        padding: spacing.md,
        gap: 8,
        minHeight: 92,
      }}>
      <Ionicons name={icon} size={20} color={colors.text} />
      <Text style={{ color: colors.text, fontWeight: '900' }} numberOfLines={1}>
        {title}
      </Text>
      <Text style={{ color: colors.muted, fontWeight: '700' }} numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function MiniIssueRow({ issue, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
      }}>
      <Image
        source={{ uri: issue.imageUri }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: colors.text, fontWeight: '900' }} numberOfLines={1}>
          {issue.title}
        </Text>
        <Text style={{ color: colors.muted, fontWeight: '700' }} numberOfLines={1}>
          {issue.category}
        </Text>
      </View>
      <StatusBadge status={issue.status} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const { issues } = useIssues();
  const recent = issues.slice(0, 3);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl }}>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.lg,
          gap: 10,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '900' }}>Urban Civic Sense</Text>
            <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18 }}>
              Report issues with photo + GPS and track status updates.
            </Text>
          </View>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: 'rgba(79, 140, 255, 0.22)',
              borderWidth: 1,
              borderColor: 'rgba(79, 140, 255, 0.45)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="sparkles-outline" size={22} color={colors.text} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <ActionCard
            title="Report now"
            subtitle="Camera + GPS"
            icon="camera-outline"
            tone="primary"
            onPress={() => router.push('/(tabs)/report')}
          />
          <ActionCard
            title="View map"
            subtitle="Nearby issues"
            icon="map-outline"
            tone="neutral"
            onPress={() => router.push('/(tabs)/map')}
          />
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '900' }}>Categories</Text>
          <Pressable onPress={() => router.push('/(tabs)/issues')}>
            <Text style={{ color: colors.primary, fontWeight: '900' }}>See all</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {categories.map((c) => (
            <Pressable
              key={c}
              style={{
                flexGrow: 1,
                minWidth: '47%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 16,
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}
              onPress={() => router.push('/(tabs)/issues')}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name={categoryIcon(c)} size={18} color={colors.text} />
              </View>
              <Text style={{ color: colors.text, fontWeight: '900' }} numberOfLines={1}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '900' }}>Recent issues</Text>
          <Pressable onPress={() => router.push('/(tabs)/issues')}>
            <Text style={{ color: colors.primary, fontWeight: '900' }}>Open list</Text>
          </Pressable>
        </View>

        <View style={{ gap: 10 }}>
          {recent.map((issue) => (
            <MiniIssueRow key={issue.id} issue={issue} onPress={() => router.push(`/issue/${issue.id}`)} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

