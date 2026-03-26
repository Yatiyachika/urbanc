import React, { useMemo, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/constants/colors';
import { spacing } from '@/src/constants/spacing';
import { useIssues } from '@/src/state/issues';

const categories = ['Cleanliness', 'Roads', 'Water', 'Lights', 'Public Safety', 'Other'];

function FieldLabel({ children, optional }) {
  return (
    <Text style={{ color: colors.muted, fontWeight: '900' }}>
      {children}
      {optional ? <Text style={{ color: colors.muted, fontWeight: '700' }}> (optional)</Text> : null}
    </Text>
  );
}

function Card({ children }) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: 12,
      }}>
      {children}
    </View>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: active ? 'rgba(79, 140, 255, 0.22)' : 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: active ? 'rgba(79, 140, 255, 0.45)' : colors.border,
      }}>
      <Text style={{ color: colors.text, fontWeight: '900' }}>{label}</Text>
    </Pressable>
  );
}

export default function ReportIssueScreen() {
  const { addIssue } = useIssues();
  const [category, setCategory] = useState('Cleanliness');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const canSubmit = useMemo(() => {
    return Boolean(coords && title.trim() && description.trim() && photoUri);
  }, [coords, description, photoUri, title]);

  const missing = useMemo(() => {
    const m = [];
    if (!photoUri) m.push('photo');
    if (!title.trim()) m.push('title');
    if (!description.trim()) m.push('description');
    if (!coords) m.push('location');
    return m;
  }, [coords, description, photoUri, title]);

  async function fetchLocation() {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') return;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
  }

  async function openCamera() {
    const perm = cameraPermission?.granted ? cameraPermission : await requestCameraPermission();
    if (!perm?.granted) return;
    setCameraOpen(true);
  }

  async function takePhoto() {
    const cam = cameraRef.current;
    if (!cam) return;
    const pic = await cam.takePictureAsync({ quality: 0.75, exif: false });
    if (!pic?.uri) return;
    setPhotoUri(pic.uri);
    setCameraOpen(false);
  }

  function submitMock() {
    if (!title.trim() || !description.trim() || !coords || !photoUri) return;
    addIssue({
      category,
      title: title.trim(),
      description: description.trim(),
      latitude: coords.latitude,
      longitude: coords.longitude,
      imageUri: photoUri,
    });
    setTitle('');
    setDescription('');
    setPhotoUri(null);
  }

  if (cameraOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: spacing.md,
            gap: 10,
            backgroundColor: 'rgba(11, 18, 32, 0.65)',
          }}>
          <Pressable
            onPress={takePhoto}
            style={{
              backgroundColor: colors.primary,
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}>
            <Text style={{ textAlign: 'center', fontWeight: '900', color: '#0B1220' }}>Take photo</Text>
          </Pressable>
          <Pressable
            onPress={() => setCameraOpen(false)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}>
            <Text style={{ textAlign: 'center', fontWeight: '900', color: colors.text }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={{ padding: spacing.md, gap: 12, paddingBottom: spacing.xl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>Report an issue</Text>
          <Text style={{ color: colors.muted, lineHeight: 18 }}>
            Add a photo, describe the issue, and capture your location.
          </Text>
        </View>

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <FieldLabel>Photo</FieldLabel>
            {photoUri ? (
              <Pressable onPress={() => setPhotoUri(null)}>
                <Text style={{ color: colors.primary, fontWeight: '900' }}>Remove</Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={openCamera}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
            {photoUri ? (
              <View>
                <Image source={{ uri: photoUri }} style={{ width: '100%', height: 200 }} />
                <View
                  style={{
                    position: 'absolute',
                    right: 12,
                    bottom: 12,
                    backgroundColor: 'rgba(11, 18, 32, 0.65)',
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 999,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <Ionicons name="camera-outline" size={16} color={colors.text} />
                  <Text style={{ color: colors.text, fontWeight: '900' }}>Retake</Text>
                </View>
              </View>
            ) : (
              <View style={{ padding: spacing.lg, alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    backgroundColor: 'rgba(79, 140, 255, 0.22)',
                    borderWidth: 1,
                    borderColor: 'rgba(79, 140, 255, 0.45)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="camera-outline" size={22} color={colors.text} />
                </View>
                <Text style={{ color: colors.text, fontWeight: '900' }}>Tap to take a photo</Text>
                <Text style={{ color: colors.muted, textAlign: 'center', lineHeight: 18 }}>
                  Make sure the issue is clearly visible.
                </Text>
              </View>
            )}
          </Pressable>
        </Card>

        <Card>
          <FieldLabel>Category</FieldLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {categories.map((c) => (
              <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </Card>

        <Card>
          <View style={{ gap: 10 }}>
            <View style={{ gap: 8 }}>
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Short title (e.g. Pothole near school)"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: 14,
                  padding: 12,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                returnKeyType="next"
              />
            </View>

            <View style={{ gap: 8 }}>
              <FieldLabel>Description</FieldLabel>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What happened? How serious is it? Any landmark nearby?"
                placeholderTextColor={colors.muted}
                style={{
                  minHeight: 140,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: 14,
                  padding: 12,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  textAlignVertical: 'top',
                }}
                multiline
              />
            </View>
          </View>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <FieldLabel>Location</FieldLabel>
            {coords ? (
              <Text style={{ color: colors.muted, fontWeight: '800' }}>
                {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </Text>
            ) : null}
          </View>

          <Pressable
            onPress={fetchLocation}
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <Ionicons name="locate-outline" size={18} color={colors.text} />
            <Text style={{ textAlign: 'center', color: colors.text, fontWeight: '900' }}>
              {coords ? 'Update location' : 'Auto-fetch location'}
            </Text>
          </Pressable>
        </Card>

        <Pressable
          onPress={submitMock}
          style={{
            backgroundColor: canSubmit ? colors.success : 'rgba(255,255,255,0.08)',
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: canSubmit ? 1 : 0.9,
          }}>
          <Text style={{ textAlign: 'center', fontWeight: '900', color: colors.text }}>
            Submit report
          </Text>
          {!canSubmit ? (
            <Text style={{ textAlign: 'center', marginTop: 6, color: colors.muted, fontWeight: '700' }}>
              Missing: {missing.join(', ')}
            </Text>
          ) : null}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

