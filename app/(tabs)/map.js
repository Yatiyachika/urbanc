import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import { useIssues } from '@/src/state/issues';

export default function MapScreen() {
  const { issues } = useIssues();
  const first = issues[0];

  if (!first) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}>
        {issues.map((i) => (
          <Marker
            key={i.id}
            coordinate={{ latitude: i.latitude, longitude: i.longitude }}
            title={i.title}
            description={i.status}
            onCalloutPress={() => router.push(`/issue/${i.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

