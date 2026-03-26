import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuItems = React.useMemo(
    () => [
      { label: 'Home', href: '/(tabs)/home', icon: 'home-outline' },
      { label: 'Report', href: '/(tabs)/report', icon: 'camera-outline' },
      { label: 'Map', href: '/(tabs)/map', icon: 'map-outline' },
      { label: 'Issues', href: '/(tabs)/issues', icon: 'list-outline' },
      { label: 'Profile', href: '/(tabs)/profile', icon: 'person-outline' },
    ],
    []
  );

  React.useEffect(() => {
    // Close menu when navigation changes
    setMenuOpen(false);
  }, [pathname]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          tabBarInactiveTintColor: theme.tabIconDefault,
          headerShown: true,
          tabBarButton: HapticTab,
          tabBarStyle: { display: 'none' },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: '900',
          },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              onPress={() => setMenuOpen((v) => !v)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                borderWidth: 1,
                borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
              }}>
              <Ionicons name={menuOpen ? 'close' : 'menu'} size={22} color={theme.text} />
            </Pressable>
          ),
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: 'Report',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="issues"
          options={{
            title: 'Issues',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>

      {menuOpen ? (
        <Pressable
          onPress={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)',
          }}>
          <View
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 92 : 72,
              right: 14,
              width: 220,
              borderRadius: 18,
              padding: 8,
              backgroundColor: colorScheme === 'dark' ? 'rgba(17, 26, 46, 0.96)' : 'rgba(255,255,255,0.96)',
              borderWidth: 1,
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
              shadowColor: '#000',
              shadowOpacity: colorScheme === 'dark' ? 0.4 : 0.15,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 18,
            }}>
            {menuItems.map((item) => (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: pressed
                    ? colorScheme === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.06)'
                    : 'transparent',
                })}>
                <Ionicons name={item.icon} size={18} color={theme.text} />
                <Text style={{ color: theme.text, fontWeight: '900' }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

