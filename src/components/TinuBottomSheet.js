import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
} from 'react-native';
import API from '../api';
import { Card, Chip } from './UI';

const tinuImg = require('../../assets/tinu.png');

export default function TinuBottomSheet({ visible, onClose, contextProps }) {
  const [data, setData] = useState({ cards: [], chips: [] });
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const { width, height } = Dimensions.get('window');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const translateY = useRef(new Animated.Value(height)).current; // start offscreen
  const opacity = useRef(new Animated.Value(0)).current;

  const baseDrawerHeight = Math.round(height * 0.75);

  // --- Load data when visible ---
  useEffect(() => {
    let mounted = true;
    if (visible) {
      setLoading(true);
      API.activateTinu(contextProps)
        .then((res) => {
          if (!mounted) return;
          const cards = (res.cards || []).map((c) => ({
            ...c,
            image_url: c.image_url ? API.makeImageUrl(c.image_url) : c.image_url,
          }));
          const chips = (res.chips || []).map((ch) => ch);
          const context_label = res.context_label || '';
          mounted && setData({ cards, chips, context_label });
        })
        .catch((e) => console.warn('activateTinu failed', e.message))
        .finally(() => mounted && setLoading(false));
    }
    return () => (mounted = false);
  }, [visible, contextProps]);

  // --- Keyboard handling ---
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = (e) => setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : 300);
    const onHide = () => setKeyboardHeight(0);
    const sub1 = Keyboard.addListener(showEvent, onShow);
    const sub2 = Keyboard.addListener(hideEvent, onHide);
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  // --- Animate open/close ---
  const animateOpen = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateClose = (callback) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => callback && callback());
  };

  useEffect(() => {
    if (visible) animateOpen();
    else animateClose();
  }, [visible]);

  const currentDrawerHeight = keyboardHeight > 0 ? Math.round(baseDrawerHeight * 0.5) : baseDrawerHeight;

  // --- Swipe to close ---
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) pan.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          animateClose(onClose);
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  const drawerTranslateY = Animated.add(translateY, pan);

  // --- Backdrop tap ---
  const justOpened = useRef(false);
  useEffect(() => {
    if (visible) {
      justOpened.current = true;
      const t = setTimeout(() => (justOpened.current = false), 600);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const closeAnimated = () => {
    animateClose(onClose);
  };

  return (
    <View style={styles.fullscreen} pointerEvents={visible ? 'auto' : 'none'}>
      {visible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (justOpened.current) return;
            closeAnimated();
          }}
        >
          <View pointerEvents="none" style={styles.backdropFallback} />
        </Pressable>
      )}

      {visible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.drawerWrap,
              {
                height: currentDrawerHeight,
                transform: [{ translateY: drawerTranslateY }],
              },
            ]}
          >
            {/* Handle Row */}
            <View style={styles.handleRowWrap}>
              <View style={styles.handleRowInner}>
                <View style={styles.avatarGlow} />
                <Image source={tinuImg} style={styles.tinuIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.handleTitle}>What can I talk about instead?</Text>
                  <Text style={styles.handleSubtitle}>Quick tips & scripts for authentic conversations</Text>
                </View>
              </View>
            </View>

            {/* Drawer Content */}
            <View style={[styles.drawer, { paddingTop: 0 }]}>
              <View style={styles.curveAccent} pointerEvents="none" />
              <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 24 }]} keyboardShouldPersistTaps="handled">
                {!keyboardHeight && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
                    {loading ? (
                      <Text style={{ color: '#666' }}>Loading...</Text>
                    ) : (
                      data.cards.map((c, i) => (
                        <View key={i} style={styles.cardWrap}>
                          <View style={styles.cardInner}>
                            <View style={styles.cardHeaderRow}>
                              <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>{(c.type || 'script').toUpperCase()}</Text>
                              </View>
                              <View style={{ flex: 1 }} />
                              <Pressable onPress={() => console.log('share', c)} style={styles.iconSm}>
                                <Text>🔗</Text>
                              </Pressable>
                              <Pressable onPress={() => console.log('bookmark', c)} style={styles.iconSm}>
                                <Text>☆</Text>
                              </Pressable>
                            </View>
                            {c.image_url ? <Image source={{ uri: c.image_url }} style={styles.cardImageLarge} /> : null}
                            <Text style={styles.cardTitleInner}>{c.title}</Text>
                            <Text style={styles.cardTextInner} numberOfLines={3}>
                              {c.content || c.subtitle || ''}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                  </ScrollView>
                )}

                <Pressable style={styles.shareRow} onPress={() => console.log('share context')}>
                  <Text style={styles.shareText}>{data.context_label || 'Share more context of child'}</Text>
                </Pressable>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                  {data.chips.map((chip, i) => {
                    const label = typeof chip === 'string' ? chip : chip.label || chip.text || chip.value || JSON.stringify(chip);
                    const emoji = (() => {
                      const l = label.toLowerCase();
                      if (l.includes('food') || l.includes('nutrition')) return '🍎';
                      if (l.includes('screen')) return '📱';
                      if (l.includes('emotional') || l.includes('regulation')) return '🧠';
                      if (l.includes('communication')) return '💬';
                      return '🔸';
                    })();
                    return (
                      <View key={i} style={styles.chipWrap}>
                        <Pressable onPress={() => setInput(label)} style={styles.chipFancy}>
                          <Text style={styles.chipEmoji}>{emoji}</Text>
                          <Text style={styles.chipLabel}>{label}</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </ScrollView>

              {/* Input Row */}
              <View style={styles.inputRowMain}>
                <View style={styles.inputPill}>
                  <TextInput value={input} onChangeText={setInput} placeholder="Ask me anything..." style={styles.input} />
                  <View style={styles.micWrap}>
                    <Text style={{ color: '#fff' }}>🎤</Text>
                  </View>
                </View>
                <Pressable style={styles.upBtn} onPress={() => console.log('send', input)}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>↑</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  drawerWrap: {
    width: '100%',
    backgroundColor: '#fff7fb',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 9999,
  },
  handleRowWrap: { paddingHorizontal: 20, paddingTop: 6, backgroundColor: 'transparent' },
  handleRowInner: { flexDirection: 'row', alignItems: 'center' },
  tinuIcon: { width: 64, height: 64, marginRight: 12, shadowColor: '#ff79c7', shadowOpacity: 0.9, shadowRadius: 16, elevation: 6 },
  handleTitle: { fontSize: 16, fontWeight: '800', color: '#222' },
  handleSubtitle: { fontSize: 12, color: '#6b21a8', marginTop: 2 },
  drawer: { backgroundColor: '#fff7fb', borderTopLeftRadius: 36, borderTopRightRadius: 36, flex: 1, overflow: 'hidden', paddingTop: 6 },
  curveAccent: { position: 'absolute', left: 0, right: 0, top: -18, height: 48, backgroundColor: '#fff7fb', borderTopLeftRadius: 36, borderTopRightRadius: 36, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  scrollContent: { paddingBottom: 12 },
  cardsRow: { paddingLeft: 16, paddingRight: 16, paddingTop: 12 },
  cardWrap: { marginRight: 12, width: 280 },
  cardInner: { backgroundColor: '#fff', borderRadius: 14, padding: 12, shadowColor: '#ff9dbb', shadowOpacity: 0.08, shadowRadius: 18, elevation: 6 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  typeBadge: { backgroundColor: '#f3e6ef', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  typeBadgeText: { color: '#6b21a8', fontWeight: '700', fontSize: 11 },
  iconSm: { marginLeft: 8, padding: 6 },
  cardImageLarge: { width: '100%', height: 110, borderRadius: 10, marginBottom: 10 },
  cardTitleInner: { fontWeight: '800', fontSize: 16, color: '#2b021f' },
  cardTextInner: { color: '#6b21a8', marginTop: 6, lineHeight: 18 },
  shareRow: { paddingHorizontal: 16, paddingVertical: 12, paddingTop: 24 },
  shareText: { color: '#6b21a8', fontWeight: '600' },
  chipsScroll: { paddingLeft: 16, paddingRight: 16, paddingBottom: 12 },
  chipWrap: { marginRight: 10 },
  chipFancy: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  chipEmoji: { marginRight: 8 },
  chipLabel: { color: '#2b021f' },
  inputRowMain: { flexDirection: 'row', padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)' },
  inputPill: { flex: 1, backgroundColor: '#fff', borderRadius: 28, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, shadowColor: '#ff7aa6', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  input: { flex: 1, paddingHorizontal: 8, fontSize: 16 },
  micWrap: { backgroundColor: '#ff7aa6', padding: 10, borderRadius: 20, marginLeft: 8 },
  upBtn: { marginLeft: 12, backgroundColor: '#ff4f8b', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#ff7aa6', shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  backdropFallback: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,10,16,0.44)', zIndex: 2000, elevation: 2 },
  fullscreen: { flex: 1 },
  kav: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent' },
});
