import React from 'react';
import { Text, View } from 'react-native';

// Web fallback to avoid importing `react-native-maps` on web.
// Native (android/ios) uses `map.js`.
export default function MapScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontWeight: '700' }}>Map is not available on web.</Text>
    </View>
  );
}

