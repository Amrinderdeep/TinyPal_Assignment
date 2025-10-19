import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, ImageBackground, Pressable, Dimensions } from 'react-native';
import API from '../api';
import { Card } from '../components/UI';

const flashImg = require('../../assets/flashcard.png');
const bulbImg = require('../../assets/bulb.png');

export default function FlashCardScreen({ openTinu, onBack }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const IMAGE_HEIGHT = Math.round(height * 0.5);
  const OVERLAY_TOP = IMAGE_HEIGHT - 60;
  const OVERLAY_HEIGHT = Math.round(height * 0.5) + 20;

  useEffect(() => {
    let mounted = true;
    API.fetchP13nAnswers()
      .then((res) => {
        if (!mounted) return;
        const cards = res.flash_cards || [];
        setCards(
          cards.map((c) => ({
            id: c.id,
            title: c.title || c.heading,
            sub_heading: c.sub_heading || c.subHeading || '',
            content: c.content || c.summary || c.answer || '',
            image_url: API.makeImageUrl(c.image_url),
            tinu_activation: c.tinu_activation,
          }))
        );
      })
      .catch((e) => console.warn(e.message))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => onBack && onBack()}>
          <Text style={styles.backText}>{'‹'}</Text>
        </Pressable>
        <View style={styles.vertDivider} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>UNLEARN OLD PATTERNS</Text>
          <Text style={styles.small}>No Distractions 101</Text>
        </View>
      </View>

      {cards.length > 0 && (
        <View style={styles.storyBarWrap}>
          <View style={styles.storyBarTrack} />
          <View style={[styles.storyBarIndicator, { width: ((index + 1) / Math.max(1, cards.length)) * 100 + '%' }]} />
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {cards.length === 0 ? (
            <Text style={{ color: '#666', padding: 16 }}>No flash cards available</Text>
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                ref={listRef}
                data={cards}
                keyExtractor={(_, i) => String(i)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => setIndex(Math.round(ev.nativeEvent.contentOffset.x / width))}
                renderItem={({ item }) => (
                  <View style={{ width, alignItems: 'center' }}>
                    <ImageBackground source={ item.image_url ? { uri: item.image_url } : flashImg } style={[styles.bgImage, { height: IMAGE_HEIGHT, width }]} resizeMode="cover">
                    </ImageBackground>

                    <View style={[styles.flashOverlay, { top: OVERLAY_TOP, height: OVERLAY_HEIGHT }]}> 
                      <Text style={styles.flashIndex}>{/* optional index */}</Text>
                      <Text style={styles.flashTitle}>{item.title}</Text>
                      <Text style={styles.flashText}>{item.content}</Text>

                      {item.tinu_activation && (
                        <Pressable
                          onPress={() => {
                            API.activateTinu(item.tinu_activation.parameters).catch((e) => console.warn('activateTinu failed', e.message));
                            openTinu({ context: item.tinu_activation.parameters, source: 'flash_card', card: item });
                          }}
                          style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'center' }}
                        >
                          <Text style={{ color: '#fff', fontWeight: '700' }}>{item.tinu_activation.cta_label || item.tinu_activation.label || 'Ask Tinu'}</Text>
                        </Pressable>
                      )}
                    </View>

                    {/* spacer for mini bar */}
                    <View style={{ height: 90 }} />
                  </View>
                )}
              />

              <Pressable
                style={[styles.tapZone, { left: 0 }]}
                onPress={() => {
                  const next = index - 1 < 0 ? cards.length - 1 : index - 1;
                  listRef.current && listRef.current.scrollToIndex({ index: next });
                }}
              />
              <Pressable
                style={[styles.tapZone, { right: 0 }]}
                onPress={() => {
                  const next = index + 1 > cards.length - 1 ? 0 : index + 1;
                  listRef.current && listRef.current.scrollToIndex({ index: next });
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  headerRow: { padding: 12, paddingTop: 36, backgroundColor: '#00042bff', flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#fff' },
  small: { color: '#d1b7c6', marginTop: 4, fontSize: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  backText: { color: '#fff', fontSize: 40, lineHeight: 20 },
  vertDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)', marginRight: 8 },
  bgImage: { resizeMode: 'cover' },
  flashOverlay: { position: 'absolute', borderRadius: 20, padding: 20, backgroundColor: '#3978a6', zIndex: 3 },
  flashIndex: { position: 'absolute', top: 12, left: 12, fontSize: 20, color: '#fff', fontWeight: '700' },
  flashTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8 },
  flashText: { color: '#dbeafe', marginTop: 8, lineHeight: 20 },
  
  tapZone: { position: 'absolute', top: 0, bottom: 0, width: '30%' },
  storyBarWrap: { height: 8, backgroundColor: 'transparent' },
  storyBarTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16, borderRadius: 2 },
  storyBarIndicator: { height: 2, backgroundColor: '#fff', position: 'absolute', left: 16, top: 0, borderRadius: 2 },
});
